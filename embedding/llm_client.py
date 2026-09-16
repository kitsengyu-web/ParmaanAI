import json
import os

from functools import lru_cache
from typing import Any

from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel


load_dotenv()


class LLMClient:
    """
    Groq client for grounded BIS recommendations.

    A single instance is reused across API requests.
    """

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set. "
                "Add it to your .env file."
            )

        self.model = os.getenv(
            "GROQ_MODEL",
            "openai/gpt-oss-120b"
        )

        self.client = Groq(
            api_key=api_key
        )

    def generate(
        self,
        prompt: str
    ) -> str:

        if not prompt or not prompt.strip():
            raise ValueError(
                "Prompt cannot be empty."
            )

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=1,
            max_completion_tokens=2048,
            top_p=1,
            reasoning_effort="medium",
            stream=False
        )

        output = completion.choices[0].message.content

        if not output:
            raise RuntimeError(
                "Groq returned an empty response."
            )

        return output.strip()

    def generate_json(
        self,
        prompt: str,
        schema: dict[str, Any],
        response_model: type[BaseModel],
    ) -> BaseModel:

        if not prompt or not prompt.strip():
            raise ValueError(
                "Prompt cannot be empty."
            )

        if not schema:
            raise ValueError(
                "Schema cannot be empty."
            )

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=1,
            max_completion_tokens=2048,
            top_p=1,
            reasoning_effort="medium",
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "pramaan_response",
                    "schema": schema,
                }
            },
            stream=False
        )

        output = completion.choices[0].message.content

        if not output:
            raise RuntimeError(
                "Groq returned an empty response."
            )

        try:
            data = json.loads(output)

        except json.JSONDecodeError as exc:
            raise RuntimeError(
                "Groq returned invalid JSON."
            ) from exc

        if not isinstance(data, dict):
            raise RuntimeError(
                "Groq JSON response must be an object."
            )

        try:
            validated_response = response_model.model_validate(
                data
            )

        except Exception as exc:
            raise RuntimeError(
                "Groq response failed Pydantic validation."
            ) from exc

        return validated_response


@lru_cache(maxsize=1)
def get_llm_client() -> LLMClient:
    """
    Return the single shared Groq client.

    The client is created only once per API process.
    """

    return LLMClient()
