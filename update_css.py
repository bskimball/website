import sys

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

try:
    with open(file_path, "r") as f:
        lines = f.readlines()

    start_index = -1
    end_index = -1

    for i, line in enumerate(lines):
        if line.strip() == ":root {" and lines[i + 1].strip().startswith(
            "--background: 171 80% 4%;"
        ):
            start_index = i
        if (
            start_index != -1
            and line.strip() == "}"
            and lines[i - 1].strip().startswith("--radius: 0rem;")
        ):
            end_index = i
            break

    if start_index != -1 and end_index != -1:
        print(f"Found block from line {start_index + 1} to {end_index + 1}")
        # Replace lines
        lines[start_index : end_index + 1] = [new_root_content + "\n"]

        with open(file_path, "w") as f:
            f.writelines(lines)
        print("Successfully updated CSS")
    else:
        print("Could not find the target block")
        sys.exit(1)

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
