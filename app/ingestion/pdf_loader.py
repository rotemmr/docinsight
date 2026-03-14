import fitz

def load_pdf(file_path:str) -> str:
    """
    Opens a PDF and extracts all text from every page.
    Returns one big string with all the content.
    """

    doc = fitz.open(file_path)
    all_text = ""

    for page in doc:
        all_text += page.get_text()

    return all_text