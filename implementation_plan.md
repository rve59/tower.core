# Implementation Plan: Google SDK Migration & Python Future-Proofing

The goal is to resolve two major warnings issued by Google's libraries during our SAP audits:
1. **SDK Deprecation**: `google.generativeai` is end-of-life; we must move to `google-genai`.
2. **Python Version EOL**: Python 3.10.12 is reaching end-of-support for Google's latest core libraries.

## User Review Required

> [!IMPORTANT]
> **SDK Installation**: I need to install the `google-genai` package. This is a new dependency.
> **Python Upgrade**: The Python 3.10 warning is a system/environment issue. I propose fixing the code to be compatible with both, but recommending a migration to a Python 3.11 virtual environment for production use.

## Proposed Changes

### [MODIFY] [providers.py](file:///home/raynier/Development/workspaces/fullstack/vibes/00_NEXUS/tools.core/libraries/lib_xbrl_auditor/providers.py)
- **Migrate Imports**: Switch from `import google.generativeai` to `from google import genai`.
- **Client Refactor**: Replace the global `genai.configure()` call with a class-level `genai.Client` instantiation.
- **Query Method Update**: Update the `query` method to use the new `client.models.generate_content` signature.

### [NEW] [requirements_update.txt](file:///home/raynier/Development/workspaces/fullstack/vibes/00_NEXUS/tools.core/requirements_update.txt)
- Create a temporary requirements file to ensure all required Google libraries are at the correct versions.

## Verification Plan

### Automated Tests
- Run `pip install google-genai`.
- Run the targeted showcase script `scratch/showcase_99941805.py` to verify that the audit still works perfectly with the new SDK.

### Manual Verification
- Confirm that the `FutureWarning` from `providers.py` has disappeared.
- Note the status of the Python 3.10 warning (which may persist until the environment itself is upgraded).
