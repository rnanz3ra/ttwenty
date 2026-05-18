import fitz
import json
import re
import sys

def extract_spells(pdf_path, start_page, end_page):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return []

    text = ""
    for i in range(start_page, end_page):
        try:
            text += doc.load_page(i).get_text()
        except Exception as e:
            print(f"Error reading page {i}: {e}")

    # Normalize text
    text = text.replace('\n', ' ')
    
    # Regex Pattern for T20 Spells
    # Captures: Name, Type (Arcana/Divina/Univ), Circle, School, Body
    pattern = r"([A-ZÀ-Ú][\w\s]+?)\s+(Arcana|Divina|Universal)\s+(\d+)\s+\((.*?)\)(.*?)(?=[A-ZÀ-Ú][\w\s]+?\s+(?:Arcana|Divina|Universal)\s+\d+|\Z)"
    
    matches = re.findall(pattern, text, re.DOTALL)
    
    spells = []
    for match in matches:
        name, school_type, circle, school, body = match
        
        # Parse fields from body
        exec_match = re.search(r"Execução:\s*(.*?)(?=\s*[A-Z][a-z]+:)", body)
        range_match = re.search(r"Alcance:\s*(.*?)(?=\s*[A-Z][a-z]+:)", body)
        dur_match = re.search(r"Duração:\s*(.*?)(?=\s*[A-Z][a-z]+:|\.|\n|$)", body)
        
        # Description is the rest of the body after the standard fields
        # This is a heuristic, mighty fail if fields are missing or ordered differently
        desc = body
        if dur_match:
            parts = body.split(dur_match.group(0))
            if len(parts) > 1:
                desc = parts[-1]
        elif range_match:
             parts = body.split(range_match.group(0))
             if len(parts) > 1:
                desc = parts[-1]

        # Clean up description
        desc = re.sub(r"^\s*[:;.]\s*", "", desc).strip()

        spells.append({
            "id": name.strip().lower().replace(" ", "-"),
            "name": name.strip(),
            "circle": int(circle),
            "type": school_type,
            "school": school.strip(),
            "execution": exec_match.group(1).strip() if exec_match else "Padrão",
            "range": range_match.group(1).strip() if range_match else "Curto",
            "duration": dur_match.group(1).strip() if dur_match else "Instantânea",
            "description": desc[:500] 
        })

    return spells

if __name__ == "__main__":
    # Full Spells Chapter Range
    # Note: Adjust as needed based on exact PDF version
    spells = extract_spells(r"C:\PROJETOS\tormenta20APP\Livros\T20 - Livro Básico.pdf", 180, 230)
    
    output_path = r"C:\PROJETOS\tormenta20APP\grimorio\data\spells.json"
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(spells, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully extracted {len(spells)} spells to {output_path}")
