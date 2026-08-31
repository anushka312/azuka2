from datetime import datetime
from bson import ObjectId

from fastapi import HTTPException

from app.database.cycle_repository import (
    create_cycle,
    get_cycle_by_id,
    get_cycle_history,
    get_latest_cycle,
    update_cycle
)

from app.database.user_repository import (
    update_user
)

from app.schemas.cycle_schema import (
    CycleCreate,
    CycleUpdate
)


def create_cycle_record(
    user_id: str,
    cycle_data: CycleCreate
):

    try:
        cycle_dict = cycle_data.model_dump()

        cycle_dict["user_id"] = ObjectId(
            user_id
        )

        cycle_dict["created_at"] = datetime.utcnow()

        cycle_id = create_cycle(cycle_dict)

        update_user(
            user_id,
            {
                "cycle.last_period_start_date":
                    cycle_data.period_start_date
            }
        )

        return {
            "cycle_id": cycle_id,
            "message": "Cycle record created successfully."
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


def get_user_cycle_history(
    user_id: str
):

    try:
        cycles = get_cycle_history(user_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id."
        )

    for cycle in cycles:

        cycle["_id"] = str(
            cycle["_id"]
        )

        cycle["user_id"] = str(
            cycle["user_id"]
        )

        if cycle.get("created_at"):
            cycle["created_at"] = cycle[
                "created_at"
            ].isoformat()

    return cycles


def get_latest_user_cycle(
    user_id: str
):

    try:
        cycle = get_latest_cycle(user_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id."
        )

    if not cycle:
        raise HTTPException(
            status_code=404,
            detail="No cycle history found."
        )

    cycle["_id"] = str(
        cycle["_id"]
    )

    cycle["user_id"] = str(
        cycle["user_id"]
    )

    if cycle.get("created_at"):
        cycle["created_at"] = cycle[
            "created_at"
        ].isoformat()

    return cycle


def update_cycle_record(
    cycle_id: str,
    cycle_data: CycleUpdate
):

    try:
        existing_cycle = get_cycle_by_id(
            cycle_id
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid cycle_id."
        )

    if not existing_cycle:
        raise HTTPException(
            status_code=404,
            detail="Cycle record not found."
        )

    update_data = cycle_data.model_dump(
        exclude_unset=True
    )

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update."
        )

    update_cycle(
        cycle_id,
        update_data
    )

    return {
        "cycle_id": cycle_id,
        "message": "Cycle record updated successfully."
    }