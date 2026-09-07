"""
Splits cleaned documents into retrieval-sized chunks.
"""


def chunk_document(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split text into overlapping chunks suitable for embedding."""
    raise NotImplementedError
