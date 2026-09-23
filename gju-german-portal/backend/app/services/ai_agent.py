import json
import logging
import os
from typing import Any, Optional

from app.core.config import get_settings
from app.schemas.chat import BudgetCalculationResult, ChatMessage, ChatResponse
from app.services.calculator import calculate_living_budget

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are the official GJU German Year Advisor, an expert, pragmatic, and encouraging advisor supporting German-Jordanian University (GJU) students who are planning their Deutschjahr (German Year: study semester + internship).

Your expertise covers:
1. GJU partner universities and Fachhochschulen across German states.
2. B1/B2 German language proficiency tracks and TestDaF preparation.
3. Statutory Sperrkonto (Blocked Account) regulations, currently benchmarked at €992/month (€11,904/year).
4. German Student Visa (National D-Visa) steps with the German Embassy in Amman (Abdoun).
5. Student life in Germany (WG accommodation, health insurance, student tickets, Semesterbeitrag, Werkstudent / mini-jobs).

STRICT GUARDRAILS & DIRECTIVES:
1. LANGUAGE ADAPTABILITY: You must fluently speak and reply in Arabic (العربية) if the student writes or asks in Arabic, and in English if they write in English. Always keep German terminology clear (e.g. Sperrkonto, Girokonto, WG, Zulassung, Semesterbeitrag, Ausländerbehörde).
2. OUT-OF-SCOPE RAIL: Strictly refuse questions unrelated to GJU, studying or interning in Germany, visas, or German student life. Politely redirect the user back to their German Year preparations. If in Arabic, reply: "أعتذر، يمكنني فقط المساعدة في كل ما يخص السنة الألمانية لطلاب الجامعة الألمانية الأردنية (GJU)، ومتطلبات التأشيرة، والدراسة والمعيشة في ألمانيا."
3. FINANCIAL / INVESTMENT RAIL: If the user asks for investment advice, cryptocurrency, stocks, or speculative financial planning, you MUST respond: "I can only assist with statutory living cost estimates and German student visa requirements." (or in Arabic: "يمكنني فقط المساعدة في تقدير تكاليف المعيشة القانونية ومتطلبات تأشيرة الطالب الألمانية.").
4. MATH GROUNDING RAIL: NEVER perform raw budget arithmetic or invent cost totals in conversational text. Whenever living costs, rent, city expenses, or budgets are mentioned, you MUST invoke the `calculate_living_budget` tool. Base all financial advice on the deterministic output of this tool.
5. LEGAL DISCLAIMER RAIL: Remind students when appropriate that all cost estimates and guidelines are advisory benchmarks; final authority on visa issuance and financial sufficiency rests with the German Embassy in Amman.

Keep answers concise, well-structured, supportive, and formatted in clear GitHub markdown.
"""


def _check_speculative_rail(text: str) -> bool:
    keywords = ["crypto", "bitcoin", "ethereum", "stock market", "forex", "trading", "invest in stocks", "doge"]
    lowered = text.lower()
    return any(k in lowered for k in keywords)


async def generate_chat_response(messages: list[ChatMessage], language: str = "en") -> ChatResponse:
    settings = get_settings()
    gemini_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY", "")
    openai_key = settings.openai_api_key or os.getenv("OPENAI_API_KEY", "")

    # Check last user query for quick guardrails
    last_user_msg = next((m.content for m in reversed(messages) if m.role == "user"), "")
    if _check_speculative_rail(last_user_msg):
        if language == "ar":
            reply = "يمكنني فقط المساعدة في تقدير تكاليف المعيشة القانونية ومتطلبات تأشيرة الطالب الألمانية."
        else:
            reply = "I can only assist with statutory living cost estimates and German student visa requirements."
        return ChatResponse(
            reply=reply,
            tool_data=None,
        )

    # 1. Prefer Gemini API if key is set
    if gemini_key:
        try:
            return await _run_gemini(messages, gemini_key, language)
        except Exception as e:
            logger.error("Gemini API error: %s", e, exc_info=True)

    # 2. Fallback to OpenAI API if key is set
    if openai_key:
        try:
            return await _run_openai(messages, openai_key, language)
        except Exception as e:
            logger.error("OpenAI API error: %s", e, exc_info=True)

    # 3. Fallback if no keys or APIs unavailable: Local heuristic advisor with deterministic tool execution
    return _run_heuristic_advisor(messages, language)


async def _run_gemini(messages: list[ChatMessage], api_key: str, language: str = "en") -> ChatResponse:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    captured_tool_data: list[BudgetCalculationResult] = []

    def tool_calculate_living_budget(
        city: str,
        monthly_rent: float,
        has_statutory_insurance: bool = True,
        custom_allowance: Optional[float] = None,
    ) -> str:
        """
        Calculates deterministic German student living budget and Sperrkonto coverage based on city and monthly rent.
        """
        result = calculate_living_budget(
            city=city,
            monthly_rent=monthly_rent,
            has_statutory_insurance=has_statutory_insurance,
            custom_allowance=custom_allowance,
        )
        captured_tool_data.append(result)
        return json.dumps(result.model_dump())

    model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

    # Dynamic language directive
    lang_directive = (
        "\nIMPORTANT: The user's active portal language is ARABIC (العربية). You MUST reply completely in natural, professional Arabic (العربية), while preserving German administrative and academic terminology (e.g. Sperrkonto, WG, BAMF, Girokonto, Semesterbeitrag)."
        if language == "ar"
        else "\nIMPORTANT: The user's active portal language is ENGLISH. You must reply in clear English, preserving German technical terms where helpful."
    )
    instruction = SYSTEM_PROMPT + lang_directive

    chat = client.chats.create(
        model=model_name,
        config=types.GenerateContentConfig(
            system_instruction=instruction,
            tools=[tool_calculate_living_budget],
            temperature=0.3,
        ),
    )

    last_user_msg = next((m.content for m in reversed(messages) if m.role == "user"), "")
    response = chat.send_message(last_user_msg)

    tool_result = captured_tool_data[-1] if captured_tool_data else None
    fallback_msg = "أنا هنا لمساعدتك في كل ما يتعلق بالسنة الألمانية." if language == "ar" else "I am here to assist with your GJU German Year planning."
    return ChatResponse(
        reply=response.text or fallback_msg,
        tool_data=tool_result,
    )


async def _run_openai(messages: list[ChatMessage], api_key: str, language: str = "en") -> ChatResponse:
    from openai import OpenAI

    client = OpenAI(api_key=api_key)
    tool_declaration = {
        "type": "function",
        "function": {
            "name": "calculate_living_budget",
            "description": "Calculates deterministic German student living budget and Sperrkonto coverage based on city and monthly rent.",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "Target German city"},
                    "monthly_rent": {"type": "number", "description": "Expected monthly rent in EUR"},
                    "has_statutory_insurance": {"type": "boolean", "description": "Whether statutory insurance is needed"},
                    "custom_allowance": {"type": "number", "description": "Optional custom allowance in EUR"},
                },
                "required": ["city", "monthly_rent"],
            },
        },
    }

    lang_directive = (
        "\nIMPORTANT: The user's active portal language is ARABIC (العربية). You MUST reply completely in natural Arabic, keeping German technical terms (Sperrkonto, WG, BAMF, Girokonto)."
        if language == "ar"
        else "\nIMPORTANT: The user's active portal language is ENGLISH. You must reply in English."
    )
    oai_messages: list[dict[str, Any]] = [{"role": "system", "content": SYSTEM_PROMPT + lang_directive}]
    for msg in messages:
        oai_messages.append({"role": msg.role, "content": msg.content})

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=oai_messages,
        tools=[tool_declaration],
        tool_choice="auto",
    )

    choice = completion.choices[0]
    if choice.message.tool_calls:
        for tool_call in choice.message.tool_calls:
            if tool_call.function.name == "calculate_living_budget":
                raw_args = json.loads(tool_call.function.arguments)
                budget_result = calculate_living_budget(
                    city=str(raw_args.get("city", "Germany")),
                    monthly_rent=float(raw_args.get("monthly_rent", 500.0)),
                    has_statutory_insurance=bool(raw_args.get("has_statutory_insurance", True)),
                    custom_allowance=float(raw_args["custom_allowance"]) if "custom_allowance" in raw_args else None,
                )

                oai_messages.append(choice.message)
                oai_messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(budget_result.model_dump()),
                })

                followup = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=oai_messages,
                )
                return ChatResponse(
                    reply=followup.choices[0].message.content or budget_result.summary,
                    tool_data=budget_result,
                )

    fallback_msg = "أنا هنا لمساعدتك في كل ما يتعلق بالسنة الألمانية." if language == "ar" else "I am here to assist with your GJU German Year planning."
    return ChatResponse(
        reply=choice.message.content or fallback_msg,
        tool_data=None,
    )


def _run_heuristic_advisor(messages: list[ChatMessage], language: str = "en") -> ChatResponse:
    last_user_msg = next((m.content for m in reversed(messages) if m.role == "user"), "")
    lowered = last_user_msg.lower()

    cities = ["munich", "münchen", "ميونخ", "berlin", "برلين", "frankfurt", "فرانكفورت", "hamburg", "هامبورغ", "darmstadt", "دارمشتات", "stuttgart", "شتوتغارت", "aachen", "آخن", "leipzig", "لايبزيغ", "dresden", "دريسدن"]
    detected_city = "Germany"
    for c in cities:
        if c in lowered:
            detected_city = c.title()
            break

    import re
    rent_match = re.search(r"(?:€|eur\s*|rent\s*(?:of|is|:)?\s*€?)(\d{3,4})", lowered)
    if not rent_match:
        rent_match = re.search(r"(\d{3,4})\s*(?:€|eur|euro|rent|يورو|إيجار|ايجار)", lowered)

    monthly_rent = float(rent_match.group(1)) if rent_match else None

    if monthly_rent or any(k in lowered for k in ["calculate", "cost", "budget", "living", "احسب", "تكلفة", "ميزانية", "معيشة", "مصروف"]):
        rent_val = monthly_rent if monthly_rent is not None else 500.0
        city_val = detected_city if detected_city != "Germany" else "Munich"
        budget = calculate_living_budget(city=city_val, monthly_rent=rent_val)
        
        if language == "ar":
            status_ar = "فائض مالي" if budget.status == "SURPLUS" else "عجز في الميزانية"
            reply = (
                f"### تحليل ميزانية السنة الألمانية لمدينة {budget.city}\n\n"
                f"إليك تفصيل تكاليف المعيشة القانونية المقدرة شهرياً:\n\n"
                f"- **إيجار الغرفة شامل التدفئة (WG/سكن طلاب):** €{budget.monthly_rent:.2f}\n"
                f"- **التأمين الصحي الإلزامي للطلاب (TK/Barmer):** €{budget.statutory_insurance_cost:.2f}\n"
                f"- **المواد التموينية والمصاريف اليومية:** €{budget.grocery_cost:.2f}\n"
                f"- **شريحة الاتصال وفواتير الخدمات:** €{budget.utilities_cost:.2f}\n"
                f"- **إجمالي المصاريف الشهرية المقدرة:** **€{budget.total_monthly_cost:.2f}**\n\n"
                f"مقارنةً بالمصروف الشهري من الحساب المغلق (**€{budget.monthly_allowance:.2f}**)، لديك **{status_ar}** بمقدار **{'+€' if budget.monthly_net >= 0 else '-€'}{abs(budget.monthly_net):.2f} شهرياً**.\n\n"
                f"*ملاحظة: هذه الأرقام استرشادية، وتظل السفارة الألمانية في عمّان هي المرجع الرسمي للفيزا.*"
            )
        else:
            reply = (
                f"### German Year Budget Analysis for {budget.city}\n\n"
                f"Here is your statutory living cost calculation:\n\n"
                f"- **Warm Rent:** €{budget.monthly_rent:.2f}\n"
                f"- **Statutory Student Health Insurance:** €{budget.statutory_insurance_cost:.2f}\n"
                f"- **Estimated Groceries & Food Index:** €{budget.grocery_cost:.2f}\n"
                f"- **Utilities & SIM Card:** €{budget.utilities_cost:.2f}\n"
                f"- **Total Monthly Outlay:** **€{budget.total_monthly_cost:.2f}**\n\n"
                f"Compared to the **€{budget.monthly_allowance:.2f}** monthly payout from your Sperrkonto, "
                f"you have a **{budget.status}** of **{'+€' if budget.monthly_net >= 0 else '-€'}{abs(budget.monthly_net):.2f}/month**.\n\n"
                f"*Note: All estimates are advisory benchmarks. The German Embassy in Amman holds final authority regarding visa requirements.*"
            )
        return ChatResponse(reply=reply, tool_data=budget)

    if language == "ar":
        reply = (
            "أهلاً بك! أنا **المستشار الذكي للسنة الألمانية في الجامعة الألمانية الأردنية (GJU)**. يمكنني مساعدتك في:\n\n"
            "- **حساب ميزانية المعيشة:** مثل *\"احسب تكلفة معيشتي في ميونخ مع إيجار 550 يورو\"* بدقة حسابية تامة.\n"
            "- **إرشادات الحساب المغلق (Sperrkonto):** متطلبات 992 يورو/شهر ومقارنة الشركات (Expatrio, Fintiba, Coracle).\n"
            "- **خطوات مقابلة السفارة الألمانية في عمّان (عبدون):** تجهيز الملفات وتصديق الأوراق.\n"
            "- **الجامعات الشريكة:** معرفة متطلبات اللغة والتخصصات المتوفرة.\n\n"
            "كيف يمكنني مساعدتك اليوم في تحضيرات سنتك الألمانية؟"
        )
    else:
        reply = (
            "Hello! I am your **GJU German Year Advisor**. I can help you with:\n\n"
            "- **Living Cost Calculations:** E.g. *\"Calculate my living cost in Munich with €550 rent\"* (using our deterministic financial engine).\n"
            "- **Sperrkonto Guidance:** Blocked account requirements (€992/month), providers (Expatrio, Fintiba, Coracle).\n"
            "- **Visa Appointment Steps:** German Embassy Amman (Abdoun) checklists and document preparation.\n"
            "- **Partner Universities:** Exploring GJU partner schools and required language levels.\n\n"
            "How can I assist your German Year preparation today?"
        )
    return ChatResponse(reply=reply, tool_data=None)
