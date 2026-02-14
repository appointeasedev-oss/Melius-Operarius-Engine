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
            print("No instructions found in Pantry.")
            return

        all_files, file_contents = self.get_all_files()
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        is_new_year = "01-01" in current_date or "12-31" in current_date
        
        base_prompt = """
        You are the Melius Operarius AI Programmer. Your goal is to build and maintain a professional, high-quality website based on instructions from a Pantry bucket.
        
        QUALITY GUIDELINES:
        - Use modern, responsive CSS (Flexbox/Grid).
        - Ensure accessible color contrast and clean typography.
        - Create interactive elements with smooth transitions.
        - For multi-page sites, create separate HTML files for each page.
        - Use a shared 'styles.css' and 'script.js' for consistency.
        
        STRICT ADHERENCE:
        - 'strict_text' MUST be used exactly as provided. No modifications.
        - 'theme' colors must be applied precisely.
        - AI can only improve user content for better presentation (e.g. columns, cards).
        
        MODULAR COMPONENTS:
        - For special tags ({form}, {countdown}, etc.), create clean, blank-white modular components in the code.
        - These components should be styled in CSS so they can be easily customized by the user later.
        
        FORM HANDLING:
        - IMPORTANT: Before adding a {form}, you MUST instruct the system to create a new Pantry bucket.
        - Use the 'request_new_form_bucket' field in your response.
        - Once you have the bucket name, link the form to POST data to: https://getpantry.cloud/apiv1/pantry/[PANTRY_ID]/basket/[BUCKET_NAME]
        """

        system_prompt = f"""
        {base_prompt}
        
        DATE: {current_date}
        IS NEW YEAR: {is_new_year}
        PANTRY_ID: {self.pantry_id}
        
        PANTRY INSTRUCTIONS:
        {json.dumps(instructions, indent=2)}
        
        CURRENT WEBSITE FILES:
        {json.dumps(file_contents, indent=2)}

        OUTPUT FORMAT (JSON):
        {{
          "needs_update": true/false,
          "request_new_form_bucket": [
            {{ "form_id": "unique_id", "description": "Form purpose" }}
          ],
          "modifications": [
            {{ "path": "path/to/file", "description": "detailed sync reason", "type": "edit/new", "content": "Full content for new or updated file" }}
          ]
        }}
        """

        try:
            plan = self.client.chat(system_prompt)
        except Exception as e:
            print(f"AI failed to generate plan: {e}")
            return
        
        new_form_requests = plan.get("request_new_form_bucket", [])
        if new_form_requests:
            forms_registry = self.get_pantry_data("melius_forms") or {"forms": []}
            existing_ids = [f["form_id"] for f in forms_registry["forms"]]
            
            for req in new_form_requests:
                if req["form_id"] not in existing_ids:
                    bucket_name = f"form_{req['form_id']}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
                    forms_registry["forms"].append({
                        "form_id": req["form_id"],
                        "bucket_name": bucket_name,
                        "created_at": datetime.datetime.now().isoformat()
                    })
                    self.post_pantry_data(bucket_name, {"submissions": []})
            
            self.post_pantry_data("melius_forms", forms_registry)
            instructions["forms_registry"] = forms_registry
            system_prompt += f"\n\nUPDATED FORMS REGISTRY: {json.dumps(forms_registry)}"
            plan = self.client.chat(system_prompt)

        if not plan.get("needs_update", False):
            print("Website is synchronized with Pantry.")
            return

        for mod in plan.get("modifications", []):
            content = mod.get("content")
            if content:
                self.write_file(mod["path"], content)
                print(f"Applied {mod['type']}: {mod['path']}")

        print("Melius Operarius sync complete.")
