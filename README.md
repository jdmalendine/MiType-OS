# Mi Type

Personal Mi Type assessment system + Tonal Flow Map (TFM) analysis tools.

## Installation

```bash
pip install -r requirements.txt
```

Core requirements (used by `mite.py` and TFM analysis):
- vaderSentiment (for VADER sentiment in TFM)
- nltk (for VADER lexicon)
- numpy (for sequence analysis in TFM)

The main Mi Type assessment (`main.py`) is mostly stdlib + local modules and will run without the above, but TFM features and `mite.py` need them.

`mite.py` includes a `check_dependencies()` helper that gives exact pip instructions and even attempts the NLTK data download.

## What's here

- **Modular core**
  - `mi_type_assessments.py` — Question banks (HBDI-style, MBTI-style, custom)
  - `mi_type_profiles.py` — Detailed Mi Type profiles (strengths, egotends, higher tends, change thresholds, archetype mappings)
  - `main.py` — Main console app using the modules
  - `mite.py` — Larger combined TFM + Mi Type script (v10.x)

- **Legacy / earlier versions**
  - `originals/Mityper.py` — The original standalone two-test interactive assessor you pointed at
  - `tfm/` — Earlier TFM (Tonal Flow Map) experiments

- **Other experiments**
  - `mitime.py`, `Newtype.py`, `assessment_console_app.py`, `ripple_animation.py`, `mainn.py`
  - `App/` — Possible web/server experiment

- **Data**
  - `saves/` — Example saved profiles/schedules
  - `JD.json`, `Profile Library.txt`

## Quick start (Python 3)

```bash
python main.py
# or
python mite.py
```

Some scripts require extra packages (vaderSentiment, nltk, numpy). The newer scripts (mite.py) will tell you exactly what to `pip install`.

## Git practice notes

This repo is set up for learning good git workflows:
- Work on feature branches
- Small, logical commits
- Good messages
- Use of `git status`, `log`, `diff`, `switch`, `merge` / `rebase`, etc.

See the commit history for the import and subsequent changes.
