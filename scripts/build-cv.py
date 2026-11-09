"""Regenerate the checked-in CV PDF from the website's CV data."""

import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape, quoteattr

import reportlab
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads(
    subprocess.check_output(
        [
            "node",
            "--input-type=module",
            "-e",
            "import { CV, cvPdf } from './scripts/cv-data.mjs'; console.log(JSON.stringify({ CV, cvPdf }));",
        ],
        cwd=ROOT,
        text=True,
    )
)
CV = DATA["CV"]

NAVY = colors.HexColor("#172333")
MUTED = colors.HexColor("#4d545e")
BRONZE = colors.HexColor("#8b442c")
RULE = colors.HexColor("#d2c3b5")
CREAM = colors.HexColor("#fff6e8")
GOLD = colors.HexColor("#f5c596")
MARGIN = 45

fonts = Path(reportlab.__file__).resolve().parent / "fonts"
pdfmetrics.registerFont(TTFont("Vera", fonts / "Vera.ttf"))
pdfmetrics.registerFont(TTFont("VeraBold", fonts / "VeraBd.ttf"))
pdfmetrics.registerFontFamily("Vera", normal="Vera", bold="VeraBold")


def style(name, font, size, leading, **options):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=options.pop("textColor", NAVY),
        **options,
    )


KICKER = style("Kicker", "VeraBold", 8.6, 12, textColor=GOLD, spaceAfter=4)
NAME = style("Name", "Times-Bold", 43, 47, textColor=CREAM, spaceAfter=3)
TITLE = style("Title", "VeraBold", 11.1, 16, textColor=CREAM)
CONTACT = style("Contact", "Vera", 8.6, 13, textColor=CREAM)
BODY = style("Body", "Vera", 10.1, 14, spaceAfter=5)
SECTION = style("Section", "Times-Bold", 19, 22, spaceBefore=7, spaceAfter=5)
ORG = style("Organization", "VeraBold", 10.6, 14)
ROLE = style("Role", "Vera", 9.5, 13.3, textColor=BRONZE, spaceAfter=2)
ITEM = style("Item", "Vera", 9.4, 13.2, spaceBefore=3)
BULLET = style("Bullet", "Vera", 9.4, 12.7, spaceBefore=2, leftIndent=11, bulletIndent=1, bulletFontName="Vera")
PROJECT_NAME = style("Project name", "Times-Bold", 17, 20, spaceAfter=3)
PROJECT_PROOF = style("Project proof", "Vera", 9.4, 13.2, textColor=MUTED, spaceBefore=3)
PROJECT_LINK = style("Project link", "VeraBold", 8.4, 12, spaceBefore=4)


def link(label, url, color=BRONZE):
    return f'<link href={quoteattr(url)} color="{color.hexval()}">{escape(label)}</link>'


def section(title):
    return Paragraph(escape(title), SECTION)


def page_chrome(canvas, document):
    if document.page > 2:
        raise ValueError("The downloadable CV must fit on two pages")
    width, height = A4
    band_height = 151 if document.page == 1 else 46
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - band_height, width, band_height, stroke=0, fill=1)
    canvas.setStrokeColor(BRONZE)
    canvas.setLineWidth(1.8)
    canvas.line(MARGIN, height - band_height, width - MARGIN, height - band_height)
    if document.page == 2:
        canvas.setFillColor(CREAM)
        canvas.setFont("VeraBold", 9)
        canvas.drawString(MARGIN + 6, height - 28, CV["name"])
        canvas.setFillColor(GOLD)
        canvas.setFont("Vera", 8)
        canvas.drawRightString(width - MARGIN - 6, height - 28, "CURRICULUM VITAE")


def page_footer(canvas, document):
    width, _ = A4
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(.55)
    canvas.line(MARGIN + 6, 37, width - MARGIN - 6, 37)
    canvas.setFillColor(MUTED)
    canvas.setFont("Vera", 8)
    canvas.drawString(MARGIN + 6, 22, CV["name"])
    canvas.drawRightString(width - MARGIN - 6, 22, f"0{document.page} / 02")


def experience_blocks():
    blocks = []
    for item in CV["experience"]:
        organization = escape(item["organization"])
        public_links = [source for source in item.get("links", []) if source["url"].startswith("https://")]
        if public_links:
            organization = link(item["organization"], public_links[0]["url"])
        title = escape(item["title"])
        period = escape(item["period"])
        blocks.append(KeepTogether([
            Paragraph(organization, ORG),
            Paragraph(f"<b>{title}</b> &nbsp;|&nbsp; {period}", ROLE),
            *(Paragraph(escape(highlight), BULLET, bulletText="•") for highlight in item["highlights"]),
            Spacer(1, 3),
        ]))
    return blocks


def project_blocks():
    blocks = []
    for index, item in enumerate(CV["projects"], 1):
        label = f"0{index} / {item['area'].upper()}"
        name = escape(item["name"])
        source = item["repo"].removeprefix("https://")
        blocks.append(KeepTogether([
            HRFlowable(width="100%", thickness=.5, color=RULE, spaceBefore=9, spaceAfter=8),
            Paragraph(
                f'{name} &nbsp; <font name="VeraBold" size="8" color="{BRONZE.hexval()}">{escape(label)}</font>',
                PROJECT_NAME,
            ),
            Paragraph(escape(item["detail"]), ITEM),
            Paragraph(escape(item["evidence"]), PROJECT_PROOF),
            Paragraph(link(source, item["repo"]), PROJECT_LINK),
        ]))
    return blocks


def build():
    document = SimpleDocTemplate(
        str(ROOT / DATA["cvPdf"]),
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=28,
        bottomMargin=46,
        title=f"{CV['name']} | Curriculum Vitae",
        author=CV["name"],
        subject="Software engineering, technical leadership, and selected open-source work",
        invariant=1,
    )
    contacts = [link(item["display"], item["url"], CREAM) for item in CV["links"]]
    education = CV["education"]
    story = [
        Paragraph(f"CURRICULUM VITAE &nbsp; / &nbsp; {escape(CV['location'].upper())}", KICKER),
        Paragraph(escape(CV["name"]), NAME),
        Paragraph(escape(CV["title"]), TITLE),
        Paragraph(" &nbsp;|&nbsp; ".join(contacts), CONTACT),
        Spacer(1, 34),
        Paragraph(escape(CV["summary"]), BODY),
        section("Experience"),
        *experience_blocks(),
        section("Technical skills"),
        *(Paragraph(f"<b>{escape(item['label'])}</b> &nbsp; {escape(item['detail'])}", ITEM) for item in CV["skills"]),
        section("Education"),
        Paragraph(f"<b>{escape(education['institution'])}</b> &nbsp;|&nbsp; {escape(education['location'])}", ITEM),
        Paragraph(escape(education["detail"]), ITEM),
        PageBreak(),
        Spacer(1, 27),
        section("Selected engineering"),
        *project_blocks(),
    ]
    document.afterPage = lambda: page_footer(document.canv, document)
    document.build(story, onFirstPage=page_chrome, onLaterPages=page_chrome)


if __name__ == "__main__":
    build()
