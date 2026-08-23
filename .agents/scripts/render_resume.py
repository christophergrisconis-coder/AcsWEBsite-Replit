import fitz
from pathlib import Path

source = Path("attached_assets/resume_MOST_RECENT_1787480735023.pdf")
output = Path(".agents/outputs/resume_render")
output.mkdir(parents=True, exist_ok=True)

document = fitz.open(source)
print(f"pages={document.page_count}")
print(f"metadata={document.metadata}")

for index, page in enumerate(document):
    image_path = output / f"page-{index + 1}.png"
    pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    pixmap.save(image_path)
    print(f"rendered={image_path} size={page.rect.width}x{page.rect.height}")
    print(page.get_text("text")[:12000])