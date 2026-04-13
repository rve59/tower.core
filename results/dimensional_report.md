# XBRL Dimensional Report
**ELR:** `http://www.apple.com/role/SegmentInformationandGeographicDataInformationbyReportableSegmentDetails`
**Package:** `Apple 2024 (aapl-20240928)`

## Validation Summary
- **Status**: ✅ SUCCESS
- **Facts Checked**: 78
- **Violations Found**: 0

## Dimensional Structure
```text
Dimensional Structure for ELR: http://www.apple.com/role/SegmentInformationandGeographicDataInformationbyReportableSegmentDetails
├── SegmentDomain (Default)
│   ├── AmericasSegmentMember
│   ├── EuropeSegmentMember
│   ├── GreaterChinaSegmentMember
│   ├── JapanSegmentMember
│   ├── RestOfAsiaPacificSegmentMember
│   ├── AmericasSegmentMember [Member]
│   ├── EuropeSegmentMember [Member]
│   ├── GreaterChinaSegmentMember [Member]
│   ├── JapanSegmentMember [Member]
│   └── RestOfAsiaPacificSegmentMember [Member]
└── SegmentReportingInformationLineItems
    ├── RevenueFromContractWithCustomerExcludingAssessedTax
    ├── OperatingIncomeLoss
    ├── ScheduleOfSegmentReportingInformationBySegmentTable [Hypercube]
    │   └── StatementBusinessSegmentsAxis [Dimension]
    │       └── SegmentDomain [Member] (Default)
    │           ├── AmericasSegmentMember
    │           ├── EuropeSegmentMember
    │           ├── GreaterChinaSegmentMember
    │           ├── JapanSegmentMember
    │           ├── RestOfAsiaPacificSegmentMember
    │           ├── AmericasSegmentMember [Member]
    │           ├── EuropeSegmentMember [Member]
    │           ├── GreaterChinaSegmentMember [Member]
    │           ├── JapanSegmentMember [Member]
    │           └── RestOfAsiaPacificSegmentMember [Member]
    ├── RevenueFromContractWithCustomerExcludingAssessedTax [Member]
    └── OperatingIncomeLoss [Member]
```

## Context Resolution (Sample)

| Context ID | Relevant Dimensions (ELR + Explicit Overrides) |
| :--- | :--- |
| c-1 | `StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-10 | `StatementClassOfStockAxis`: `A3.600NotesDue2042Member`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-100 | `MajorCustomersAxis`: `CellularNetworkCarriersMember`<br>`ConcentrationRiskByBenchmarkAxis`: `TradeAccountsReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-101 | `MajorCustomersAxis`: `CellularNetworkCarriersMember`<br>`ConcentrationRiskByBenchmarkAxis`: `TradeAccountsReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-102 | `ConcentrationRiskByBenchmarkAxis`: `NonTradeReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-103 | `MajorCustomersAxis`: `VendorOneMember`<br>`ConcentrationRiskByBenchmarkAxis`: `NonTradeReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-104 | `MajorCustomersAxis`: `VendorTwoMember`<br>`ConcentrationRiskByBenchmarkAxis`: `NonTradeReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-105 | `ConcentrationRiskByBenchmarkAxis`: `NonTradeReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-106 | `MajorCustomersAxis`: `VendorOneMember`<br>`ConcentrationRiskByBenchmarkAxis`: `NonTradeReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
| c-107 | `MajorCustomersAxis`: `VendorTwoMember`<br>`ConcentrationRiskByBenchmarkAxis`: `NonTradeReceivableMember`<br>`ConcentrationRiskByTypeAxis`: `CreditConcentrationRiskMember`<br>`StatementBusinessSegmentsAxis`: `SegmentDomain` |
## Hierarchical Fact Report
> This view groups facts by their **Dimensional Identity** and nests them based on the **Context Ontology** (specialization relationships).

- **SegmentDomain**
  - `OperatingIncomeLoss`: 123216000000 **[2023-2024]**
  - `OperatingIncomeLoss`: 114301000000 **[2022-2023]**
  - `OperatingIncomeLoss`: 119437000000 **[2021-2022]**
  - `OperatingIncomeLoss`: 123216000000 **[2023-2024]**
  - `OperatingIncomeLoss`: 114301000000 **[2022-2023]**
  - `OperatingIncomeLoss`: 119437000000 **[2021-2022]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 391035000000 **[2023-2024]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 383285000000 **[2022-2023]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 394328000000 **[2021-2022]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 391035000000 **[2023-2024]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 383285000000 **[2022-2023]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 394328000000 **[2021-2022]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 391035000000 **[2023-2024]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 383285000000 **[2022-2023]**
  - `RevenueFromContractWithCustomerExcludingAssessedTax`: 394328000000 **[2021-2022]**
  - **AmericasSegmentMember**
    - `OperatingIncomeLoss`: 67656000000 **[2023-2024]**
    - `OperatingIncomeLoss`: 60508000000 **[2022-2023]**
    - `OperatingIncomeLoss`: 62683000000 **[2021-2022]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 167045000000 **[2023-2024]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 162560000000 **[2022-2023]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 169658000000 **[2021-2022]**
  - **EuropeSegmentMember**
    - `OperatingIncomeLoss`: 41790000000 **[2023-2024]**
    - `OperatingIncomeLoss`: 36098000000 **[2022-2023]**
    - `OperatingIncomeLoss`: 35233000000 **[2021-2022]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 101328000000 **[2023-2024]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 94294000000 **[2022-2023]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 95118000000 **[2021-2022]**
  - **GreaterChinaSegmentMember**
    - `OperatingIncomeLoss`: 27082000000 **[2023-2024]**
    - `OperatingIncomeLoss`: 30328000000 **[2022-2023]**
    - `OperatingIncomeLoss`: 31153000000 **[2021-2022]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 66952000000 **[2023-2024]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 72559000000 **[2022-2023]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 74200000000 **[2021-2022]**
  - **JapanSegmentMember**
    - `OperatingIncomeLoss`: 12454000000 **[2023-2024]**
    - `OperatingIncomeLoss`: 11888000000 **[2022-2023]**
    - `OperatingIncomeLoss`: 12257000000 **[2021-2022]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 25052000000 **[2023-2024]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 24257000000 **[2022-2023]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 25977000000 **[2021-2022]**
  - **RestOfAsiaPacificSegmentMember**
    - `OperatingIncomeLoss`: 13062000000 **[2023-2024]**
    - `OperatingIncomeLoss`: 12066000000 **[2022-2023]**
    - `OperatingIncomeLoss`: 11569000000 **[2021-2022]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 30658000000 **[2023-2024]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 29615000000 **[2022-2023]**
    - `RevenueFromContractWithCustomerExcludingAssessedTax`: 29375000000 **[2021-2022]**

## Dimensional Aggregation (XDT Rollup) Validation
> This check verifies that the value reported on a Parent Member (Total) equals the sum of values reported on its immediate Child Members (Segments).

- **Checks Performed**: 6
- **Successes**: 3
- **Failures**: 3

| Parent Member | Concept | Period | Reported | Children Sum | Diff | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SegmentDomain** | RevenueFromContractWithCustomerExcludingAssessedTax | 2021-09-26_2022-09-24 | 394,328,000,000 | 394,328,000,000 | 0 | ✅ |
| **SegmentDomain** | RevenueFromContractWithCustomerExcludingAssessedTax | 2023-10-01_2024-09-28 | 391,035,000,000 | 391,035,000,000 | 0 | ✅ |
| **SegmentDomain** | RevenueFromContractWithCustomerExcludingAssessedTax | 2022-09-25_2023-09-30 | 383,285,000,000 | 383,285,000,000 | 0 | ✅ |
| **SegmentDomain** | OperatingIncomeLoss | 2023-10-01_2024-09-28 | 123,216,000,000 | 162,044,000,000 | -38,828,000,000 | ❌ |
| **SegmentDomain** | OperatingIncomeLoss | 2021-09-26_2022-09-24 | 119,437,000,000 | 152,895,000,000 | -33,458,000,000 | ❌ |
| **SegmentDomain** | OperatingIncomeLoss | 2022-09-25_2023-09-30 | 114,301,000,000 | 150,888,000,000 | -36,587,000,000 | ❌ |
