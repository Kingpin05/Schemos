"""
Text normalization and deduplication.
"""


def clean_text(raw_text: str) -> str:
    """Normalize whitespace, strip boilerplate, fix encoding issues."""
    raise NotImplementedError


def deduplicate(chunks: list) -> list:
    """Remove near-duplicate chunks."""
    raise NotImplementedError
