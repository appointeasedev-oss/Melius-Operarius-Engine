import os
import json
import requests
import datetime
from llm_client import LLMClient

class MeliusOperarius:
    def __init__(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.client = LLMClient(self.root_dir)
        self.pantry_id = os.getenv("PANTRY_ID")
        self.base_url = f"https://getpantry.cloud/apiv1/pantry/{self.pantry_id}/basket"
        self.exclude_dirs = ["melius-engine", ".git", "history", "log", "to-do", "error", ".github", "node_modules"]
        
    def get_pantry_data(self, basket_name):
        if not self.pantry_id:
            return None
        try:
            response = requests.get(f"{self.base_url}/{basket_name}")
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"Error fetching pantry data ({basket_name}): {e}")
        return None

    def post_pantry_data(self, basket_name, data):
        if not self.pantry_id:
            return
        try:
            requests.post(f"{self.base_url}/{basket_name}", json=data)
        except Exception as e:
            print(f"Error posting pantry data ({basket_name}): {e}")

    def get_all_files(self):
        all_files = []
        file_contents = {}
        for root, dirs, files in os.walk(self.root_dir):
            dirs[:] = [d for d in dirs if d not in self.exclude_dirs]
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), self.root_dir)
                all_files.append(rel_path)
                content = self.read_file(rel_path)
                if content:
                    file_contents[rel_path] = content
        return all_files, file_contents

    def read_file(self, file_path):
        full_path = os.path.join(self.root_dir, file_path)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                return f.read()
        return None

    def write_file(self, file_path, content):
        ui_extensions = [".tsx", ".css", ".html", ".js", ".ts", ".jsx"]
        if not any(file_path.endswith(ext) for ext in ui_extensions):
            return False
            
        full_path = os.path.join(self.root_dir, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return True

    def run(self):
        if not self.pantry_id:
            print("PANTRY_ID not found. Melius Operarius requires a Pantry ID.")
            return

        instructions = self.get_pantry_data("melius_instructions")
        if not instructions:
            print("No instructions found in Pantry. Initializing default...")
            instructions = {
                "theme": {"description": "modern light", "primary_color": "#007bff"},
                "special_mentions": "",
                "pages": [
                    {
                        "id": "home",
                        "title": "Home",
                        "content": "Welcome to our site! {live_time}",
                        "strict_text": "Built with Melius Operarius",
                        "offer_details": ""
                    }
                ]
            }
            self.post_pantry_data("melius_instructions", instructions)

        all_files, file_contents = self.get_all_files()
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        is_new_year = "01-01" in current_date or "12-31" in current_date
        
        system_prompt = f"""
        You are Melius Operarius, an expert AI Web Programmer.
        MISSION: Ensure the website matches the Pantry instructions.
        
        DATE: {current_date}
        IS NEW YEAR: {is_new_year}
        PANTRY_ID: {self.pantry_id}
        
        PANTRY INSTRUCTIONS:
        {json.dumps(instructions, indent=2)}
        
        WEBSITE FILES:
        {json.dumps(file_contents, indent=2)}

        RULES:
        1. Compare files with instructions. If mismatch, update.
        2. THEME: Only modify colors/themes.
        3. CONTENT: AI can improve formatting (e.g. 2 columns).
        4. STRICT TEXT: MUST use 'strict_text' EXACTLY.
        5. TAGS: Implement {{form}}, {{countdown}}, {{live_time}}, etc.
        6. FORMS: Generate unique Pantry buckets for each {{form}}.
        
        CRITICAL: If the current website content does not reflect the instructions above, you MUST set "needs_update": true.
        
        OUTPUT FORMAT (JSON):
        {{
          "needs_update": true/false,
          "modifications": [
            {{ "path": "path/to/file", "description": "sync required", "type": "edit" }}
          ],
          "new_forms": []
        }}
        """

        try:
            plan = self.client.chat(system_prompt)
        except Exception as e:
            print(f"AI failed to generate plan: {e}")
            return
        
        if not plan.get("needs_update", False):
            print("Website is synchronized with Pantry.")
            return

        new_forms = plan.get("new_forms", [])
        if new_forms:
            forms_registry = self.get_pantry_data("melius_forms") or {"forms": []}
            existing_ids = [f["form_id"] for f in forms_registry["forms"]]
            for nf in new_forms:
                if nf["form_id"] not in existing_ids:
                    forms_registry["forms"].append({
                        "form_id": nf["form_id"],
                        "bucket_name": nf["bucket_name"],
                        "created_at": datetime.datetime.now().isoformat()
                    })
            self.post_pantry_data("melius_forms", forms_registry)

        for mod in plan.get("modifications", []):
            if mod["type"] == "new":
                self.write_file(mod["path"], mod["content"])
            elif mod["type"] == "edit":
                current_content = self.read_file(mod["path"])
                edit_prompt = f"Update {mod['path']} for sync: {mod['description']}\nContent:\n{current_content}\nRespond with JSON: {{'new_content': '...'}}"
                try:
                    edit_result = self.client.chat(edit_prompt)
                    new_content = edit_result.get("new_content")
                    if new_content:
                        self.write_file(mod["path"], new_content)
                except Exception as e:
                    print(f"Failed to edit {mod['path']}: {e}")

        print("Melius Operarius sync complete.")
