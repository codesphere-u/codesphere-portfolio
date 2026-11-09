"""Regenerate the checked-in CV PDF from the website's CV data."""

import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape, quoteattr

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate

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

INK = colors.HexColor("#211d29")
MUTED = colors.HexColor("#4a444c")
ACCENT = colors.HexColor("#862f24")


def style(name, font, size, leading, **options):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=leading,
        alignment=TA_LEFT,
        textColor=options.pop("textColor", INK),
        **options,
    )


NAME = style("Name", "Times-Bold", 36, 39)
TITLE = style("Title", "Helvetica-Bold", 11.3, 15)
CONTACT = style("Contact", "Helvetica", 9.1, 12, textColor=MUTED, spaceAfter=11)
BODY = style("Body", "Helvetica", 10.5, 14.4)
SECTION = style("Section", "Helvetica-Bold", 11, 14, textColor=ACCENT, spaceBefore=15, spaceAfter=5)
ROLE = style("Role", "Helvetica-Bold", 10.6, 14.6, spaceBefore=6)
ITEM = style("Item", "Helvetica", 10.2, 13.8, spaceBefore=2)
BULLET = style("Bullet", "Helvetica", 10.2, 13.8, spaceBefore=2, leftIndent=12, bulletIndent=1)


def link(label, url):
    return f'<link href={quoteattr(url)} color="#862f24">{escape(label)}</link>'


def section(title):
    return Paragraph(escape(title), SECTION)


def page_rule(canvas, document):
    if document.page != 1:
        raise ValueError("The downloadable CV must fit on one page")
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1.6)
    width, height = A4
    canvas.line(document.leftMargin, height - 29, width - document.rightMargin, height - 29)


def build():
    document = SimpleDocTemplate(
        str(ROOT / DATA["cvPdf"]),
        pagesize=A4,
        leftMargin=44,
        rightMargin=44,
        topMargin=43,
        bottomMargin=37,
        title=f"{CV['name']} | Curriculum Vitae",
        author=CV["name"],
        subject="Software engineering, technical leadership, and selected open-source work",
        invariant=1,
    )
    contacts = [link(item["display"], item["url"]) for item in CV["links"]]
    story = [
        Paragraph(escape(CV["name"]), NAME),
        Paragraph(escape(CV["title"]), TITLE),
        Paragraph(" &nbsp;|&nbsp; ".join([escape(CV["location"]), *contacts]), CONTACT),
        Paragraph(escape(CV["summary"]), BODY),
        section("Experience"),
    ]
    for item in CV["experience"]:
        organization = escape(item["organization"])
        public_links = [source for source in item.get("links", []) if source["url"].startswith("https://")]
        if public_links:
            organization = link(item["organization"], public_links[0]["url"])
        heading = f"{escape(item['title'])} | {organization}"
        period = f' <font name="Helvetica" color="#4a444c">({escape(item["period"])})</font>'
        story.append(KeepTogether([
            Paragraph(heading + period, ROLE),
            *(Paragraph(escape(highlight), BULLET, bulletText="•") for highlight in item["highlights"]),
        ]))

    story.append(section("Selected engineering"))
    for item in CV["projects"]:
        story.append(Paragraph(
            f"<b>{link(item['name'], item['repo'])}</b> - {escape(item['detail'])}",
            ITEM,
        ))

    story.append(section("Technical skills"))
    for item in CV["skills"]:
        story.append(Paragraph(f"<b>{escape(item['label'])}:</b> {escape(item['detail'])}", ITEM))

    education = CV["education"]
    story.extend([
        section("Education"),
        Paragraph(f"<b>{escape(education['institution'])}</b> | {escape(education['location'])}", ITEM),
        Paragraph(escape(education["detail"]), ITEM),
    ])
    document.build(story, onFirstPage=page_rule, onLaterPages=page_rule)


if __name__ == "__main__":
    build()
