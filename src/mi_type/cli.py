"""Console entry points for the published mi-type package."""

import sys

def run_assessment():
    """Entry point for the main Mi Type assessment app (`mitype`)."""
    from .main import main_app
    try:
        main_app()
    except KeyboardInterrupt:
        print("\nExiting.")
        sys.exit(0)

def run_combined():
    """Entry point for the combined TFM + Mi Type app (`mite`)."""
    from .mite import main
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting.")
        sys.exit(0)
