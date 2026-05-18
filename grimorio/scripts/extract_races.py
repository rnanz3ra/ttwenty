import fitz
import json
import re

def extract_races(pdf_path, start_page, end_page):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return []

    text = ""
    for i in range(start_page, end_page):
        try:
            page = doc.load_page(i)
            # Add page marker to help splitting but Races usually span 2 pages, 
            # or 1 page per race? In T20 Core it's usually 2 pages per race.
            text += page.get_text() + "\n<PAGE_BREAK>\n"
        except:
            pass

    # Races in T20 Core (Alphabetical usually):
    # Humano, Anão, Dahllan, Elfo, Goblin, Lefou, Minotauro, Qareen, Golem, Hynne, Kliren, Medusa, Osteon, Sereia/Tritão, Sílfide, Suraggel, Trog.
    
    known_races = [
        "Humano", "Anão", "Dahllan", "Elfo", "Goblin", "Lefou", 
        "Minotauro", "Qareen", "Golem", "Hynne", "Kliren", 
        "Medusa", "Osteon", "Sereia", "Tritão", "Sílfide", 
        "Suraggel", "Trog"
    ]
    
    races = []
    
    # Split text by known race names?
    # Or detects "Habilidades de Raça" and looks back?
    
    # Let's try splitting by the typical header layout.
    # The name usually appears huge at the top of the page.
    
    # Iterating pages might be safer.
    # Page 22-23: Humano?
    # Page 24-25: Anão?
    
    # Let's do a sliding window or regex state machine.
    
    # regex for attributes: "recebem (.*?)(?=\.)" or similar.
    
    lines = text.split('\n')
    races_dict = {}
    current_race_id = None
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Check if line is a known race name
        is_race_header = False
        if line in known_races:
             # Basic heuristic: Title usually has no other text on line, or very little.
             is_race_header = True
        
        if is_race_header:
            race_id = line.lower()
            current_race_id = race_id
            
            if race_id not in races_dict:
                races_dict[race_id] = {
                    "id": race_id,
                    "name": line,
                    "attributes": [],
                    "abilities": [],
                    "description": "" 
                }
            continue
            
        if current_race_id:
            races_dict[current_race_id]["description"] += line + "\n"
    
    processed = []
    for race_id, r in races_dict.items():
        # Clean description
        full_text = r["description"]
        
        # If duplicated, we might have a summary block and a full block concatenated.
        # But since we append, we have it all. We just need to parse 'Habilidades de Raça'.
        
        abilities = []
        if "Habilidades de Raça" in full_text:
            # Take the LAST occurrence of "Habilidades de Raça" if multiple (due to concatenation)
            # Actually, split by it and take the last part usually works if the full text comes last.
            parts = full_text.split("Habilidades de Raça")
            hab_text = parts[-1]
            
            hab_matches = re.finditer(r"(?P<name>[A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+)*)\.\s+(?P<desc>.*)", hab_text)
            
            for m in hab_matches:
               # Avoid very short matches that are false positives
               if len(m.group("desc")) < 5: continue
               abilities.append({
                   "name": m.group("name"),
                   "description": m.group("desc")
               })
        
        r["abilities"] = abilities
        # Limit description size but keep relevant parts
        r["description"] = full_text[:1000] 
        processed.append(r)

    return processed

if __name__ == "__main__":
    races = extract_races(r"C:\PROJETOS\tormenta20APP\Livros\T20 - Livro Básico.pdf", 20, 55)
    
    output_path = r"C:\PROJETOS\tormenta20APP\grimorio\data\races.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(races, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(races)} races.")
