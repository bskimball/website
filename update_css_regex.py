import re

file_path = "src/styles/global.css"

new_root_content = """  :root {
    /* Light Mode: Editorial Archives */
    --background: 40 20% 98%;    /* Alabaster Paper */
    --foreground: 20 10% 10%;    /* Warm Deep Ink */
    --card: 40 20% 98%;
    --card-foreground: 20 10% 10%;
    --popover: 40 20% 98%;
    --popover-foreground: 20 10% 10%;
    --primary: 0 72% 38%;        /* Deep Editorial Red */
    --primary-foreground: 40 20% 98%;
    --secondary: 35 15% 90%;     /* Pale Sand/Manila - Pairing Color */
    --secondary-foreground: 20 10% 10%;
    --muted: 35 15% 90%;
    --muted-foreground: 25 5% 45%;
    --accent: 35 15% 90%;
    --accent-foreground: 20 10% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 20 5% 85%;         /* Subtle paper edge */
    --input: 20 5% 85%;
    --ring: 0 72% 38%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0rem;
  }"""

with open(file_path, "r") as f:
    content = f.read()

# Regex to match :root { ... } block
# We use DOTALL to make . match newlines
# We look for :root { followed by content until the next } at the start of a line (or just the closing brace)
# The original file has indentation, so we need to be careful.
# The structure is:
# @layer base {
#   :root {
#     ...
#   }
#   .dark {

pattern = r"  :root \{.*?\n  \}"

match = re.search(pattern, content, re.DOTALL)

if match:
    print("Found :root block.")
    new_content = content.replace(match.group(0), new_root_content)
    with open(file_path, "w") as f:
        f.write(new_content)
    print("Successfully updated CSS.")
else:
    print("Could not find :root block with regex.")
    # Debug: print a snippet where we expect it
    start = content.find(":root {")
    if start != -1:
        print("Snippet around :root:")
        print(content[start : start + 200])
