"""Convert AGENTS-GUIDE.md to a styled HTML, then use Edge to print PDF."""
import markdown
import subprocess
import os
import time

md_file = os.path.join(os.path.dirname(__file__), 'AGENTS-GUIDE.md')
html_file = os.path.join(os.path.dirname(__file__), 'AGENTS-GUIDE.html')
pdf_file = os.path.join(os.path.dirname(__file__), 'Kagora-Guide.pdf')

with open(md_file, 'r', encoding='utf-8') as f:
    md_text = f.read()

html_body = markdown.markdown(md_text, extensions=['tables', 'fenced_code', 'codehilite'])

html = f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>Kagora 完整使用手冊</title>
<style>
  @page {{ margin: 20mm; }}
  body {{
    font-family: 'Microsoft JhengHei', 'Segoe UI', sans-serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #1a1a2e;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }}
  h1 {{
    color: #0f3460;
    border-bottom: 3px solid #0f3460;
    padding-bottom: 8px;
    font-size: 22pt;
  }}
  h2 {{
    color: #16213e;
    border-bottom: 1px solid #ccc;
    padding-bottom: 4px;
    margin-top: 28px;
    font-size: 15pt;
  }}
  h3 {{
    color: #1a1a2e;
    margin-top: 18px;
    font-size: 12pt;
  }}
  h4 {{
    color: #444;
    font-size: 11pt;
  }}
  code {{
    background: #f0f0f5;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Cascadia Mono', 'Consolas', monospace;
    font-size: 10pt;
  }}
  pre {{
    background: #1e1e2e;
    color: #cdd6f4;
    padding: 14px 18px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 9.5pt;
    line-height: 1.5;
  }}
  pre code {{
    background: none;
    padding: 0;
    color: inherit;
  }}
  table {{
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0;
    font-size: 10pt;
  }}
  th, td {{
    border: 1px solid #ccc;
    padding: 8px 12px;
    text-align: left;
  }}
  th {{
    background: #0f3460;
    color: white;
    font-weight: 600;
  }}
  tr:nth-child(even) {{
    background: #f8f8fc;
  }}
  blockquote {{
    border-left: 4px solid #0f3460;
    margin: 12px 0;
    padding: 8px 16px;
    background: #f0f4ff;
    color: #333;
  }}
  hr {{
    border: none;
    border-top: 1px solid #ddd;
    margin: 24px 0;
  }}
  strong {{
    color: #0f3460;
  }}
</style>
</head>
<body>
{html_body}
</body>
</html>
"""

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

# Use Edge to print PDF
edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
subprocess.run([
    edge,
    '--headless',
    '--disable-gpu',
    f'--print-to-pdf={pdf_file}',
    '--no-margins',
    html_file
], capture_output=True, timeout=30)

if os.path.exists(pdf_file):
    size = os.path.getsize(pdf_file)
    print(f"PDF generated: {pdf_file} ({size} bytes)")
else:
    print("PDF generation failed, HTML saved at:", html_file)
