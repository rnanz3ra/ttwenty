import fitz
import json
import re

def extract_classes(pdf_path, start_page, end_page):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return []

    text = ""
    for i in range(start_page, end_page):
        try:
            page = doc.load_page(i)
            text += page.get_text() + "\n<PAGE_BREAK>\n"
        except:
            pass

    known_classes = [
        "Arcanista", "Bárbaro", "Bardo", "Bucaneiro", "Caçador", 
        "Cavaleiro", "Clérigo", "Druida", "Guerreiro", "Inventor", 
        "Ladino", "Lutador", "Nobre", "Paladino"
    ]
    
    classes_dict = {}
    current_class_id = None
    
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        is_class_header = False
        if line in known_classes:
            is_class_header = True
            
        if is_class_header:
            class_id = line.lower().replace("ç", "c").replace("ã", "a")
            current_class_id = class_id
            
            if class_id not in classes_dict:
                classes_dict[class_id] = {
                    "id": class_id,
                    "name": line,
                    "pv": "",
                    "pm": "",
                    "pericias": "",
                    "proficiencias": "",
                    "abilities": [],
                    "description": ""
                }
            continue
            
        if current_class_id:
            classes_dict[current_class_id]["description"] += line + "\n"

    processed = []
    for cid, c in classes_dict.items():
        desc = c["description"]
        
        # Extract Characteristics
        # Pontos de Vida. ...
        # Pontos de Mana. ...
        # Perícias. ...
        # Proficiências. ...
        
        pv_match = re.search(r"Pontos de Vida\.\s*(.*?)(?=Pontos de Mana|Perícias|Proficiências|$)", desc, re.DOTALL)
        if pv_match: c["pv"] = pv_match.group(1).strip()
        
        pm_match = re.search(r"Pontos de Mana\.\s*(.*?)(?=Perícias|Proficiências|Habilidades|$)", desc, re.DOTALL)
        if pm_match: c["pm"] = pm_match.group(1).strip()
        
        per_match = re.search(r"Perícias\.\s*(.*?)(?=Proficiências|Habilidades|$)", desc, re.DOTALL)
        if per_match: c["pericias"] = per_match.group(1).strip()
        
        prof_match = re.search(r"Proficiências\.\s*(.*?)(?=Habilidades|$)", desc, re.DOTALL)
        if prof_match: c["proficiencias"] = prof_match.group(1).strip()
        
        # Extract Abilities
        # Look for "Habilidades de Classe"
        abilities = []
        if "Habilidades de Classe" in desc:
            hab_section = desc.split("Habilidades de Classe")[-1]
            
            # Regex for "Name. Description"
            # Bullet points often used: "• Name. Description"
            
            # Pattern 1: Bullet points
            # Pattern 2: Bold text (detected as Title Case lines followed by period)
            
            hab_matches = re.finditer(r"(?:•\s*)?(?P<name>[A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+)*)\.\s+(?P<desc>.*)", hab_section)
             
            for m in hab_matches:
                if len(m.group("desc")) < 5: continue
                # Filter out likely non-ability lines
                if "Capítulo" in m.group("name"): continue
                
                abilities.append({
                    "name": m.group("name"),
                    "description": m.group("desc")
                })
        
        c["abilities"] = abilities
        c["description"] = desc[:500] # Truncate root desc
        processed.append(c)

    return processed

if __name__ == "__main__":
    # Classes approx range 38 to 95
    classes = extract_classes(r"C:\PROJETOS\tormenta20APP\Livros\T20 - Livro Básico.pdf", 38, 95)
    
    output_path = r"C:\PROJETOS\tormenta20APP\grimorio\data\classes.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(classes, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(classes)} classes.")
