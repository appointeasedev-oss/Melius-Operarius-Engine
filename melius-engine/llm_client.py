import os
import json
import requests
import time
import glob

class LLMClient:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.api_keys = [
            os.getenv(f"OPENROUTER_API_KEY_{i}") for i in range(1, 6)
        ]
        self.api_keys = [k for k in self.api_keys if k]
        # Updated models list based on user request
        self.models = [
            "arcee-ai/trinity-large-preview:free",
            "liquid/lfm-2.5-1.2b-thinking:free",
            "tngtech/tng-r1t-chimera:free",
            "qwen/qwen3-next-80b-a3b-instruct:free",
            "qwen/qwen3-coder:free",
            "nousresearch/hermes-3-llama-3.1-405b:free"
        ]
        # Use numbered history files to avoid confusion
        history_dir = os.path.join(self.root_dir, "history")
        os.makedirs(history_dir, exist_ok=True)
        count = len(glob.glob(f"{history_dir}/*.json")) + 1
        self.history_file = os.path.join(history_dir, f"{count}.json")
        self.history = []

    def save_history(self):
        with open(self.history_file, "w") as f:
            json.dump(self.history, f, indent=2)

    def chat(self, prompt):
        self.history.append({"role": "user", "content": prompt})
        
        for key in self.api_keys:
            for model in self.models:
                try:
                    response = requests.post(
                        url="https://openrouter.ai/api/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {key}",
                            "Content-Type": "application/json",
                        },
                        data=json.dumps({
                            "model": model,
                            "messages": self.history,
                            "response_format": {"type": "json_object"}
                        }),
                        timeout=60 
                    )
                    if response.status_code == 200:
                        result = response.json()
                        content = result['choices'][0]['message']['content']
                        try:
                            json_content = json.loads(content)
                        except json.JSONDecodeError:
                            import re
                            json_match = re.search(r'\{.*\}', content, re.DOTALL)
                            if json_match:
                                try:
                                    json_content = json.loads(json_match.group())
                                except:
                                    json_content = {"content": content}
                            else:
                                json_content = {"content": content}
                        
                        self.history.append({"role": "assistant", "content": content})
                        self.save_history()
                        return json_content
                    else:
                        print(f"Error with model {model}: {response.text}")
                except Exception as e:
                    print(f"Exception with model {model}: {e}")
                time.sleep(1)
        
        # Fallback for testing environment if no API keys are provided
        if not self.api_keys:
             mock_response = {"analysis": "Mock analysis", "files_to_read": [], "improvements": []}
             self.history.append({"role": "assistant", "content": json.dumps(mock_response)})
             self.save_history()
             return mock_response

        raise Exception("All API keys and models failed.")
