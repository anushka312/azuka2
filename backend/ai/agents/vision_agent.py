import os
from google import genai
from google.genai import types
from google.genai.errors import APIError
from dotenv import load_dotenv



from ..prompts.system_prompt import AZUKA_SYSTEM_PROMPT
from ..prompts.daily_prompt import AZUKA_VISION_PROMPT # (or vision_prompt)
from ..schemas.output import FoodVisionOutput
load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Prioritized multimodal models with fallback rotation for vision requests
FALLBACK_VISION_MODELS = [
    "gemini-2.5-flash",       # Primary multimodal model for fast vision analysis
    "gemini-3.5-flash-lite",  # Fallback multimodal model
]

def run_azuka_vision_agent(image_bytes: bytes, mime_type: str = "image/jpeg") -> FoodVisionOutput:
    """
    Passes an image directly to Gemini along with system and vision prompts 
    to return a strictly validated FoodVisionOutput object. Includes fallback rotation.
    """
    combined_system_instruction = f"{AZUKA_SYSTEM_PROMPT}\n\n{AZUKA_VISION_PROMPT}"
    
    contents = [
        types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type,
        ),
        "Analyze this meal image and provide the nutritional and biological breakdown."
    ]

    last_exception = None

    for model_name in FALLBACK_VISION_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=combined_system_instruction,
                    response_mime_type="application/json",
                    response_schema=FoodVisionOutput,
                    temperature=0.3, # Low temperature for precise nutritional extraction
                ),
            )
            return response.parsed
            
        except APIError as e:
            last_exception = e
            continue
        except Exception as e:
            last_exception = e
            continue

    raise RuntimeError(f"All fallback vision models failed to analyze image. Last error: {last_exception}")