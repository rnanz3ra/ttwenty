import fitz
import json
import re

def extract_powers(pdf_path, start_page, end_page):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return []

    text = ""
    for i in range(start_page, end_page):
        try:
            page_text = doc.load_page(i).get_text()
            # Remove header/footer noise (Simple heuristic: remove very short lines at top/bottom)
            lines = page_text.split('\n')
            # Filter out likely page numbers or headers "Capítulo Dois"
            clean_lines = [l for l in lines if "Capítulo" not in l and not l.strip().isdigit()]
            text += "\n".join(clean_lines) + "\n"
        except:
            pass

    # Global State
    current_type = "Geral" # Default
    powers = []
    
    # Split text into lines for processing state machine
    lines = text.split('\n')
    
    current_power = None
    
    # Headers to look for
    headers = {
        "Poderes de Combate": "Combate",
        "Poderes de Destino": "Destino",
        "Poderes de Magia": "Magia",
        "Poderes Concedidos": "Concedido",
        "Poderes da Tormenta": "Tormenta"
    }

    # Regex to identify a Power Title
    # Heuristic: Short line (<= 4 words), Title Case, not ending in punctuation (unlikely)
    # Excludes common false positives like "Pré-requisito:"
    def is_title(line):
        line = line.strip()
        if not line: return False
        if len(line.split()) > 5: return False
        if line.endswith('.') or line.endswith(':'): return False
        if line.startswith("Pré-requisito"): return False
        if "CD" in line: return False # Skill usage lines like "Identificar (CD 15)"
        # Check for Title Case (mostly)
        if not line[0].isupper(): return False
        return True

    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Check for Section Headers
        is_header = False
        for h_text, h_type in headers.items():
            if h_text in line: # Loose match
                current_type = h_type
                is_header = True
                break
        if is_header: continue

        # Check for Power Title
        if is_title(line):
             # Save previous power
            if current_power:
                powers.append(current_power)
            
            current_power = {
                "id": line.lower().replace(" ", "-").replace("ç", "c").replace("ã", "a").replace("õ", "o").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u"),
                "name": line,
                "type": current_type,
                "description": "",
                "prerequisite": ""
            }
        else:
            # Append to current power description
            if current_power:
                # Check for Prerequisite
                if "Pré-requisito" in line or "Pré-requisitos" in line:
                    parts = line.split(":", 1)
                    if len(parts) > 1:
                        current_power["prerequisite"] = parts[1].strip()
                        # Also append to description? Usually yes for context
                        current_power["description"] += " " + line
                else:
                    current_power["description"] += " " + line

    # Add last power
    if current_power:
        powers.append(current_power)

    # Post-processing to clean up
    final_powers = []
    for p in powers:
        # Filter junk
        if len(p["description"]) < 10: continue 
        if "Tabela" in p["name"]: continue
        
        # Parse Deities for Concedidos
        # If type is Concedido, the first line of description is often the Deity list
        if p["type"] == "Concedido":
            # Heuristic: Deities are usually Capitalized names in the start of desc
            pass 

        p["description"] = p["description"].strip()
        final_powers.append(p)

    return final_powers

if __name__ == "__main__":
    powers = extract_powers(r"C:\PROJETOS\tormenta20APP\Livros\T20 - Livro Básico.pdf", 130, 145)
    
    # Save
    output_path = r"C:\PROJETOS\tormenta20APP\grimorio\data\powers.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(powers, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(powers)} powers.")
