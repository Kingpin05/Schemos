"""
Crawler for official government portals.
Fetches page/document listings and hands off raw content
to html_extractor / pdf_extractor.
"""


def crawl_source(url: str):
    """Fetch and return raw HTML/links from a government source URL."""
    raise NotImplementedError
