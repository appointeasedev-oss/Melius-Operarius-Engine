import os
import json
import glob
import shutil
from llm_client import LLMClient
from sole import SoleManager
from operarius import MeliusOperarius

class MeliusEngine:
    def __init__(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.client = LLMClient(self.root_dir)
        self.operarius = MeliusOperarius()
        self.exclude_dirs = ["melius-engine", ".git", "history", "log", "to-do", "error", ".github"]
        self.sole_manager = SoleManager(self.root_dir)
        self.read_files_cache = {}

    def get_all_files(self):
        all_files = []
        for root, dirs, files in os.walk(self.root_dir):
            dirs[:] = [d for d in dirs if d not in self.exclude_dirs]
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), self.root_dir)
                all_files.append(rel_path)
        return all_files

    def read_file(self, file_path):
        if file_path in self.read_files_cache:
            return self.read_files_cache[file_path]
            
        full_path = os.path.join(self.root_dir, file_path)
        if os.path.exists(full_path) and os.path.isfile(full_path):
            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    self.read_files_cache[file_path] = content
                    return content
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
        return None

    def write_file(self, file_path, content):
        # RESTRICTION: Only modify UI files. Do not touch build/dependency files.
        restricted_files = ["vercel.json", "package.json", "pnpm-lock.yaml", "package-lock.json", "vite.config.ts", "tsconfig.json"]
        if os.path.basename(file_path) in restricted_files:
            print(f"Modification restricted: {file_path}")
            return False

        # Ensure it's a UI related file (tsx, css, html, etc.)
        ui_extensions = [".tsx", ".css", ".html", ".js", ".ts", ".jsx"]
        if not any(file_path.endswith(ext) for ext in ui_extensions):
            print(f"Modification restricted (Not UI): {file_path}")
            return False

        full_path = os.path.join(self.root_dir, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        self.read_files_cache[file_path] = content
        return True

    def log_event(self, folder, data):
        folder_path = os.path.join(self.root_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        count = len(glob.glob(f"{folder_path}/*.json")) + 1
        file_path = os.path.join(folder_path, f"{count}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return file_path

    def run(self):
        # Trigger Operarius logic
        self.operarius.run()

        event = self.sole_manager.get_event()
        
        # Reset logic: "if in it no chnage written ai doo nothing and clean all logs and reset system"
        if event.lower() == "no change":
            print("Resetting system as requested...")
            for d in ["log", "error", "to-do", "history"]:
                dir_path = os.path.join(self.root_dir, d)
                if os.path.exists(dir_path):
                    shutil.rmtree(dir_path)
                os.makedirs(dir_path, exist_ok=True)
            return

        # 1. Check for existing state
        todos_paths = glob.glob(os.path.join(self.root_dir, "to-do/*.json"))
        errors_paths = glob.glob(os.path.join(self.root_dir, "error/*.json"))
        
        existing_todos = []
        for p in todos_paths:
            try:
                with open(p, 'r') as f: existing_todos.append(json.load(f))
            except: pass
            
        existing_errors = []
        for p in errors_paths:
            try:
                with open(p, 'r') as f: existing_errors.append(json.load(f))
            except: pass

        all_files = self.get_all_files()
        
        # 2. Initial Analysis & Planning
        prompt = f"""
        You are Melius Engine, an autonomous AI agent. 
        Current Event/Request from event.json: {event if event else "Blank (Suggest a theme based on upcoming season/events)"}
        
        Repository files: {all_files}
        Existing To-Dos: {existing_todos}
        Existing Errors: {existing_errors}

        CONSTRAINTS:
        1. You can ONLY modify UI-related files (CSS, TSX components, basic UI theme).
        2. DO NOT modify build files, configurations, or dependencies (vercel.json, package.json, vite.config.ts, etc.).
        3. Do not ask to re-read files if they are already in the context.
        4. Focus exclusively on UI theme changes based on the event: {event}.
        
        Analyze the project and suggest UI/Theme improvements. 
        If you need to read specific files, list them in "files_to_read".
        
        
CRITICAL:
Return JSON in this exact format:

{{
  "files_to_read": [],
  "analysis": "string",
  "improvements": [
    {{
      "file": "relative/path.tsx",
      "description": "precise UI change"
    }}
  ]
}}

Do NOT add extra keys.
Do NOT nest improvements.
Do NOT return prose outside JSON.

        """
        
        plan = self.client.chat(prompt)
        
        # 3. Read requested files for context
        requested_files = plan.get("files_to_read", [])
        file_context = {f: self.read_file(f) for f in requested_files}
        
        # 4. Log the plan
        self.log_event("log", {
            "analysis": plan.get("analysis"),
            "improvements": plan.get("improvements"),
            "files_read": requested_files,
            "event": event
        })
        
        # 5. Execute improvements
        for imp in plan.get("improvements", []):
            file_path = imp["file"]
            current_content = self.read_file(file_path)
            if current_content is None: continue

            edit_prompt = f"""
            Modify UI for: {file_path}
            Description: {imp['description']}
            Event: {event}
            Context: {file_context}
            Current Content:
            {current_content}

            Respond ONLY in JSON format with the full new content.
            {{
                "new_content": "..."
            }}
            """
            result = self.client.chat(edit_prompt)
            new_content = result.get("new_content")
            if not new_content: continue
            
            if self.write_file(file_path, new_content):
                # 6. Verify
                verify_prompt = f"""
                Verify UI changes in {file_path}.
                Intent: {imp['description']}
                New Content:
                {new_content}

                Respond ONLY in JSON format.
                {{
                    "verified": true/false,
                    "error": "description if any",
                    "pending": "what is left if any"
                }}
                """
                verification = self.client.chat(verify_prompt)
                
                if not verification.get("verified"):
                    if verification.get("error"):
                        fix_prompt = f"Fix UI error in {file_path}: {verification['error']}. Respond ONLY with {{'new_content': '...'}}"
                        fix_result = self.client.chat(fix_prompt)
                        fixed_content = fix_result.get("new_content")
                        if fixed_content:
                            self.write_file(file_path, fixed_content)
                    
                    if verification.get("pending"):
                        self.log_event("to-do", {
    "file": file_path,
    "pending": verification["pending"]
})

if __name__ == "__main__":
    engine = MeliusEngine()
    engine.run()
