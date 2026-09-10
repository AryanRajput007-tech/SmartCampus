import re
from typing import List, Set

def normalize_text(text: str) -> str:
    """Lowercase and clean text for NLP vectorization."""
    if not text:
        return ""
    # Lowercase and replace non-alphanumeric (keeping common tech chars like +, #, .)
    cleaned = text.lower()
    cleaned = re.sub(r'[^a-z0-9+#.\s]', ' ', cleaned)
    return re.sub(r'\s+', ' ', cleaned).strip()

def extract_skill_set(skills: List[str]) -> Set[str]:
    """Convert skills to a normalized lowercased set."""
    return {s.strip().lower() for s in skills if s and s.strip()}
