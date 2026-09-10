import os

from google import genai
from google.genai import types
from google.genai.errors import APIError
from dotenv import load_dotenv

from ..prompts.system_prompt import AZUKA_SYSTEM_PROMPT
from ..prompts.daily_prompt import AZUKA_DAILY_PROMPT
from ..schemas.input import GeneralState, UserState
from ..schemas.output import AzukaDailyOutput


load_dotenv()

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)


FALLBACK_TEXT_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
]


def run_azuka_daily_agent(
    general_state: GeneralState,
    user_state: UserState
) -> AzukaDailyOutput:

    payload = {
        "general_state": general_state.model_dump(),
        "user_state": user_state.model_dump(),
    }

    prompt_content = (
        "Here is the user's current profile and daily state payload:\n"
        f"{payload}"
    )

    combined_system_instruction = (
        f"{AZUKA_SYSTEM_PROMPT}\n\n"
        f"{AZUKA_DAILY_PROMPT}"
    )

    last_exception = None

    for model_name in FALLBACK_TEXT_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt_content,
                config=types.GenerateContentConfig(
                    system_instruction=combined_system_instruction,
                    response_mime_type="application/json",
                    response_schema=AzukaDailyOutput,
                    temperature=0.4,
                ),
            )

            if response.parsed is None:
                raise ValueError(
                    f"Model {model_name} returned no parsed response."
                )

            return response.parsed

        except APIError as e:
            last_exception = e
            print(
                f"[AZUKA DAILY AGENT] API error with "
                f"{model_name}: {e}"
            )
            continue

        except Exception as e:
            last_exception = e
            print(
                f"[AZUKA DAILY AGENT] Error with "
                f"{model_name}: {e}"
            )
            continue

    raise RuntimeError(
        "All fallback text models failed to generate "
        f"daily plan. Last error: {last_exception}"
    )