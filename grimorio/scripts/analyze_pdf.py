import fitz  # PyMuPDF
import sys

def analyze_pdf_pages(file_path, start, end):
    try:
        doc = fitz.open(file_path)
        for i in range(start, end):
            page = doc.load_page(i)
            text = page.get_text("text")
            print(f"--- Page {i+1} ---")
            print(text[:1000]) # First 1000 chars
            print("-" * 20)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python analyze_pdf.py <path_to_pdf> <start_page> <end_page>")
    else:
        start_page = int(sys.argv[2])
        end_page = int(sys.argv[3])
        analyze_pdf_pages(sys.argv[1], start_page, end_page)
