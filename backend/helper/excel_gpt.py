from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()


class ExcelGPT:
    def __init__(self, temperature, model, api_key_env_var="OPENAI_API_KEY"):
        self.temperature = temperature
        self.model = model
        self.api_key = os.getenv(api_key_env_var)
        self.agent = None

    def create_agent(self, csv_file_path):
        """
        Initializes the agent with the specified CSV file path.
        """
        self.agent = create_csv_agent(
            ChatOpenAI(
                temperature=self.temperature,
                model=self.model,
                api_key=self.api_key,
                streaming=True
            ),
            csv_file_path,
            verbose=False,
            agent_type=AgentType.OPENAI_FUNCTIONS,
        )

    async def run_query(self, query):
        """
        Runs a given query through the agent and returns the result.
        """
        if not self.agent:
            raise ValueError("Agent not initialized. Call create_agent() first.")
        async for chunk in self.agent.astream(query):
            dt = {"content": None, "replace": False}
            if "actions" in chunk:
                continue
            elif "steps" in chunk:
                continue
            elif "output" in chunk:
                dt["content"] = chunk["output"]
            else:
                raise ValueError()
            yield f"data: {json.dumps(dt)}\n\n"
        yield "data: [DONE]\n\n"