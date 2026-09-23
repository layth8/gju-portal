from typing import Literal
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    language: Literal["en", "ar"] = "en"


class BudgetCalculationResult(BaseModel):
    city: str
    city_multiplier: float
    monthly_rent: float
    statutory_insurance_cost: float
    grocery_cost: float
    utilities_cost: float
    total_monthly_cost: float
    monthly_allowance: float
    monthly_net: float
    annual_net: float
    status: Literal["SURPLUS", "DEFICIT"]
    has_statutory_insurance: bool
    summary: str


class ChatResponse(BaseModel):
    reply: str
    tool_data: BudgetCalculationResult | None = None
