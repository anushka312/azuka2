from datetime import date, datetime


def calculate_cycle_day(
    period_start_date: str | date,
    target_date: str | date,
    cycle_length: int = 28,
) -> int:

    if isinstance(period_start_date, str):
        start = date.fromisoformat(period_start_date)
    else:
        start = period_start_date

    if isinstance(target_date, str):
        target = date.fromisoformat(target_date)
    else:
        target = target_date

    days_since_start = (target - start).days

    # If target is before the latest period start,
    # return day 1 rather than a negative value.
    if days_since_start < 0:
        return 1

    cycle_day = (days_since_start % cycle_length) + 1

    return cycle_day


def calculate_cycle_phase(
    cycle_day: int,
    period_duration: int = 5,
    cycle_length: int = 28,
) -> str:

    # Menstrual phase
    if cycle_day <= period_duration:
        return "Menstrual"

    # Approximate ovulation around the middle of the cycle.
    # For a 28-day cycle this is approximately day 14.
    ovulation_day = round(cycle_length / 2)

    # Short ovulatory window
    if cycle_day in {
        ovulation_day - 1,
        ovulation_day,
        ovulation_day + 1,
    }:
        return "Ovulation"

    # Follicular phase
    if cycle_day < ovulation_day:
        return "Follicular"

    # Luteal phase
    return "Luteal"


def calculate_cycle_info(
    period_start_date: str | date,
    target_date: str | date,
    cycle_length: int = 28,
    period_duration: int = 5,
) -> dict:

    cycle_day = calculate_cycle_day(
        period_start_date=period_start_date,
        target_date=target_date,
        cycle_length=cycle_length,
    )

    phase = calculate_cycle_phase(
        cycle_day=cycle_day,
        period_duration=period_duration,
        cycle_length=cycle_length,
    )

    return {
        "cycle_day": cycle_day,
        "phase": phase,
        "cycle_length": cycle_length,
        "period_duration": period_duration,
    }