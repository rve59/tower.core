# Git Commit Manifest

## Summary
`feat(auditor): harden IFRS 20-F pipeline & migrate to google-genai SDK`

## Detailed Messages
- **XBRL Engine Hardening**:
  - Enhanced `IXBRLProcessor` and `InlineDocSet` for SEC-style filing structures (flat directories, dense namespaces).
  - Improved recursive ELR discovery and reconciliation role mapping for multi-billion discrepancies.
- **Semantic Audit Layer**:
  - Implemented `SemanticReconciliationSkill` with mandatory **Zero-Variance Proof Tables**.
  - Standardized auditing persona as "Senior Technical Technical Auditor" for IFRS/SEC reporting.
  - Refactored report generator to use **Ticker Symbol** prefixes (e.g., `SAP-2025FY-...`).
- **SDK & Provider Migration**:
  - Migrated reasoning layer from deprecated `google-generativeai` to modern **`google-genai`** 1.x SDK.
  - Implemented Client-based pattern in `GeminiProvider` for robust Vertex AI / Gemini API interaction.
  - Configured `gemini-3.1-pro-preview` as the default audit reasoning model.
- **Environment & Infrastructure**:
  - Resolved `pyOpenSSL` vs `cryptography` dependency conflicts blocking API calls.
  - Added `showcase` and `example` scripts to `scratch/` for end-to-end pipeline verification.
