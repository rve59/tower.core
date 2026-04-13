from PIL import Image, ImageDraw, ImageOps
from pdf2image import convert_from_path

def find_text_area(img: Image.Image) -> tuple:
    """
    Identifies the core text-area margins by finding the smallest non-white bounding box.
    Returns (left, top, right, bottom).
    """
    # Convert to grayscale then invert (text becomes white on black)
    gray = img.convert('L')
    inverted = ImageOps.invert(gray)
    
    # getbbox finds the first/last non-zero (non-black) pixels
    bbox = inverted.getbbox()
    return bbox if bbox else (0, 0, img.width, img.height)

def annotate_text_area(image: Image.Image, output_path: str = None) -> dict:
    """
    Physical Rooting: Overlays a RED rectangle on the text-area and saves for audit.
    """
    # Ensure drawing is on an RGB copy
    annotated_img = image.convert("RGB")
    left, top, right, bottom = find_text_area(annotated_img)
    
    # Overlay RED rectangle
    draw = ImageDraw.Draw(annotated_img)
    draw.rectangle([left, top, right, bottom], outline="red", width=8)
    
    if output_path:
        annotated_img.save(output_path)
    
    return {"x0": left, "y0": top, "x1": right, "y1": bottom}

def parse_image_blocks(page) -> list:
    """Placeholder for subsequent block-level recursive parsing."""
    # This will eventually call the specialized Section/Paragraph parsers.
    return []

def extract_hierarchical_text(pdf_path: str) -> dict:
    """Top-level orchestrator for full guideline extraction."""
    pages = convert_from_path(pdf_path)
    results = {"metadata": {"source": pdf_path, "total_pages": len(pages)}, "pages": []}
    
    for i, page in enumerate(pages):
        page_obj = {
            "page_number": i + 1,
            "text_area": find_text_area(page),
            "blocks": parse_image_blocks(page)
        }
        results["pages"].append(page_obj)
    return results
