## Issue
- MDX parse error at mindmap_data block: frontmatter-like key is placed inside body; also missing closing braces/indent.

## Plan
- Move mindmap_data into frontmatter YAML under key `mindmap_data` using valid JSON (quoted keys) or YAML object.
- Ensure the block is inside frontmatter (between --- ... ---) and not in markdown body.
- Keep markdown body only for summary/content.
