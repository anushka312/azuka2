import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import APIError

from ai.prompts.system_prompt import AZUKA_SYSTEM_PROMPT
from ai.prompts.vision_prompt import AZUKA_VISION_PROMPT
from ai.schemas.output import FoodVisionOutput


load_dotenv()


client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)


VISION_MODELS = [
    "gemini-2.5-flash"
]


def run_azuka_vision_agent(
    image_bytes: bytes,
    mime_type: str = "image/jpeg"
) -> FoodVisionOutput:

    combined_system_instruction = (
        f"{AZUKA_SYSTEM_PROMPT}\n\n"
        f"{AZUKA_VISION_PROMPT}"
    )

    contents = [
        types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type
        ),
        (
            "Analyze this meal image and provide the nutritional "
            "and biological breakdown."
        )
    ]

    last_exception = None

    for model_name in VISION_MODELS:

        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=combined_system_instruction,
                    response_mime_type="application/json",
                    response_schema=FoodVisionOutput,
                    temperature=0.3
                )
            )

            return response.parsed

        except APIError as error:
            last_exception = error

        except Exception as error:
            last_exception = error

    raise RuntimeError(
        "Vision analysis failed. "
        f"Last error: {last_exception}"
    )