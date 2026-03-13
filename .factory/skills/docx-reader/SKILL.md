---
name: docx-reader
description: "Read, extract, and analyze .docx (Word) files. Extract text, tables, images, headers, footers, metadata from .docx documents. Use when: (1) User asks to read/open/parse a .docx file, (2) Extract text content from Word documents, (3) Convert .docx to markdown/text/HTML, (4) Analyze document structure, tables, or metadata, (5) User mentions .docx, Word document, or OOXML"
---

# DOCX Reader

Read and extract content from `.docx` files using the best tool for each situation.

## Decision Flow

```
User provides .docx file
├─ Quick text extraction? → Method 1: Pandoc (fastest)
├─ Structured extraction (tables, headers, images)? → Method 2: Python
├─ HTML/semantic conversion? → Method 3: mammoth
└─ No tools installed? → Method 4: Manual ZIP + XML
```

## Step 1: Check available tools

Run this first to determine which method to use:

```bash
command -v pandoc && echo "PANDOC: available" || echo "PANDOC: not found"
python3 -c "import docx; print('PYTHON-DOCX: available')" 2>/dev/null || python -c "import docx; print('PYTHON-DOCX: available')" 2>/dev/null || echo "PYTHON-DOCX: not found"
node -e "require('mammoth')" 2>/dev/null && echo "MAMMOTH: available" || echo "MAMMOTH: not found"
```

If nothing is available, offer to install or use Method 4 (manual ZIP).

---

## Method 1: Pandoc (Recommended - Fastest)

Best for: quick text/markdown extraction, preserving structure.

### Basic extraction

```bash
# To Markdown (best for reading/analysis)
pandoc "input.docx" -f docx -t gfm -o output.md

# To plain text
pandoc "input.docx" -f docx -t plain -o output.txt

# With media extraction (images saved to ./media/)
pandoc "input.docx" -f docx -t gfm --extract-media=./media -o output.md

# To stdout (for piping/reading directly)
pandoc "input.docx" -f docx -t gfm
```

### Advanced options

```bash
# Preserve custom styles as div/span attributes
pandoc "input.docx" -f docx+styles -t gfm -o output.md

# Handle track changes (accept/reject/all)
pandoc "input.docx" -f docx --track-changes=accept -t gfm -o output.md

# Wrap long lines (default: 72 chars, use 'none' for no wrap)
pandoc "input.docx" -f docx -t gfm --wrap=none -o output.md

# Batch convert all .docx in directory
for f in *.docx; do pandoc "$f" -f docx -t gfm -o "${f%.docx}.md"; done
```

### After extraction

Use the Read tool to read the output file, then delete the temporary file.

---

## Method 2: Python (Structured Extraction)

Best for: tables, metadata, headers/footers, programmatic access.

### Option A: python-docx (most popular)

```bash
pip install python-docx
```

```python
from docx import Document

doc = Document("input.docx")

# --- Text extraction (document order) ---
for item in doc.iter_inner_content():
    if hasattr(item, 'text'):  # Paragraph
        print(item.text)
    elif hasattr(item, 'rows'):  # Table
        for row in item.rows:
            print([cell.text for cell in row.cells])

# --- Metadata ---
props = doc.core_properties
print(f"Title: {props.title}")
print(f"Author: {props.author}")
print(f"Created: {props.created}")
print(f"Modified: {props.modified}")
print(f"Words: {props.revision}")

# --- Headers & Footers ---
for section in doc.sections:
    header = section.header
    if header and header.paragraphs:
        print("Header:", " ".join(p.text for p in header.paragraphs))
    footer = section.footer
    if footer and footer.paragraphs:
        print("Footer:", " ".join(p.text for p in footer.paragraphs))

# --- Tables as markdown ---
for table in doc.tables:
    headers = [cell.text for cell in table.rows[0].cells]
    print("| " + " | ".join(headers) + " |")
    print("| " + " | ".join(["---"] * len(headers)) + " |")
    for row in table.rows[1:]:
        print("| " + " | ".join(cell.text for cell in row.cells) + " |")
```

### Option B: docx2python (extraction-optimized)

Better than python-docx when you need: footnotes, endnotes, comments, images, nested structure.

```bash
pip install docx2python
```

```python
from docx2python import docx2python

# Full extraction
result = docx2python("input.docx")

# Access structured content
print(result.text)           # All text as string
print(result.properties)     # Document metadata
print(result.images)         # Dict of {filename: bytes}
print(result.header)         # Headers (nested list)
print(result.footer)         # Footers (nested list)
print(result.footnotes)      # Footnotes (nested list)
print(result.endnotes)       # Endnotes (nested list)
print(result.body)           # Body content (nested list)

# Save images
result = docx2python("input.docx", image_folder="./images")

# With HTML formatting preserved
result = docx2python("input.docx", html=True)
```

### Option C: unstructured (AI/RAG pipelines)

Best for: feeding into LLMs, chunking, element-level classification.

```bash
pip install "unstructured[docx]"
```

```python
from unstructured.partition.docx import partition_docx

elements = partition_docx("input.docx")

for el in elements:
    print(f"[{el.category}] {el.text}")
    # Categories: Title, NarrativeText, ListItem, Table, Header, Footer, etc.
```

---

## Method 3: mammoth.js (HTML/Semantic)

Best for: converting to clean semantic HTML, web display.

```bash
npm install mammoth
```

### Node.js usage

```javascript
const mammoth = require("mammoth");
const fs = require("fs");

// To HTML
const result = await mammoth.convertToHtml({ path: "input.docx" });
console.log(result.value);    // HTML string
console.log(result.messages); // Warnings

// To plain text
const text = await mammoth.extractRawText({ path: "input.docx" });
console.log(text.value);

// From buffer
const buffer = fs.readFileSync("input.docx");
const result2 = await mammoth.convertToHtml({ buffer });

// Custom style mapping
const options = {
    styleMap: [
        "p[style-name='Section Title'] => h1:fresh",
        "p[style-name='Subsection Title'] => h2:fresh",
    ]
};
const styled = await mammoth.convertToHtml({ path: "input.docx" }, options);

// Custom image handling (save to files instead of base64)
const imageOptions = {
    convertImage: mammoth.images.imgElement(function(image) {
        return image.read("base64").then(function(imageBuffer) {
            const ext = image.contentType.split("/")[1];
            const filename = `image_${Date.now()}.${ext}`;
            // Save to disk or return URL
            return { src: `./images/${filename}` };
        });
    })
};
```

### CLI usage

```bash
# To HTML
npx mammoth input.docx output.html

# To plain text
npx mammoth input.docx --output-format=raw

# With style map
npx mammoth input.docx output.html --style-map=custom.map
```

---

## Method 4: Manual ZIP + XML (No Dependencies)

A `.docx` file IS a ZIP archive containing XML. This always works.

```bash
# List contents of the docx
unzip -l "input.docx"

# Extract the main document XML
unzip -p "input.docx" word/document.xml | head -200

# Extract and format XML for readability
unzip -p "input.docx" word/document.xml | python3 -c "
import sys, xml.dom.minidom
print(xml.dom.minidom.parseString(sys.stdin.read()).toprettyxml())
" | head -500

# Extract plain text (strip XML tags)
unzip -p "input.docx" word/document.xml | python3 -c "
import sys, re
xml_content = sys.stdin.read()
# Extract text between <w:t> tags
texts = re.findall(r'<w:t[^>]*>([^<]+)</w:t>', xml_content)
print('\n'.join(texts))
"

# Extract images
mkdir -p docx_media
unzip -j "input.docx" "word/media/*" -d docx_media/

# View document metadata
unzip -p "input.docx" docProps/core.xml
```

### DOCX internal structure

```
input.docx (ZIP)
├── [Content_Types].xml      # MIME types
├── _rels/.rels              # Package relationships
├── word/
│   ├── document.xml         # Main body content
│   ├── styles.xml           # Style definitions
│   ├── settings.xml         # Document settings
│   ├── fontTable.xml        # Font declarations
│   ├── numbering.xml        # List numbering
│   ├── header1.xml          # Headers
│   ├── footer1.xml          # Footers
│   ├── footnotes.xml        # Footnotes
│   ├── endnotes.xml         # Endnotes
│   ├── comments.xml         # Comments
│   ├── media/               # Embedded images
│   │   ├── image1.png
│   │   └── image2.jpg
│   └── _rels/
│       └── document.xml.rels  # Content relationships
└── docProps/
    ├── core.xml             # Title, author, dates
    └── app.xml              # App metadata, word count
```

---

## Security Best Practices

### CRITICAL: Always apply when processing untrusted .docx files

1. **Zip bomb protection**: Set decompression size limits
   ```python
   import zipfile
   MAX_SIZE = 100 * 1024 * 1024  # 100MB limit
   with zipfile.ZipFile("input.docx") as zf:
       total = sum(info.file_size for info in zf.infolist())
       if total > MAX_SIZE:
           raise ValueError(f"Decompressed size {total} exceeds limit")
   ```

2. **XXE prevention**: Disable external entity processing
   ```python
   from defusedxml import ElementTree  # Use defusedxml, not xml.etree
   ```

3. **Sanitize HTML output**: mammoth.js does NOT sanitize
   ```javascript
   // Always sanitize mammoth output before rendering
   const DOMPurify = require("dompurify");
   const clean = DOMPurify.sanitize(result.value);
   ```

4. **Validate file type**: Check magic bytes, not just extension
   ```python
   # DOCX files start with ZIP magic bytes: PK (50 4B)
   with open("input.docx", "rb") as f:
       if f.read(2) != b'PK':
           raise ValueError("Not a valid DOCX/ZIP file")
   ```

5. **Limit file count**: Prevent archive with excessive entries
6. **Sandbox processing**: Run in isolated environment for untrusted files
7. **Path traversal**: Check extracted paths don't escape target directory

---

## Quick Reference: Which method to use?

| Need | Best Method | Speed |
|------|-------------|-------|
| Read text quickly | Pandoc | Fastest |
| Convert to Markdown | Pandoc | Fastest |
| Extract tables | python-docx | Fast |
| Extract images | docx2python or ZIP | Fast |
| Headers/footers/notes | docx2python | Fast |
| Metadata (author, dates) | python-docx | Fast |
| Semantic HTML | mammoth.js | Fast |
| AI/LLM pipeline | unstructured | Medium |
| No dependencies | Manual ZIP + XML | Slow |
| Batch conversion | Pandoc | Fastest |

## Workflow

1. User provides a `.docx` file path
2. Check which tools are available (Step 1)
3. Choose the best method based on what user needs
4. Extract content and present it clearly
5. Clean up any temporary files created
6. If extraction fails, fall back to the next method

## Common pitfalls

- **python-docx `paragraphs`** skips content inside revision marks - use `iter_inner_content()` instead
- **python-docx `tables`** only returns top-level tables, not nested ones
- **mammoth.js** does NOT sanitize output - always sanitize before rendering HTML
- **mammoth.js Markdown** output is deprecated - use HTML + converter instead
- **Manual XML parsing** misses text in complex runs (`<w:r>` with mixed formatting)
- **Merged table cells** need special handling in python-docx (cells may appear duplicated)
- **Large .docx files** (50MB+) may cause memory issues - stream or chunk processing
