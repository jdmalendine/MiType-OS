# Mi Type

Personal Mi Type assessment system + Tonal Flow Map (TFM) analysis tools.

## Prerequisites

You need **Python 3.9 or newer** installed.

**On macOS (recommended):**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python

# Verify
python3 --version
```

**Other platforms:**
- Download the official installer from https://www.python.org/downloads/
- Or use your system's package manager.

After installing Python, it's strongly recommended to use a virtual environment for this project.

## Installation (the package)

### From PyPI (once published)

```bash
pip install mi-type
```

With TFM extras (recommended for full functionality):

```bash
pip install "mi-type[tfm]"
```

### From source (development)

```bash
git clone https://github.com/jdmalendine/MiType-OS.git
cd MiType-OS
pip install -e ".[tfm]"
```

Core requirements for TFM features:
- vaderSentiment
- nltk (with VADER lexicon)
- numpy

The pure Mi Type assessment works with just the standard library.

## Usage

After installation you get two command-line tools:

```bash
# Main Mi Type Assessment (HBDI + MBTI style + rich profiles)
mitype

# Combined TFM + Mi Type system (v10.x)
mite
```

You can also run as a module:

```bash
python -m mi_type
```

From source tree (without installing):

```bash
python main.py
python mite.py
```

## What's included

- **Core library** (`import mi_type`)
  - `assessments` — Question banks (HBDI-style, MBTI-style)
  - `profiles` — 24+ detailed Mi Type profiles with strengths, egotends, change thresholds, and archetype mappings
  - `determine_mi_type()` — Scoring bridge that matches assessment results to the rich profiles

- Full interactive console applications with the above logic.

See the source `src/mi_type/` for the reusable components.

## Git practice notes

This repository is also used for learning clean git workflows (feature branches, logical commits, proper merges, packaging, etc.).

## Git practice notes

This repo is set up for learning good git workflows:
- Work on feature branches
- Small, logical commits
- Good messages
- Use of `git status`, `log`, `diff`, `switch`, `merge` / `rebase`, etc.

See the commit history for the import and subsequent changes.
