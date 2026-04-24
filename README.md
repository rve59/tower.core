# TOWER Core

This repository contains the core logic and utilities for the TOWER platform.

## Developer Guidelines

### 1. Script Execution
To ensure environment consistency and proper dependency management, **always** use `uv` to run scripts within this monorepo.

**Correct:**
```bash
uv run python path/to/script.py
```

**Incorrect:**
```bash
python path/to/script.py
```

### 2. Monorepo Structure
- `tower.core/`: Shared core logic and utilities.
- `tower_kernel/`: High-performance data engine and validation logic.
- `ferc.libs/`: Specialized libraries for FERC data processing.
