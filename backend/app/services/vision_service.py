from ai.agents.vision_agent import run_azuka_vision_agent


def analyze_food_image(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
):
    return run_azuka_vision_agent(
        image_bytes=image_bytes,
        mime_type=mime_type,
    )