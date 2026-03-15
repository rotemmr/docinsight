import pandas as pd

def load_excel(file_path: str) -> str:
    """
    Opens an Excel file and converts all rows to plain text.
    Each row becomes one line, columns separated by spaces.
    Returns one big string with all the content.
    """

    df = pd.read_excel(file_path)
    lines = []

    for _, row in df.iterrows():
        line = " ".join(str(cell) for cell in row if pd.notna(cell))
        lines.append(line)

    return "\n".join(lines)
