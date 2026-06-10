#!/usr/bin/env python3
"""
Thin launcher for development / direct execution from source.
After `pip install -e .` you can also just run `mitype`.
"""
import sys
from pathlib import Path

# Allow running without installation
sys.path.insert(0, str(Path(__file__).parent / "src"))

from mi_type.main import main_app

if __name__ == "__main__":
    main_app()
