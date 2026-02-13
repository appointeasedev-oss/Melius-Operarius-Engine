import os
import json
import requests
from llm_client import LLMClient
from sole import SoleManager

class MeliusOperarius:
    def __init__(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.client = LLMClient(self.root_dir)
        self.pantry_id = os.getenv("PANTRY_ID")
        self.base_url = f"https://getpantry.cloud/apiv1/pantry/{self.pantry_id}/basket"
        self.exclude_dirs = ["melius-engine", ".git", "history", "log", "to-do", "error", ".github"]
        
    def get_pantry_data(self, basket_name):
        try:
            response = requests.get(f"{self.base_url}/{basket_name}")
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"Error fetching pantry data: {e}")
        return None

    def post_pantry_data(self, basket_name, data):
        try:
            requests.post(f"{self.base_url}/{basket_name}", json=data)
        except Exception as e:
            print(f"Error posting pantry data: {e}")

    def get_all_files(self):
        all_files = []
        for root, dirs, files in os.walk(self.root_dir):
            dirs[:] = [d for d in dirs if d not in self.exclude_dirs]
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), self.root_dir)
                all_files.append(rel_path)
        return all_files

    def read_file(self, file_path):
        full_path = os.path.join(self.root_dir, file_path)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                return f.read()
        return None

    def write_file(self, file_path, content):
        full_path = os.path.join(self.root_dir, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)

    def run(self):
        if not self.pantry_id:
            print("PANTRY_ID not found in environment variables.")
            return

        instructions = self.get_pantry_data("melius_instructions")
        if not instructions:
            print("No instructions found in Pantry. Using default structure.")
            # Create a default structure if it doesn't exist for easier testing/setup
            instructions = {
                "theme": {"description": "dark cosmic"},
                "pages": [],
                "special_tags": ["{form}", "{countdown}", "{live_time}", "{sales_banner}", "{discount_banner}", "{product_banner}", "{image}", "{video}"]
            }
            self.post_pantry_data("melius_instructions", instructions)

        all_files = self.get_all_files()
        
        # System Prompt for Operarius
        system_prompt = f"""
        You are Melius Operarius, an expert web developer and manager.
        You manage websites based on data from a Pantry bucket.
        
        Current Instructions from Pantry: {json.dumps(instructions)}
        Current Project Files: {all_files}

        CORE CAPABILITIES & CONSTRAINTS:
        1. THEME: Only modify colors (hex codes) unless a holiday (like New Year) or specific offer is mentioned.
        2. HOLIDAYS/OFFERS: Add banners or wishes ONLY if explicitly mentioned in the instructions or if it's a major holiday like New Year.
        3. PAGES: You can add new HTML pages.
        4. STRICT TEXT: If 'strict_text' is provided for a page, use it EXACTLY without changing a single word.
        5. AI CONTENT: You don't write much content; you improve user-provided text to make it presentable (e.g., converting to columns or lists).
        6. SPECIAL TAGS:
           - {{form}}Description{{/form}}: Create a contact/input form.
           - {{countdown}}Date{{/countdown}}: Add a countdown timer.
           - {{live_time}}: Show current time.
           - {{sales_banner}}Text{{/sales_banner}}, {{discount_banner}}Text{{/discount_banner}}
           - {{product_banner}}Name|ImageURL|Price|BuyLink{{/product_banner}}
           - {{image}}URL{{/image}}, {{video}}URL{{/video}}
        
        7. FORM INTEGRATION:
           For any {{form}}, you must:
           - Create a unique basket name for that form.
           - Register it in the 'melius_forms' basket.
           - Generate JavaScript to POST form data to the new Pantry basket.

        OUTPUT FORMAT:
        Respond ONLY with a JSON object:
        {{
          "files_to_modify": [
            {{ "path": "path/to/file", "description": "detailed change description" }}
          ],
          "new_pages": [
            {{ "path": "path/to/new.html", "content": "full html content" }}
          ]
        }}
        """
        
        plan = self.client.chat(system_prompt + "\nPlan the updates and new pages. Return JSON.")
        
        # Execute Modifications
        for mod in plan.get("files_to_modify", []):
            content = self.read_file(mod["path"])
            if content:
                edit = self.client.chat(f"Update {mod['path']}: {mod['description']}\nContent:\n{content}")
                self.write_file(mod["path"], edit.get("new_content", content))

        # Create New Pages
        for page in plan.get("new_pages", []):
            self.write_file(page["path"], page["content"])
            
        print("Melius Operarius run complete.")

if __name__ == "__main__":
    engine = MeliusOperarius()
    engine.run()
