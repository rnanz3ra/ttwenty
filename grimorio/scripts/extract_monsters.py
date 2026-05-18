import fitz
import json
import re

def extract_monsters(pdf_path, start_page, end_page):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return []

    text = ""
    for i in range(start_page, end_page):
        try:
            # Get text blocks to preserve some structure
            text += doc.load_page(i).get_text()
        except:
            pass

    # Normalize newlines slightly but keep them for structure detection
    # text = text.replace('\n', ' ') # Don't do this for monsters, we need lines
    
    # Pattern: Name (Line) -> ND X (Line)
    # We use multiline mode.
    # Capture Name (Line before ND), ND Value, and Body (until next Name/ND)
    
    # Regex explanation:
    # 1. ^([^\n]+) -> Capture a full line (Name candidates)
    # 2. \n\s*ND\s+([0-9/]+) -> Newline, optional space, ND, Value
    # 3. (.*?) -> Body (Non-greedy)
    # 4. (?=\n[^\n]+\n\s*ND\s+[0-9/]+|$) -> Lookahead for next monster or end of string
    
    pattern = r"(?P<name>[^\n]+)\n\s*ND\s+(?P<nd>[0-9/]+)(?P<body>.*?)(?=(?:\n[^\n]+\n\s*ND\s+[0-9/]+)|$)"
    
    matches = re.finditer(pattern, text, re.DOTALL)
    
    monsters = []
    for match in matches:
        name = match.group("name").strip()
        nd = match.group("nd").strip()
        body = match.group("body").strip()
        
        # Clean basic noise from Name (like page headers/footers accidentally caught)
        if len(name) > 50 or "Capítulo" in name or "Ameaças" in name: 
            continue 

        # Try to extract Type and Size (Usually first line of body or close)
        # Standard types: Animal, Construto, Espírito, Humanóide, Monstro, Morto-vivo
        type_match = re.search(r"(Animal|Construto|Espírito|Humanoide|Monstro|Morto-vivo|Morto-Vivo|Planta)", body, re.IGNORECASE)
        monster_type = type_match.group(1).title() if type_match else "Monstro"
        
        # Try to extract HP and Defense
        hp_match = re.search(r"Pontos de Vida\s*(\d+)", body)
        hp = int(hp_match.group(1)) if hp_match else 0
        
        def_match = re.search(r"Defesa\s*(\d+)", body)
        defense = int(def_match.group(1)) if def_match else 0
        
        # Determine Role based on ND (Heuristic)
        # In T20, role is usually explicitly stated "Lacaio", "Solo", but usually in the line with size.
        # Let's verify string presence
        role = "Lacaio"
        if "Solo" in body: role = "Solo"
        elif "Especial" in body: role = "Especial"
        elif "Chefe" in body: role = "Chefe"

        # Determine Size
        size = "Médio"
        if "Minúsculo" in body: size = "Minúsculo"
        elif "Pequeno" in body: size = "Pequeno"
        elif "Grande" in body: size = "Grande"
        elif "Enorme" in body: size = "Enorme"
        elif "Colossal" in body: size = "Colossal"

        monsters.append({
            "id": name.lower().replace(" ", "-"),
            "name": name,
            "level": nd, # ND is string (1/4, 20, etc)
            "type": monster_type,
            "size": size,
            "role": role,
            "hp": hp,
            "defense": defense,
            "attributes": { # Placeholder
                "for": 0, "des": 0, "con": 0, "int": 0, "sab": 0, "car": 0
            },
            "attacks": [], # Parsing attacks is hard, will leave empty for now
            "description": body[:1000] # Full stat block in description
        })

    return monsters

if __name__ == "__main__":
    # Monster Chapter Range (approx)
    monsters = extract_monsters(r"C:\PROJETOS\tormenta20APP\Livros\T20 - Livro Básico.pdf", 290, 340)
    
    output_path = r"C:\PROJETOS\tormenta20APP\grimorio\data\monsters.json"
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(monsters, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully extracted {len(monsters)} monsters to {output_path}")
