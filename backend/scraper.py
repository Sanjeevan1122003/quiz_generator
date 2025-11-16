import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

HEADERS = {
    "User-Agent": "QuizGenerator-Scraper/1.0"
}

def is_wikipedia_url(url: str) -> bool:
    try:
        p = urlparse(url)
        return "wikipedia.org" in p.netloc.lower()
    except:
        return False


def clean_whitespace(text: str) -> str:
    text = re.sub(r'\s+\n', '\n', text)
    text = re.sub(r'\n{2,}', '\n\n', text)
    return text.strip()


def scrape_wikipedia(url: str):
    if not is_wikipedia_url(url):
        raise ValueError("Not a valid Wikipedia URL")

    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")

    # Title
    title_tag = soup.find("h1", id="firstHeading")
    title = title_tag.get_text(strip=True) if title_tag else "Untitled"

    # Article Content
    content = soup.select_one("#mw-content-text")
    if content is None:
        raise ValueError("Wikipedia page content not found")


    # Remove unnecessary elements
    for selector in ["table", "style", "script", ".toc", ".reference", "sup"]:
        for el in content.select(selector):
            el.decompose()

    # Extract sections and paragraphs
    sections = []
    text_blocks = []

    for el in content.find_all(["h2", "h3", "p"]):
        if el.name in ["h2", "h3"]:
            sec = re.sub(r"\[.*?\]$", "", el.get_text(" ", strip=True))
            sections.append(sec)
        elif el.name == "p":
            txt = el.get_text(" ", strip=True)
            if txt:
                text_blocks.append(txt)

    cleaned_text = clean_whitespace("\n\n".join(text_blocks))

    # Naive entity extraction
    entities = {
        "people": [],
        "organizations": [],
        "locations": []
    }

    for word in cleaned_text.split():
        if word.istitle() and len(word) > 3:
            entities["people"].append(word)

    return title, cleaned_text, sections, entities
