# TOWER System Architecture (000116)

## 1. Architectural Philosophy: The "Lean & Agentic" Standard
Derived directly from the TOWER Comprehensive Business Plan ([000114](../business/comprehensive_business_plan_000114.md)), this system architecture embodies the principle of scaling horizontally via AI agents rather than vertically via headcount. The system is designed to support a core Headquarter (HQ) team of <5 people while managing thousands of enterprise and long-tail utility compliance reports.

To support the bifurcated Go-To-Market strategy (Enterprise Asset-Heavy vs. Transactional Long-Tail), the codebase is rigorously modular, strictly isolating regulatory definition, computational heavy-lifting, and agent intelligence into discrete libraries.

---

## 2. Global Ecosystem Layout: `TOWER_WORKSPACE`

To enforce a strict zero-contamination boundary between commercial development and other experimental or operational software, the entire TOWER product suite and lifecycle management resides in the isolated `TOWER_WORKSPACE/` directory.

### Directory Topology
```text
TOWER_WORKSPACE/
│
├── TOWER_SDLC_POLICY.md        # The unified ruleset for project governance
│
├── tower.core/                 # The Application Layer (Front-End & API)
│   ├── asdlc/                  # Unified Business & Architecture Documentation
│   ├── src/                    # Orhcestration frameworks, UI logic, API routes
│
├── xbrl.libs/                  # The Core Processing Layer (Mechanical Gen 1/2)
│   ├── lib_xbrl_parser/        # High-speed iXBRL ingestion engine
│   ├── lib_xbrl_topomap/       # Structural fingerprinting and graph identity
│
├── ferc.libs/                  # Regulatory Strategy Layer (Domain Logic)
│   ├── ferc_eqr_mapper/        # Auto-maps disjointed trade logs to standardized schemas
│   ├── ferc_form_templates/    # Strict intersection logic for Forms 1, 2, 6, 60, 714
│
└── agent.libs/                 # The Agentic Workforce Layer (Gen 3)
    ├── tower-s_forensics/      # Specialized ROE, tax, and limit checkers
    └── tower-s_support/        # Autonomous mapping/support pipelines
```

---

## 3. Logical Application Tiers

### 3.1 The Client/Orchestration Tier (`tower.core`)
This acts as the command center for user interaction and API provisioning. It is logically split to serve our target market segments:
*   **TOWER-E Execution (Enterprise Context)**: Serves the web-based glossy UI tailored for Major infrastructure filers handling dense Form 1/2 accounting data. Relying on standard web stack technologies (Next.js / Vite).
*   **TOWER-V Execution (Volume Context)**: Exposes a headless, API-first surface utilizing the underlying libraries purely for transactional heavy-lifting (millions of rows of EQR data). There is no UI overhead here.

### 3.2 The Mechanical Library Tier (`xbrl.libs` & `ferc.libs`)
This is the deterministic, ground-truth engine providing raw capabilities.
*   **XBRL Processing**: Engineered for unyielding speed and absolute memory efficiency. It translates raw unstructured filings or structured taxonomies into graph-native footprints for the higher tiers.
*   **FERC Intelligence**: A hardcoded domain mapping layer containing every single rule and schema constraint mandated by the Federal Energy Regulatory Commission. 

### 3.3 The Agentic Expert Tier (`agent.libs`)
Houses the proprietary IP—**TOWER-S**. These deterministic "agent" modules execute tasks that traditionally required a Senior Associate or Compliance Officer.
*   Operates in a "sandbox execution environment" to guarantee data fidelity.
*   Outputs deterministic "Proofs of Work" that human authorities can manually review (via the HITL protocol) before submission.

---

## 4. Systems Integration Workflow
The operational data pipeline through the architecture:

1. **Ingestion**: Raw client ledgers or disparate CSV trade logs enter through `tower.core` APIs.
2. **Schema Translation**: `ferc.libs` (via Schema Auto-Mapper) harmonizes the arbitrary formats into the strictly expected FERC taxonomy.
3. **Structural Validation**: `xbrl.libs` (TopoMap module) runs a continuous topological validation step to alert the system of any structural drift within the filing taxonomy.
4. **Agentic Verification**: Before output, the payload passes through `agent.libs` where specific forensic validators (e.g., Grid-Congestion Cross-validator) audit the compliance lines.
5. **Human Authorization**: The processed artifact is presented to the client via `tower.core` for final "Human-in-the-Loop" approval.

---

## 5. Development Infrastructure
All source repositories managed within `TOWER_WORKSPACE` are bound by the **`TOWER_SDLC_POLICY.md`**.
*   **Centralized Docs**: The business models (0001XX) in `tower.core/asdlc/` are the definitive source of truth. No library repository may contradict these objectives.
*   **CI/CD Paradigm**: Automated unit-testing governs `*.libs` pushes. Major merges into feature integration branches require human authorization.

*Created: 2026-04-14 | Author: Antigravity Code Assistant*
