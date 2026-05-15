# TOWER-SEM: Semantic Validation & Materiality Justification
**Document ID**: `tower_sem_materiality_000150.md`
**Author**: Antigravity
**Status**: Research / Draft
**Context**: LadyBUG Semantic Evaluation Engine

---

## 1. Executive Summary
This document formalizes the semantic evaluation of electric market data (FERC Order 917) using a graph-based approach. The **LadyBUG** database is designed to ingest EQR violations and perform "contextual reasoning" to justify non-refiling decisions. By representing transactions, contracts, and rules as nodes in a graph, we can evaluate aggregate impacts and entity relationships that are difficult to capture in a relational model.

---

## 2. LadyBUG Domain Model (Decomposed)
Instead of a "table-per-node" approach, LadyBUG unpacks EQR records into a rich domain model of the electric market. This allows for semantic normalization across different filers and source systems.

### 2.1 Domain Node Definitions
- **Entity**: `Seller`, `Purchaser`, `Broker`, `Agent`.
- **Physical**: `PointOfReceipt (POR)`, `PointOfDelivery (POD)`, `Hub`, `BalancingAuthority (BA)`.
- **Product**: `ProductType` (Energy, Capacity, Ancillary), `SpecificProduct` (Spinning Reserve, Firm PTP).
- **Commercial**: `Agreement` (Master), `ServiceContract`, `Transaction`.
- **Financial**: `RateSchedule`, `PricePoint`, `Index`.
- **Regulatory**: `Filing`, `Rule`, `Violation`, `Decision`.

### 2.2 Domain Relationship Definitions (The "Unpacked" Graph)
- `(Transaction)-[:TRADED_BY]->(Seller)`
- `(Transaction)-[:DELIVERED_TO]->(POD)`
- `(Transaction)-[:RECEIVED_FROM]->(POR)`
- `(Transaction)-[:CLASSIFIED_AS]->(ProductType)`
- `(Transaction)-[:PRICED_VIA]->(RateSchedule)`
- `(Agreement)-[:GOVERNS]->(Transaction)`
- `(Seller)-[:AFFILIATED_WITH]->(Company)`

---

## 3. Materiality Advantages of Domain Unpacking

Unpacking records into a domain model enables materiality tests that are impossible in a relational "flat" view:

### 3.1 Location-Based Materiality (Physical Flow)
- **Relevance**: Reporting errors at a specific "Point of Delivery" (POD) might be immaterial globally but **Critical** if that POD is a constrained transmission interface.
- **Past Occurrence Justification**: **Barclays (2012)** manipulation at Western Hubs (Mid-C, Palo Verde). FERC DAS prioritizes "Index Hubs" because they set prices for the entire region. Errors at these nodes are treated as attempts to distort the market index.
- **Cypher Query**:
```cypher
MATCH (pod:POD {name: 'CONSTRAINED_PATH_X'})<-[:DELIVERED_TO]-(tx:Transaction)-[v:VIOLATES]->(r:Rule)
RETURN pod.name, count(tx) as affected_volume, sum(v.delta_amount) as total_impact,
       "High sensitivity location (Constraint Zone)" as Justification
```

### 3.2 Product Homogenization (Semantic Normalization)
- **Relevance**: Different filers use different strings for the same product (e.g. "EN" vs "Energy"). Unpacking into a `ProductType` node allows for aggregate materiality analysis across all "Energy" trades regardless of naming discrepancies.
- **Past Occurrence Justification**: **Order 768** introduced strict product categorization to prevent filers from "hiding" uplift or ancillary payments under generic "Energy" labels. Systemic misclassification is a recurring audit finding that triggers multi-year refiling mandates.
- **Cypher Query**:
```cypher
MATCH (pt:ProductType {name: 'Energy'})<-[:CLASSIFIED_AS]-(tx:Transaction)-[v:VIOLATES]->(r:Rule)
WITH pt, count(tx) as error_count
WHERE error_count > 50
RETURN pt.name, error_count, "Systemic mapping error for Energy product category" as Rationalization
```

### 3.3 Rate Schedule "Blast Radius"
- **Relevance**: A single `RateSchedule` might be referenced by 1,000 transactions. If the rate schedule itself is misreported, the graph instantly shows the financial impact across the entire portfolio.
- **Past Occurrence Justification**: Numerous **DAA Audit Reports** (e.g., Berkshire Hathaway Energy) where a single tariff interpretation error led to the requirement to refile *all* transactions under that rate schedule for the previous 5 years.
- **Cypher Query**:
```cypher
MATCH (rs:RateSchedule {id: 'SCHED_A'})<-[:PRICED_VIA]-(tx:Transaction)-[v:VIOLATES]->(r:Rule)
RETURN rs.id, sum(tx.extension) as portfolio_exposure, "Material impact on Rate Schedule A compliance" as Justification
```

---

## 4. Materiality Rules & Cypher Implementations (Updated)

### 4.1 Numeric Rules (Quantitative)

#### NUM-001: Absolute Extension Delta
- **Relevance**: FERC audits focus on dollar impact. A delta exceeding $1,000 is traditionally a high-risk candidate for refiling.
- **Past Occurrence Justification**: Standard baseline in **FERC Division of Audits and Accounting** risk assessments. High dollar variance ($1k+) is the "primary filter" for enforcement screening.
- **Involved Tables/Fields**: `Transactions.transaction_extension` (Old vs New).
- **Cypher Query**:
```cypher
MATCH (tx:Transaction)-[v:VIOLATES]->(r:Rule {id: 'NUM-001'})
WHERE abs(v.delta_amount) > 1000
SET v.is_material = true
RETURN tx.id, v.delta_amount, "High Dollar Impact" as Justification
```

#### AG-001: Aggregate Drift ("Death by a Thousand Cuts")
- **Relevance**: Individual errors may be small, but their sum across a filing can distort market totals.
- **Past Occurrence Justification**: **PacifiCorp (2011)** Audit findings. Even where individual errors were small, the *aggregate* volume of discrepancies was cited as a "Failure of Internal Controls," necessitating a full-system audit.
- **Involved Tables/Fields**: `Transactions.transaction_extension` across the entire `Filing`.
- **Cypher Query**:
```cypher
MATCH (f:Filing)-[:CONTAINS]->(tx:Transaction)-[v:VIOLATES]->(r:Rule {id: 'NUM-001'})
WITH f, sum(abs(v.delta_amount)) as total_drift
WHERE total_drift > 100000
RETURN f.id, total_drift, "Aggregate drift exceeds materiality limit" as Rationalization
```

---

### 4.2 Structural Rules (Integrity)

#### STR-002: Orphaned Transactions
- **Relevance**: Transactions without a matching contract are un-auditable and violate the fundamental EQR data model.
- **Past Occurrence Justification**: Recurring audit findings where transactions missing a `Contract ID` were flagged as "Un-auditable." Without the contract path, FERC cannot verify if the price charged was "Just and Reasonable" per the filed tariff.
- **Involved Tables/Fields**: `Transactions.contract_id` vs `Contracts.contract_id`.
- **Cypher Query**:
```cypher
MATCH (tx:Transaction)
WHERE NOT (tx)-[:UNDER_CONTRACT]->(:Contract)
CREATE (tx)-[:VIOLATES {severity: 'Critical'}]->(r:Rule {id: 'STR-002'})
RETURN count(tx) as orphan_count, "Orphaned transactions inhibit regulatory review" as Argument
```

---

### 4.3 Legal & Entity Rules (Compliance)

#### REL-001: Affiliate Concentration Shift
- **Relevance**: FERC monitors affiliate sales to prevent market power abuse. A change in affiliate status for large volumes is always material.
- **Past Occurrence Justification**: **Order 697** monitoring. FERC monitors "pivotal supplier" status. A reporting error that masks a 2% shift in affiliate volume can lead to the revocation of **Market-Based Rate (MBR)** authority.
- **Involved Tables/Fields**: `Contracts.affiliate_status`, `Transactions.quantity`.
- **Cypher Query**:
```cypher
MATCH (c:Company {is_affiliate: true})-[:HAS_CONTRACT]->(con:Contract)<-[:UNDER_CONTRACT]-(tx:Transaction)
WITH sum(tx.quantity) as affiliate_vol
MATCH (total_tx:Transaction)
WITH affiliate_vol, sum(total_tx.quantity) as total_vol
WHERE (affiliate_vol / total_vol) > 0.02
RETURN "Affiliate concentration shift > 2% detected" as MarketPowerWarning
```

#### PROD-003: Negative Pricing Reversal
- **Relevance**: Negative prices indicate specific grid conditions (e.g., oversupply). Flipping a price from negative to positive is a fundamental behavioral change.
- **Past Occurrence Justification**: **Texas Winter Storm (Feb 2021)** and **California Heatwave (2022)**. During extreme events, the "Sign" of the price indicates whether the grid is in oversupply or emergency shortage. Flipping the sign is a "Fundamental Behavioral Change" in reporting.
- **Involved Tables/Fields**: `Transactions.price`.
- **Cypher Query**:
```cypher
MATCH (tx:Transaction)-[v:VIOLATES]->(r:Rule {id: 'PROD-003'})
WHERE (v.old_price < 0 AND v.new_price >= 0) OR (v.old_price >= 0 AND v.new_price < 0)
RETURN tx.id, v.old_price, v.new_price, "Fundamental market behavior change (Sign Flip)" as Justification
```

---

### 4.4 Temporal & Statistical Rules

#### STAT-001: Sigma-3 Outlier
- **Relevance**: Data entry errors often result in extreme outliers (fat-finger errors).
- **Past Occurrence Justification**: **Fat-Finger Detection**. FERC surveillance uses automated statistical filters to identify data entry errors (e.g., $5,000/MWh instead of $50/MWh) which, if left uncorrected, distort market averages.
- **Involved Tables/Fields**: `Transactions.price`.
- **Cypher Query**:
```cypher
MATCH (tx:Transaction)
WITH avg(tx.price) as mu, stDev(tx.price) as sigma
MATCH (tx:Transaction)-[v:VIOLATES]->(r:Rule {id: 'STAT-001'})
WHERE abs(v.new_price - mu) > (3 * sigma)
RETURN tx.id, v.new_price, mu, sigma, "Statistical outlier indicates material reporting error" as Justification
```

---

## 5. Path-Based Materiality: The Graph Advantage

Unlike relational models, the LadyBUG graph can traverse deep relationship paths to identify "hidden" materiality. This is critical for defending against FERC audits focused on market manipulation and affiliate abuse.

### 5.1 Hidden Affiliation Discovery (Deep Ownership)
- **Relevance**: FERC materiality thresholds are much stricter for affiliate transactions. If two entities appear independent but share a parent node 3 levels up, their transactions are materially "Affiliate."
- **Past Occurrence Justification**: **Enron (2001)** used Special Purpose Entities (SPEs) to hide relationships. A graph allows us to find the "Grandparent" shell company that a relational table would miss.
- **Cypher Query**:
```cypher
MATCH (a:Company)-[:OWNED_BY*1..5]->(root:Company)<-[:OWNED_BY*1..5]-(b:Company)
WHERE a <> b
MATCH (a)-[tx:TRANS_WITH]->(b)
RETURN a.name, b.name, root.name, count(tx) as tx_count, 
       "Hidden affiliation detected via common parent: " + root.name as Justification
```

### 5.2 Circular Trading (Wash Sale Detection)
- **Relevance**: Circular trades (A -> B -> C -> A) are used to artificially inflate volumes or hide price signals. Detecting this is material to "Market Integrity."
- **Past Occurrence Justification**: **Enron "Death Star"** and **"Fat Boy"** strategies. Circular scheduling (A-B-C-A) was used to create the appearance of transmission congestion to collect "congestion relief" payments.
- **Cypher Query**:
```cypher
MATCH p = (c1:Company)-[:SOLD_TO*3..5]->(c1)
WHERE all(x IN nodes(p) WHERE labels(x) = 'Company')
RETURN p, "Circular trading pattern detected (potential Wash Sale)" as MaterialityRisk
```

### 5.3 Cross-Regional Wheeling Analysis (ISO Interconnects)
- **Relevance**: Tracking how a single "Product" moves through multiple ISOs (e.g. MISO -> PJM -> NYISO). Materiality arises if the price "leaks" or changes inconsistently across the path.
- **Past Occurrence Justification**: **J.P. Morgan (2013)** and **Barclays**. Exploiting modeling differences between CAISO and MISO. Tracking the "path" is the only way to detect inter-regional arbitrage gaming.
- **Cypher Query**:
```cypher
MATCH p = (src:Generator)-[:DELIVERED_TO]->(iso1:ISO)-[:WHEELED_TO]->(iso2:ISO)-[:DELIVERED_TO]->(dest:LSE)
WITH p, nodes(p) as hops
WHERE size(hops) > 3
RETURN p, "Complex cross-regional path requires structural consistency audit" as Justification
```

### 5.4 Contract Inheritance Cascades
- **Relevance**: A change in a **Master Agreement** (Parent) may "materially" propagate to 500 sub-contracts. LadyBUG can instantly identify the "blast radius" of a single amendment.
- **Past Occurrence Justification**: **Exelon/Pepco Merger (2016)**. During massive corporate consolidations, the "Parent" Master Agreements change, affecting thousands of inherited sub-contracts. Tracking this path is vital for ensuring all "Gold" records reflect the new legal reality.
- **Cypher Query**:
```cypher
MATCH (master:Contract {id: 'MASTER_001'})-[:AMENDED_BY]->(amend:Amendment)
MATCH (master)<-[:CHILD_OF*]-(sub:Contract)
RETURN count(sub) as affected_contracts, "Material amendment cascade from Master Agreement" as Rationalization
```

---

## 7. The "Pre-Audit Shield": Guarding the Filing Entity

While the LadyBUG graph model is powerful enough for FERC surveillance, its primary value in TOWER-SEM is to **guard the filing entity** against inadvertent "shenanigans" and regulatory exposure.

### 7.1 Detecting "Inadvertent Shenanigans"
Traders often run complex strategies that, while physically legitimate, can "look" like manipulation to FERC’s DAS (Division of Analytics and Surveillance). 
- **The Guardrail**: LadyBUG identifies circular trades or location-based outliers **before** the filing is submitted. This allows compliance officers to pause the filing, investigate the trader's intent, and either correct the data or prepare a "Pre-Documented Justification."

### 7.2 Demonstrating "Robust Internal Controls"
Under the **FERC Penalty Guidelines**, the "Culpability Score" of an entity is significantly reduced if they can demonstrate a robust, automated internal compliance program.
- **The Guardrail**: By integrating LadyBUG, the entity moves from "Manual Sampling" to "100% Graph-Based Coverage." This shift from reactive to proactive monitoring serves as a high-value mitigating factor during an audit, often leading to "No Action" findings for inadvertent errors.

### 7.3 Identifying "Rogue" Internal Activity
Management is often the last to know if a specific desk is engaging in "gaming" (e.g. creating phantom congestion). 
- **The Guardrail**: LadyBUG acts as an **Internal Forensic Tool**. It allows the compliance team to monitor for patterns like "CID Ghosting" or "Sign Flipping" internally. Catching these patterns early allows for internal discipline and self-reporting, which qualifies the entity for the most lenient treatment under FERC’s Self-Reporting Policy.

### 7.4 Defending "Immaterial" Decisions
Order 917 requires a "Total Mix of Information" assessment.
- **The Guardrail**: If an entity decides *not* to refile a $5,000 error, they need a defense. LadyBUG provides the graph-based proof that the error was isolated, not circular, and did not occur at a "Sensitive Node." This creates a **"Defensible Rationalization"** that is far more persuasive than a simple "it was a small amount" argument.

---

## 8. Conclusion
TOWER-SEM and the LadyBUG engine transform EQR compliance from a "Data Submission" task into a **"Risk Management"** strategy. By unpacking records into a domain graph and applying enforcement-driven materiality rules, filing entities can proactively shield themselves from the "Index Distorting" and "Market Gaming" flags that trigger FERC Enforcement.
