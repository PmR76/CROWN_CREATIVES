import os

# Files your site MUST have for a clean deployment
REQUIRED_FILES = [
    "index.html",
    "assets/css/header.css",
    "assets/css/footer.css",
    "assets/css/home.css",
    "assets/js/theme.js",
    "assets/js/hero-gallery.js",
]

def print_tree(start_path, prefix=""):
    """Recursively prints the folder tree."""
    try:
        items = sorted(os.listdir(start_path))
    except PermissionError:
        print(prefix + "└── [Permission Denied]")
        return

    for i, item in enumerate(items):
        path = os.path.join(start_path, item)
        connector = "└── " if i == len(items) - 1 else "├── "
        print(prefix + connector + item)

        if os.path.isdir(path):
            extension = "    " if i == len(items) - 1 else "│   "
            print_tree(path, prefix + extension)

def check_required_files(base_path):
    """Checks if required files exist."""
    print("\nChecking required files...\n")
    all_ok = True

    for file in REQUIRED_FILES:
        full_path = os.path.join(base_path, file)
        if os.path.exists(full_path):
            print(f"✔ OK: {file}")
        else:
            print(f"✖ MISSING: {file}")
            all_ok = False

    return all_ok

if __name__ == "__main__":
    base = os.getcwd()

    print("\n📁 PROJECT FILE TREE\n")
    print_tree(base)

    print("\n----------------------------------------")
    ok = check_required_files(base)
    print("----------------------------------------\n")

    if ok:
        print("✅ All required files found. Safe to deploy.")
    else:
        print("❌ Missing files detected. Fix before deployment.")
