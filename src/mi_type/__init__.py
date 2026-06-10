"""
Mi Type - Personal assessment system with Tonal Flow Map (TFM) tools.
"""

__version__ = "0.1.0"

from .profiles import (
    MI_TYPE_PROFILES,
    get_profile,
    list_all_profiles,
    determine_mi_type,
)
from .assessments import (
    ALL_QUESTIONS,
    HBDI_QUESTIONS,
    MBTI_QUESTIONS,
)

__all__ = [
    "__version__",
    "MI_TYPE_PROFILES",
    "get_profile",
    "list_all_profiles",
    "determine_mi_type",
    "ALL_QUESTIONS",
    "HBDI_QUESTIONS",
    "MBTI_QUESTIONS",
]
