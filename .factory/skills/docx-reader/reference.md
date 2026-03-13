# DOCX Reader - Advanced Reference

## DOCX Format Deep Dive (OOXML / ECMA-376)

A `.docx` file follows the **Office Open XML (OOXML)** standard (ECMA-376 / ISO/IEC 29500).
It is a ZIP package using **Open Packaging Conventions (OPC)**.

### Key XML namespaces

| Prefix | Namespace | Purpose |
|--------|-----------|---------|
| `w` | `http://schemas.openxmlformats.org/wordprocessingml/2006/main` | Main document |
| `r` | `http://schemas.openxmlformats.org/officeDocument/2006/relationships` | Relationships |
| `wp` | `http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing` | Drawing/images |
| `a` | `http://schemas.openxmlformats.org/drawingml/2006/main` | DrawingML |
| `dc` | `http://purl.org/dc/elements/1.1/` | Dublin Core metadata |
| `cp` | `http://schemas.openxmlformats.org/package/2006/metadata/core-properties` | Core properties |

### XML element hierarchy (word/document.xml)

```xml
<w:document>
  <w:body>
    <w:p>                    <!-- Paragraph -->
      <w:pPr>                <!-- Paragraph properties (style, alignment) -->
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>                  <!-- Run (text with formatting) -->
        <w:rPr>              <!-- Run properties (bold, italic, font) -->
          <w:b/>             <!-- Bold -->
        </w:rPr>
        <w:t>Hello World</w:t>  <!-- Actual text content -->
      </w:r>
    </w:p>
    <w:tbl>                  <!-- Table -->
      <w:tr>                 <!-- Table row -->
        <w:tc>               <!-- Table cell -->
          <w:p>...</w:p>     <!-- Cell contains paragraphs -->
        </w:tc>
      </w:tr>
    </w:tbl>
  </w:body>
</w:document>
```

---

## Complete Python Script: Full Extraction

```python
#!/usr/bin/env python3
"""Complete .docx extraction script with all content types."""

import sys
import zipfile
from pathlib import Path

def extract_with_python_docx(filepath):
    """Full extraction using python-docx."""
    from docx import Document

    doc = Document(filepath)
    output = []

    # Metadata
    props = doc.core_properties
    output.append("# Document Metadata")
    output.append(f"- **Title**: {props.title or 'N/A'}")
    output.append(f"- **Author**: {props.author or 'N/A'}")
    output.append(f"- **Created**: {props.created or 'N/A'}")
    output.append(f"- **Modified**: {props.modified or 'N/A'}")
    output.append(f"- **Last Modified By**: {props.last_modified_by or 'N/A'}")
    output.append(f"- **Category**: {props.category or 'N/A'}")
    output.append(f"- **Keywords**: {props.keywords or 'N/A'}")
    output.append("")

    # Headers & Footers
    for i, section in enumerate(doc.sections):
        header = section.header
        if header and not header.is_linked_to_previous:
            header_text = " ".join(p.text for p in header.paragraphs if p.text.strip())
            if header_text:
                output.append(f"> **Header (Section {i+1})**: {header_text}")
        footer = section.footer
        if footer and not footer.is_linked_to_previous:
            footer_text = " ".join(p.text for p in footer.paragraphs if p.text.strip())
            if footer_text:
                output.append(f"> **Footer (Section {i+1})**: {footer_text}")

    output.append("")
    output.append("# Document Content")
    output.append("")

    # Body content in document order
    for item in doc.iter_inner_content():
        if hasattr(item, 'text'):  # Paragraph
            style = item.style.name if item.style else ""
            text = item.text.strip()
            if not text:
                continue
            # Map Word styles to Markdown
            if "Heading 1" in style:
                output.append(f"## {text}")
            elif "Heading 2" in style:
                output.append(f"### {text}")
            elif "Heading 3" in style:
                output.append(f"#### {text}")
            elif "List" in style:
                output.append(f"- {text}")
            else:
                output.append(text)
            output.append("")

        elif hasattr(item, 'rows'):  # Table
            rows = item.rows
            if not rows:
                continue
            # Header row
            headers = [cell.text.strip().replace('\n', ' ') for cell in rows[0].cells]
            output.append("| " + " | ".join(headers) + " |")
            output.append("| " + " | ".join(["---"] * len(headers)) + " |")
            # Data rows
            for row in rows[1:]:
                cells = [cell.text.strip().replace('\n', ' ') for cell in row.cells]
                output.append("| " + " | ".join(cells) + " |")
            output.append("")

    return "\n".join(output)


def extract_with_docx2python(filepath, image_folder=None):
    """Full extraction using docx2python (includes footnotes, comments)."""
    from docx2python import docx2python

    kwargs = {}
    if image_folder:
        kwargs["image_folder"] = image_folder

    result = docx2python(filepath, **kwargs)

    output = []
    output.append("# Document Properties")
    for key, value in (result.properties or {}).items():
        output.append(f"- **{key}**: {value}")
    output.append("")

    output.append("# Content")
    output.append(result.text)

    if result.footnotes:
        output.append("\n# Footnotes")
        for note in result.footnotes:
            output.append(str(note))

    if result.endnotes:
        output.append("\n# Endnotes")
        for note in result.endnotes:
            output.append(str(note))

    if result.images:
        output.append(f"\n# Images ({len(result.images)} found)")
        for name in result.images:
            output.append(f"- {name}")

    return "\n".join(output)


def extract_images(filepath, output_dir):
    """Extract embedded images from .docx."""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    extracted = []
    with zipfile.ZipFile(filepath) as zf:
        for entry in zf.namelist():
            if entry.startswith("word/media/"):
                filename = Path(entry).name
                target = output_dir / filename
                with zf.open(entry) as src, open(target, "wb") as dst:
                    dst.write(src.read())
                extracted.append(str(target))

    return extracted


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <file.docx> [--images <dir>]")
        sys.exit(1)

    filepath = sys.argv[1]

    # Validate
    if not Path(filepath).exists():
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    with open(filepath, "rb") as f:
        if f.read(2) != b'PK':
            print("Error: Not a valid DOCX/ZIP file")
            sys.exit(1)

    # Try python-docx first, fall back to docx2python
    try:
        print(extract_with_python_docx(filepath))
    except ImportError:
        try:
            print(extract_with_docx2python(filepath))
        except ImportError:
            print("Error: Install python-docx or docx2python")
            print("  pip install python-docx")
            print("  pip install docx2python")
            sys.exit(1)
```

---

## Node.js: Complete mammoth.js Script

```javascript
#!/usr/bin/env node
/**
 * Complete .docx extraction with mammoth.js
 * Usage: node extract_docx.js input.docx [--format html|text|markdown]
 */

const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function extractDocx(filePath, format = "text") {
    const input = { path: filePath };

    switch (format) {
        case "html": {
            const result = await mammoth.convertToHtml(input, {
                // Custom style mapping for semantic HTML
                styleMap: [
                    "p[style-name='Title'] => h1:fresh",
                    "p[style-name='Subtitle'] => h2:fresh",
                    "p[style-name='Quote'] => blockquote:fresh",
                ],
                // Custom image handling - save to files
                convertImage: mammoth.images.imgElement(function(image) {
                    return image.read("base64").then(function(imageBuffer) {
                        const ext = image.contentType.split("/")[1] || "png";
                        const filename = `image_${Date.now()}.${ext}`;
                        const dir = path.join(path.dirname(filePath), "images");
                        fs.mkdirSync(dir, { recursive: true });
                        fs.writeFileSync(
                            path.join(dir, filename),
                            Buffer.from(imageBuffer, "base64")
                        );
                        return { src: `./images/${filename}` };
                    });
                })
            });

            if (result.messages.length > 0) {
                console.error("Warnings:", result.messages.map(m => m.message).join(", "));
            }
            return result.value;
        }

        case "text": {
            const result = await mammoth.extractRawText(input);
            return result.value;
        }

        default:
            throw new Error(`Unknown format: ${format}`);
    }
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Usage: node extract_docx.js <file.docx> [--format html|text]");
    process.exit(1);
}

const filePath = args[0];
const formatIdx = args.indexOf("--format");
const format = formatIdx >= 0 ? args[formatIdx + 1] : "text";

extractDocx(filePath, format)
    .then(content => console.log(content))
    .catch(err => { console.error("Error:", err.message); process.exit(1); });
```

---

## Pandoc Advanced Recipes

```bash
# Convert with full media extraction and no line wrapping
pandoc "input.docx" -f docx -t gfm \
  --wrap=none \
  --extract-media=./media \
  -o output.md

# Accept all track changes before converting
pandoc "input.docx" -f docx --track-changes=accept \
  -t gfm -o output.md

# Preserve custom Word styles as attributes
pandoc "input.docx" -f docx+styles -t gfm -o output.md

# Extract only text (no formatting)
pandoc "input.docx" -f docx -t plain --wrap=none

# To HTML with standalone template
pandoc "input.docx" -f docx -t html5 --standalone -o output.html

# Batch convert directory
find . -name "*.docx" -exec sh -c '
  pandoc "$1" -f docx -t gfm --wrap=none -o "${1%.docx}.md"
' _ {} \;

# Extract metadata as JSON
pandoc "input.docx" -f docx -t plain --template='$meta-json$'
```

---

## Comparison Matrix

| Feature | pandoc | python-docx | docx2python | mammoth.js | Manual ZIP |
|---------|--------|-------------|-------------|------------|------------|
| **Text** | Excellent | Good | Good | Good | Basic |
| **Tables** | Good | Good | Excellent | Good | Manual |
| **Images** | Extract | Limited | Extract | Convert | Extract |
| **Headers/Footers** | No | Yes | Yes | No | Manual |
| **Footnotes** | Yes | No | Yes | Yes | Manual |
| **Comments** | No | No | Yes | Yes | Manual |
| **Metadata** | Limited | Full | Full | No | Manual |
| **Styles** | Partial | Full | Partial | Map | Full |
| **Track Changes** | Yes | No | No | No | Manual |
| **Speed** | Fastest | Fast | Fast | Fast | Slow |
| **Dependencies** | Binary | Python | Python | Node.js | None |
| **Security** | Good | Good | Good | Needs sanitization | Manual |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `pandoc: command not found` | Install: `choco install pandoc` (Win), `brew install pandoc` (Mac), `apt install pandoc` (Linux) |
| `ModuleNotFoundError: No module named 'docx'` | `pip install python-docx` (note: package name is `python-docx`, import is `docx`) |
| `Cannot find module 'mammoth'` | `npm install mammoth` |
| File not a valid ZIP | Check file extension; may be `.doc` (old format, not `.docx`) |
| `.doc` file (not `.docx`) | Use LibreOffice: `libreoffice --headless --convert-to docx file.doc` |
| Garbled text | Check encoding; some old converters produce UTF-8 BOM issues |
| Missing images | Use `--extract-media` (pandoc) or extract from `word/media/` (ZIP) |
| Table cells duplicated | python-docx reports merged cells multiple times; deduplicate by checking cell identity |
| Large file (50MB+) | Stream processing or chunk; avoid loading entire file in memory |
| Password-protected | Remove protection first with `msoffcrypto-tool` (Python) |

---

## Sources

- [mammoth.js GitHub](https://github.com/mwilliamson/mammoth.js)
- [python-docx Documentation](https://python-docx.readthedocs.io/en/latest/)
- [docx2python GitHub](https://github.com/ShayHill/docx2python)
- [Pandoc User's Guide](https://pandoc.org/MANUAL.html)
- [ECMA-376 Office Open XML](https://ecma-international.org/publications-and-standards/standards/ecma-376/)
- [MS-DOCX Specification](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-docx/)
- [unstructured partition_docx](https://docs.unstructured.io/open-source/core-functionality/partitioning)
