import os
from google import genai
from google.genai import types
from google.genai.errors import APIError
from dotenv import load_dotenv


from ..prompts.system_prompt import AZUKA_SYSTEM_PROMPT
from ..prompts.daily_prompt import AZUKA_DAILY_PROMPT # (or vision_prompt)
from ..schemas.input import GeneralState, UserState # (if needed)
from ..schemas.output import AzukaDailyOutput
load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Define a prioritized list of text models to rotate through if rate limits hit
FALLBACK_TEXT_MODELS = [
    "gemini-2.5-flash",        # Primary workhorse model
    "gemini-3.5-flash-lite",   # Fast, lightweight fallback model
    "gemini-2.5-flash-lite"    # Alternate backup flash-lite model
]

def run_azuka_daily_agent(general_state: GeneralState, user_state: UserState) -> AzukaDailyOutput:
    """
    Runs the daily biological reasoning agent. Implements automatic fallback 
    across multiple text-based Gemini models if a rate limit (429) occurs.
    """
    payload = {
        "general_state": general_state.model_dump(),
        "user_state": user_state.model_dump()
    }
    
    prompt_content = f"Here is the user's current profile and daily state payload:\n{payload}"
    combined_system_instruction = f"{AZUKA_SYSTEM_PROMPT}\n\n{AZUKA_DAILY_PROMPT}"

    last_exception = None

    # Loop through the model list to handle rate limits gracefully
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
            return response.parsed
            
        except APIError as e:
            # Catch rate limit errors (typically code 429) or server errors and try the next model
            last_exception = e
            continue
        except Exception as e:
            # Catch any other unexpected exceptions and try the next model
            last_exception = e
            continue

    # If all models in the fallback chain fail, raise the final exception
    raise RuntimeError(f"All fallback text models failed to generate daily plan. Last error: {last_exception}")