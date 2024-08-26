import os
import json
from openai import AsyncOpenAI
from utilities.custom_lib import post_process_response
from dotenv import load_dotenv

load_dotenv()


class BaseGPT:
    def __init__(self, temperature, namespace, model_name):
        self.namespace = namespace
        self.temperature = temperature
        self.model_name = model_name

        self.api_key = os.environ.get("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def _make_openai_call(self, messages):
        params = {
            "model": self.model_name,
            "temperature": self.temperature,
            "messages": messages,
            "stream": True,
            "seed": 25,
        }

        buffer = ""
        response = await self.client.chat.completions.create(**params)
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content is not None:
                current_chunk = chunk.choices[0].delta.content

                buffer += current_chunk
                buffer, is_changed = post_process_response(buffer)

                if is_changed:
                    yield f"""data: {
                        json.dumps(
                            {
                                "content":buffer,
                                "replace": True
                            }
                        )
                    }\n\n"""
                else:
                    yield f"""data: {
                        json.dumps(
                            {
                                "content":current_chunk,
                                "replace": False
                            }
                        )
                    }\n\n"""
        yield 'data: [DONE]\n\n'