#!/usr/bin/env python3
"""
Thin launcher for the combined TFM + Mi Type app (development).
After install: use the `mite` command.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from mi_type.mite import main

if __name__ == "__main__":
    main()
