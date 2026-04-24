# 000140: TOWER Unified Product Architecture (U/F/K)

**Status**: DRAFT
**Owner**: Raynier van Egmond / Engineering Dept
**Last Updated**: 2026-04-23

## 1. Executive Summary
This document defines the **TOWER-Unified** model for assembling diverse regulatory products from a single codebase. By separating the platform into a **Regulatory Kernel (K)**, a **Universal Layout (U)**, and a **Feature Library (F)**, we can assemble specialized products for Consultants (C), Managers (M), and Joint Agencies (J) via simple configuration blueprints.

## 2. The TOWER Domain Model

### 2.1 TOWER-K (The Kernel)
- **Role**: Shared compute power and regulatory "Source of Truth."
- **Scope**: FERC Rulebook, Data Infiltration (Polars/Parquet), and Cross-Table Integrity logic.
- **Independence**: Remains 100% UI-agnostic.

### 2.2 TOWER-F (The Features)
- **Role**: A library of reusable "Feature Components" (The Lego Bricks).
- **Examples**: 
    - `F_Linear_Nav` (Standard Sidebar)
    - `F_Fleet_Nav` (BPA-style Sidebar)
    - `F_Audit_Grid` (Standard Table)
    - `F_CrossEntity_Heatmap` (Manager Dashboard)
    - `F_Approval_Workflow` (JAA Review Tool)

### 2.3 TOWER-U (The Universal Layout)
- **Role**: The standardized UI framework (The Shell).
- **Functioning**: Defines "Slots" or "Regions" (Sidebar, Header, Main, Inspector). It has no content of its own; it only provides the frame.

---

## 3. Product Assembly: The Blueprint Model
Products are no longer "developed"—they are "assembled" using a **Product Blueprint** configuration.

### TOWER-C (Consultant - Class A)
- **Assembly**: 
    - Layout: TOWER-U
    - Parts: `F_Linear_Nav` + `F_SingleEntity_Dashboard`
- **Context**: Deep-dive into one utility filing.

### TOWER-M (Manager - Class B / BPA)
- **Assembly**: 
    - Layout: TOWER-U
    - Parts: `F_Fleet_Nav` + `F_Account_Switcher` + `F_Batch_Operator`
- **Context**: High-level management of 50+ independent entities.

### TOWER-J (Joint - Class C / JAA)
- **Assembly**: 
    - Layout: TOWER-U
    - Parts: `F_Collaborative_Nav` + `F_SharedAsset_Registry` + `F_Approval_Queue`
- **Context**: Federated reporting between an agency and its members.

---

## 4. Technical Implementation

### 4.1 The Blueprint Orchestrator
A bootstrap service reads the active `product.json` blueprint and dynamically imports the required TOWER-F components into the TOWER-U regions.

### 4.2 Build-Time Targeting
Using the "Multi-Target Build" strategy, the CI/CD pipeline uses the Blueprint to decide which TOWER-F components to include in the final artifact (e.g., `tower-m.exe` vs. `tower-c.js`).

---

## 5. Cloud & Deployment Strategy

### 5.1 Remote Compute Bridge
The TOWER-U layout communicates with the TOWER-K (Kernel) via a standardized interface.
- **Local Apps**: TOWER-M/C/J can run as local desktop apps (Electron).
- **Cloud Acceleration**: Heavy compute (1M+ record validation) is offloaded to the cloud-based TOWER-K engine.

### 5.2 Elastic Scaling
Cloud-based TOWER-K instances scale automatically using KEDA to handle quarterly FERC filing peaks.

---

## 6. Next Steps
1. **F-Library Inventory**: Catalog existing UI components and refactor them into the TOWER-F standard.
2. **U-Shell Prototype**: Develop the TOWER-U layout with defined region slots.
3. **Blueprint Engine**: Create the JSON orchestrator that assembles U + F at runtime.
