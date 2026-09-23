"""
Deterministic Financial Engine for German Student Living Budget.
Pure Python arithmetic: does not allow hallucinated arithmetic.
"""

from typing import Optional
from app.schemas.chat import BudgetCalculationResult

# Official & statutory benchmarks
STATUTORY_MONTHLY_SPERRKONTO_EUR = 992.00
STATUTORY_STUDENT_HEALTH_INSURANCE_EUR = 130.00
BASE_GROCERY_INDEX_EUR = 220.00
BASE_UTILITIES_SIM_EUR = 35.00

CITY_COST_MULTIPLIERS: dict[str, float] = {
    "munich": 1.25,
    "münchen": 1.25,
    "frankfurt": 1.15,
    "berlin": 1.10,
    "hamburg": 1.10,
}


def calculate_living_budget(
    city: str,
    monthly_rent: float,
    has_statutory_insurance: bool = True,
    custom_allowance: Optional[float] = None,
) -> BudgetCalculationResult:
    """
    Calculates student living budget in Germany.
    All arithmetic is performed deterministically.
    """
    normalized_city = city.strip().lower() if city else "default"
    multiplier = CITY_COST_MULTIPLIERS.get(normalized_city, 1.0)

    # Groceries scale slightly with city index
    adjusted_groceries = round(BASE_GROCERY_INDEX_EUR * multiplier, 2)
    insurance_cost = STATUTORY_STUDENT_HEALTH_INSURANCE_EUR if has_statutory_insurance else 0.0
    utilities_cost = BASE_UTILITIES_SIM_EUR

    total_monthly_cost = round(monthly_rent + insurance_cost + adjusted_groceries + utilities_cost, 2)
    allowance = custom_allowance if custom_allowance is not None else STATUTORY_MONTHLY_SPERRKONTO_EUR

    monthly_net = round(allowance - total_monthly_cost, 2)
    annual_net = round(monthly_net * 12.0, 2)
    status = "SURPLUS" if monthly_net >= 0 else "DEFICIT"

    display_city = city.strip().title() if city and city.strip() else "German University Town"

    if status == "SURPLUS":
        summary = (
            f"In {display_city}, your monthly expenses are estimated at €{total_monthly_cost:.2f}. "
            f"Against the standard Sperrkonto monthly payout of €{allowance:.2f}, you have a SURPLUS "
            f"of +€{monthly_net:.2f}/month (+€{annual_net:.2f}/year)."
        )
    else:
        summary = (
            f"In {display_city}, your monthly expenses are estimated at €{total_monthly_cost:.2f}. "
            f"Against the standard Sperrkonto monthly payout of €{allowance:.2f}, you face a DEFICIT "
            f"of -€{abs(monthly_net):.2f}/month (-€{abs(annual_net):.2f}/year). "
            f"A student mini-job (up to €538/month) or additional family support will be needed."
        )

    return BudgetCalculationResult(
        city=display_city,
        city_multiplier=multiplier,
        monthly_rent=round(monthly_rent, 2),
        statutory_insurance_cost=insurance_cost,
        grocery_cost=adjusted_groceries,
        utilities_cost=utilities_cost,
        total_monthly_cost=total_monthly_cost,
        monthly_allowance=allowance,
        monthly_net=monthly_net,
        annual_net=annual_net,
        status=status,
        has_statutory_insurance=has_statutory_insurance,
        summary=summary,
    )
