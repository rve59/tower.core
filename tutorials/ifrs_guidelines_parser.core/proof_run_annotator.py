import os
import sys
from pdf2image import convert_from_path
from PIL import Image

# Ensure the project src is in the path for this demonstration script
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from ifrs_guidelines_parser.core.ocr_engine import annotate_text_area

def main():
    print("--- IFRS GUIDELINE PARSER: TEXT-AREA ANNOTATOR PROOF-RUN ---")
    
    # 1. Define paths
    pdf_path = "sources/ifrs-16-leases.pdf"
    output_path = "debug_page_9_annotated.png"
    
    if not os.path.exists(pdf_path):
        print(f"ERROR: Source PDF not found at {pdf_path}")
        return

    # 2. Convert Page 9 to Image (Physical Identification)
    print(f"STEP 1: Converting Page 9 of {pdf_path} to image...")
    pages = convert_from_path(pdf_path, first_page=9, last_page=9)
    
    if not pages:
        print("ERROR: Failed to convert PDF page.")
        return
    
    page_img = pages[0]
    
    # 3. Root the parsing logic (Identify & Annotate)
    print("STEP 2: Identifying core text area and overlaying RED outline on Page 9...")
    dimensions = annotate_text_area(page_img, output_path)
    
    # 4. Report results (Visual Audit)
    print(f"STEP 3: Annotation Complete!")
    print(f"  Detected Text Area (Page 9): (x0={dimensions['x0']}, y0={dimensions['y0']}, "
          f"x1={dimensions['x1']}, y1={dimensions['y1']})")
    print(f"  Visual Audit Saved to: {output_path}")

if __name__ == "__main__":
    main()
