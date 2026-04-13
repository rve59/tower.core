# XBRL XDTAuditor Analysis Report
**Report Generated**: 2026-04-10 19:01:12

## 1. Audit Scope & Metadata
- **Filing Entity**: ASML
- **Report Type**: 10-X
- **Fiscal Period**: 20XX
- **Audit Scope**: FULL
- **Intelligence Layer**: XDTAuditor (Mechanical Mode Only)

## 2. Executive Summary
- **Total Checks**: 185
- **Successes**: ✅ 110
- **Exceptions Flagged**: ❌ 75
- **Overall Status**: ⚠️ Attention Required

## 3. Detailed Audit Findings

### Role: [0000007] Statement of cash flows, indirect method (Parenthetical)
#### Skill: DimensionalRollup
✅ No discrepancies found by this skill.

----------------------------------------
#### Skill: CalculationRollup
✅ No discrepancies found by this skill.

----------------------------------------

### Role: [0000006] Statement of cash flows, indirect method (Statement)
#### Skill: DimensionalRollup
✅ No discrepancies found by this skill.

----------------------------------------
#### Skill: CalculationRollup
✅ No discrepancies found by this skill.

----------------------------------------

### Role: [0000005] Statement of changes in equity (Parenthetical)
#### Skill: DimensionalRollup
✅ No discrepancies found by this skill.

----------------------------------------
#### Skill: CalculationRollup
✅ No discrepancies found by this skill.

----------------------------------------

### Role: [0000004] Statement of changes in equity (Statement)
#### Skill: DimensionalRollup
**Discrepancies Detected (65):**
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod** (D:2021-01-01_2021-12-31): Discrepancy of 22,000,000 found (Reported: 22,000,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod** (D:2022-01-01_2022-12-31): Discrepancy of 37,700,000 found (Reported: 37,700,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod** (D:2023-01-01_2023-12-31): Discrepancy of 200,000 found (Reported: 200,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2021-01-01_2021-12-31): Discrepancy of 95,400,000 found (Reported: 95,400,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2022-01-01_2022-12-31): Discrepancy of 68,900,000 found (Reported: 68,900,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2023-01-01_2023-12-31): Discrepancy of -67,600,000 found (Reported: -67,600,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (D:2021-01-01_2021-12-31): Discrepancy of 156,200,000 found (Reported: 6,290,800,000, Sum: 6,134,600,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (D:2022-01-01_2022-12-31): Discrepancy of 97,700,000 found (Reported: 6,493,500,000, Sum: 6,395,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (D:2023-01-01_2023-12-31): Discrepancy of -82,600,000 found (Reported: 8,032,600,000, Sum: 8,115,200,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2022-12-31): Discrepancy of 4,890,200,000 found (Reported: 11,286,000,000, Sum: 6,395,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2023-12-31): Discrepancy of 8,094,300,000 found (Reported: 16,209,500,000, Sum: 8,115,200,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2020-12-31): Discrepancy of 11,604,100,000 found (Reported: 15,300,900,000, Sum: 3,696,800,000).
- **{http://www.asml.com/20231231}PriorPeriodProfit** (D:2021-01-01_2021-12-31): Discrepancy of 3,696,800,000 found (Reported: 0, Sum: -3,696,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2021-01-01_2021-12-31): Discrepancy of 38,800,000 found (Reported: 38,800,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}PurchaseOfTreasuryShares** (D:2021-01-01_2021-12-31): Discrepancy of 8,560,300,000 found (Reported: 8,560,300,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IncreaseDecreaseThroughSharebasedPaymentTransactions** (D:2021-01-01_2021-12-31): Discrepancy of 131,700,000 found (Reported: 131,700,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IssueOfEquity** (D:2021-01-01_2021-12-31): Discrepancy of 49,000,000 found (Reported: 49,000,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}DividendsPaid** (D:2021-01-01_2021-12-31): Discrepancy of 1,368,300,000 found (Reported: 1,368,300,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2021-12-31): Discrepancy of 5,709,200,000 found (Reported: 11,843,800,000, Sum: 6,134,600,000).
- **{http://www.asml.com/20231231}PriorPeriodProfit** (D:2022-01-01_2022-12-31): Discrepancy of 6,134,600,000 found (Reported: 0, Sum: -6,134,600,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2022-01-01_2022-12-31): Discrepancy of -8,900,000 found (Reported: -8,900,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}PurchaseOfTreasuryShares** (D:2022-01-01_2022-12-31): Discrepancy of 4,639,700,000 found (Reported: 4,639,700,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IncreaseDecreaseThroughSharebasedPaymentTransactions** (D:2022-01-01_2022-12-31): Discrepancy of 66,400,000 found (Reported: 66,400,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IssueOfEquity** (D:2022-01-01_2022-12-31): Discrepancy of 81,800,000 found (Reported: 81,800,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}DividendsPaid** (D:2022-01-01_2022-12-31): Discrepancy of 2,559,800,000 found (Reported: 2,559,800,000, Sum: 0).
- **{http://www.asml.com/20231231}PriorPeriodProfit** (D:2023-01-01_2023-12-31): Discrepancy of 6,395,800,000 found (Reported: 0, Sum: -6,395,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2023-01-01_2023-12-31): Discrepancy of -15,200,000 found (Reported: -15,200,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}PurchaseOfTreasuryShares** (D:2023-01-01_2023-12-31): Discrepancy of 1,000,000,000 found (Reported: 1,000,000,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IncreaseDecreaseThroughSharebasedPaymentTransactions** (D:2023-01-01_2023-12-31): Discrepancy of 139,800,000 found (Reported: 139,800,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IssueOfEquity** (D:2023-01-01_2023-12-31): Discrepancy of 99,400,000 found (Reported: 99,400,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}DividendsPaid** (D:2023-01-01_2023-12-31): Discrepancy of 2,348,300,000 found (Reported: 2,348,300,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2020-12-31): Discrepancy of -7,907,300,000 found (Reported: 3,696,800,000, Sum: 11,604,100,000).
- **{http://www.asml.com/20231231}PriorPeriodProfit** (D:2021-01-01_2021-12-31): Discrepancy of -7,393,600,000 found (Reported: -3,696,800,000, Sum: 3,696,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ProfitLoss** (D:2021-01-01_2021-12-31): Discrepancy of 6,134,600,000 found (Reported: 6,134,600,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod** (D:2021-01-01_2021-12-31): Discrepancy of -22,000,000 found (Reported: 0, Sum: 22,000,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2021-01-01_2021-12-31): Discrepancy of -95,400,000 found (Reported: 0, Sum: 95,400,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2021-01-01_2021-12-31): Discrepancy of -38,800,000 found (Reported: 0, Sum: 38,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (D:2021-01-01_2021-12-31): Discrepancy of 5,978,400,000 found (Reported: 6,134,600,000, Sum: 156,200,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}PurchaseOfTreasuryShares** (D:2021-01-01_2021-12-31): Discrepancy of -8,560,300,000 found (Reported: 0, Sum: 8,560,300,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IncreaseDecreaseThroughSharebasedPaymentTransactions** (D:2021-01-01_2021-12-31): Discrepancy of -131,700,000 found (Reported: 0, Sum: 131,700,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IssueOfEquity** (D:2021-01-01_2021-12-31): Discrepancy of -49,000,000 found (Reported: 0, Sum: 49,000,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}DividendsPaid** (D:2021-01-01_2021-12-31): Discrepancy of -1,368,300,000 found (Reported: 0, Sum: 1,368,300,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2021-12-31): Discrepancy of 425,400,000 found (Reported: 6,134,600,000, Sum: 5,709,200,000).
- **{http://www.asml.com/20231231}PriorPeriodProfit** (D:2022-01-01_2022-12-31): Discrepancy of -12,269,200,000 found (Reported: -6,134,600,000, Sum: 6,134,600,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ProfitLoss** (D:2022-01-01_2022-12-31): Discrepancy of 6,395,800,000 found (Reported: 6,395,800,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod** (D:2022-01-01_2022-12-31): Discrepancy of -37,700,000 found (Reported: 0, Sum: 37,700,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2022-01-01_2022-12-31): Discrepancy of -68,900,000 found (Reported: 0, Sum: 68,900,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2022-01-01_2022-12-31): Discrepancy of 8,900,000 found (Reported: 0, Sum: -8,900,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (D:2022-01-01_2022-12-31): Discrepancy of 6,298,100,000 found (Reported: 6,395,800,000, Sum: 97,700,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}PurchaseOfTreasuryShares** (D:2022-01-01_2022-12-31): Discrepancy of -4,639,700,000 found (Reported: 0, Sum: 4,639,700,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IncreaseDecreaseThroughSharebasedPaymentTransactions** (D:2022-01-01_2022-12-31): Discrepancy of -66,400,000 found (Reported: 0, Sum: 66,400,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IssueOfEquity** (D:2022-01-01_2022-12-31): Discrepancy of -81,800,000 found (Reported: 0, Sum: 81,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}DividendsPaid** (D:2022-01-01_2022-12-31): Discrepancy of -2,559,800,000 found (Reported: 0, Sum: 2,559,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2022-12-31): Discrepancy of 1,505,600,000 found (Reported: 6,395,800,000, Sum: 4,890,200,000).
- **{http://www.asml.com/20231231}PriorPeriodProfit** (D:2023-01-01_2023-12-31): Discrepancy of -12,791,600,000 found (Reported: -6,395,800,000, Sum: 6,395,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ProfitLoss** (D:2023-01-01_2023-12-31): Discrepancy of 8,115,200,000 found (Reported: 8,115,200,000, Sum: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod** (D:2023-01-01_2023-12-31): Discrepancy of -200,000 found (Reported: 0, Sum: 200,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2023-01-01_2023-12-31): Discrepancy of 67,600,000 found (Reported: 0, Sum: -67,600,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2023-01-01_2023-12-31): Discrepancy of 15,200,000 found (Reported: 0, Sum: -15,200,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (D:2023-01-01_2023-12-31): Discrepancy of 8,197,800,000 found (Reported: 8,115,200,000, Sum: -82,600,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}PurchaseOfTreasuryShares** (D:2023-01-01_2023-12-31): Discrepancy of -1,000,000,000 found (Reported: 0, Sum: 1,000,000,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IncreaseDecreaseThroughSharebasedPaymentTransactions** (D:2023-01-01_2023-12-31): Discrepancy of -139,800,000 found (Reported: 0, Sum: 139,800,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}IssueOfEquity** (D:2023-01-01_2023-12-31): Discrepancy of -99,400,000 found (Reported: 0, Sum: 99,400,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}DividendsPaid** (D:2023-01-01_2023-12-31): Discrepancy of -2,348,300,000 found (Reported: 0, Sum: 2,348,300,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}Equity** (I:2023-12-31): Discrepancy of 20,900,000 found (Reported: 8,115,200,000, Sum: 8,094,300,000).

----------------------------------------
#### Skill: CalculationRollup
✅ No discrepancies found by this skill.

----------------------------------------

### Role: [0000008] Statement of comprehensive income, OCI components presented net of tax (Parenthetical)
#### Skill: DimensionalRollup
**Discrepancies Detected (6):**
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2021-01-01_2021-12-31): Discrepancy of -150,700,000 found (Reported: 95,400,000, Sum: 246,100,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2022-01-01_2022-12-31): Discrepancy of -218,000,000 found (Reported: 68,900,000, Sum: 286,900,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}GainsLossesOnExchangeDifferencesOnTranslationNetOfTax** (D:2023-01-01_2023-12-31): Discrepancy of -151,300,000 found (Reported: -67,600,000, Sum: 83,700,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2021-01-01_2021-12-31): Discrepancy of 16,500,000 found (Reported: 38,800,000, Sum: 22,300,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2022-01-01_2022-12-31): Discrepancy of -7,600,000 found (Reported: -8,900,000, Sum: -1,300,000).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherComprehensiveIncomeNetOfTaxCashFlowHedges** (D:2023-01-01_2023-12-31): Discrepancy of 7,600,000 found (Reported: -15,200,000, Sum: -22,800,000).

----------------------------------------
#### Skill: CalculationRollup
✅ No discrepancies found by this skill.

----------------------------------------

### Role: [0000002] Statement of comprehensive income, OCI components presented net of tax (Statement)
#### Skill: DimensionalRollup
✅ No discrepancies found by this skill.

----------------------------------------
#### Skill: CalculationRollup
**Discrepancies Detected (3):**
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (Identity: {'{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComponentsOfEquityAxis': '{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherReservesMember'}): Calculation discrepancy of 97,700,000 found (Reported: 97,700,000, Expected: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (Identity: {'{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComponentsOfEquityAxis': '{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherReservesMember'}): Calculation discrepancy of 156,200,000 found (Reported: 156,200,000, Expected: 0).
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComprehensiveIncome** (Identity: {'{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ComponentsOfEquityAxis': '{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}OtherReservesMember'}): Calculation discrepancy of 82,600,000 found (Reported: -82,600,000, Expected: 0).

----------------------------------------

### Role: [0000001] Statement of comprehensive income, profit or loss, by function of expense (Statement)
#### Skill: DimensionalRollup
✅ No discrepancies found by this skill.

----------------------------------------
#### Skill: CalculationRollup
**Discrepancies Detected (1):**
- **{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ProfitLossFromOperatingActivities** (Identity: {'{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ContinuingAndDiscontinuedOperationsAxis': '{https://xbrl.ifrs.org/taxonomy/2022-03-24/ifrs-full}ContinuingOperationsMember'}): Calculation discrepancy of 213,700,000 found (Reported: 7,043,900,000, Expected: 6,830,200,000).

----------------------------------------

### Role: [0000003] Statement of financial position, current/non-current (Statement)
#### Skill: DimensionalRollup
✅ No discrepancies found by this skill.

----------------------------------------
#### Skill: CalculationRollup
✅ No discrepancies found by this skill.

----------------------------------------

## 4. Technical Exceptions Ledger
| Role | Concept | Status | Message |
| :--- | :--- | :--- | :--- |
| [0000004] Statement of changes... | ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod | ❌ | Discrepancy of 22,000,000 found (Reported: 22,000,000, Sum: 0). |
| [0000004] Statement of changes... | ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod | ❌ | Discrepancy of 37,700,000 found (Reported: 37,700,000, Sum: 0). |
| [0000004] Statement of changes... | ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod | ❌ | Discrepancy of 200,000 found (Reported: 200,000, Sum: 0). |
| [0000004] Statement of changes... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of 95,400,000 found (Reported: 95,400,000, Sum: 0). |
| [0000004] Statement of changes... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of 68,900,000 found (Reported: 68,900,000, Sum: 0). |
| [0000004] Statement of changes... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of -67,600,000 found (Reported: -67,600,000, Sum: 0). |
| [0000004] Statement of changes... | ComprehensiveIncome | ❌ | Discrepancy of 156,200,000 found (Reported: 6,290,800,000, Sum: 6,134,600,000). |
| [0000004] Statement of changes... | ComprehensiveIncome | ❌ | Discrepancy of 97,700,000 found (Reported: 6,493,500,000, Sum: 6,395,800,000). |
| [0000004] Statement of changes... | ComprehensiveIncome | ❌ | Discrepancy of -82,600,000 found (Reported: 8,032,600,000, Sum: 8,115,200,000). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of 4,890,200,000 found (Reported: 11,286,000,000, Sum: 6,395,800,000). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of 8,094,300,000 found (Reported: 16,209,500,000, Sum: 8,115,200,000). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of 11,604,100,000 found (Reported: 15,300,900,000, Sum: 3,696,800,000). |
| [0000004] Statement of changes... | PriorPeriodProfit | ❌ | Discrepancy of 3,696,800,000 found (Reported: 0, Sum: -3,696,800,000). |
| [0000004] Statement of changes... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of 38,800,000 found (Reported: 38,800,000, Sum: 0). |
| [0000004] Statement of changes... | PurchaseOfTreasuryShares | ❌ | Discrepancy of 8,560,300,000 found (Reported: 8,560,300,000, Sum: 0). |
| [0000004] Statement of changes... | IncreaseDecreaseThroughSharebasedPaymentTransactions | ❌ | Discrepancy of 131,700,000 found (Reported: 131,700,000, Sum: 0). |
| [0000004] Statement of changes... | IssueOfEquity | ❌ | Discrepancy of 49,000,000 found (Reported: 49,000,000, Sum: 0). |
| [0000004] Statement of changes... | DividendsPaid | ❌ | Discrepancy of 1,368,300,000 found (Reported: 1,368,300,000, Sum: 0). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of 5,709,200,000 found (Reported: 11,843,800,000, Sum: 6,134,600,000). |
| [0000004] Statement of changes... | PriorPeriodProfit | ❌ | Discrepancy of 6,134,600,000 found (Reported: 0, Sum: -6,134,600,000). |
| [0000004] Statement of changes... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of -8,900,000 found (Reported: -8,900,000, Sum: 0). |
| [0000004] Statement of changes... | PurchaseOfTreasuryShares | ❌ | Discrepancy of 4,639,700,000 found (Reported: 4,639,700,000, Sum: 0). |
| [0000004] Statement of changes... | IncreaseDecreaseThroughSharebasedPaymentTransactions | ❌ | Discrepancy of 66,400,000 found (Reported: 66,400,000, Sum: 0). |
| [0000004] Statement of changes... | IssueOfEquity | ❌ | Discrepancy of 81,800,000 found (Reported: 81,800,000, Sum: 0). |
| [0000004] Statement of changes... | DividendsPaid | ❌ | Discrepancy of 2,559,800,000 found (Reported: 2,559,800,000, Sum: 0). |
| [0000004] Statement of changes... | PriorPeriodProfit | ❌ | Discrepancy of 6,395,800,000 found (Reported: 0, Sum: -6,395,800,000). |
| [0000004] Statement of changes... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of -15,200,000 found (Reported: -15,200,000, Sum: 0). |
| [0000004] Statement of changes... | PurchaseOfTreasuryShares | ❌ | Discrepancy of 1,000,000,000 found (Reported: 1,000,000,000, Sum: 0). |
| [0000004] Statement of changes... | IncreaseDecreaseThroughSharebasedPaymentTransactions | ❌ | Discrepancy of 139,800,000 found (Reported: 139,800,000, Sum: 0). |
| [0000004] Statement of changes... | IssueOfEquity | ❌ | Discrepancy of 99,400,000 found (Reported: 99,400,000, Sum: 0). |
| [0000004] Statement of changes... | DividendsPaid | ❌ | Discrepancy of 2,348,300,000 found (Reported: 2,348,300,000, Sum: 0). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of -7,907,300,000 found (Reported: 3,696,800,000, Sum: 11,604,100,000). |
| [0000004] Statement of changes... | PriorPeriodProfit | ❌ | Discrepancy of -7,393,600,000 found (Reported: -3,696,800,000, Sum: 3,696,800,000). |
| [0000004] Statement of changes... | ProfitLoss | ❌ | Discrepancy of 6,134,600,000 found (Reported: 6,134,600,000, Sum: 0). |
| [0000004] Statement of changes... | ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod | ❌ | Discrepancy of -22,000,000 found (Reported: 0, Sum: 22,000,000). |
| [0000004] Statement of changes... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of -95,400,000 found (Reported: 0, Sum: 95,400,000). |
| [0000004] Statement of changes... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of -38,800,000 found (Reported: 0, Sum: 38,800,000). |
| [0000004] Statement of changes... | ComprehensiveIncome | ❌ | Discrepancy of 5,978,400,000 found (Reported: 6,134,600,000, Sum: 156,200,000). |
| [0000004] Statement of changes... | PurchaseOfTreasuryShares | ❌ | Discrepancy of -8,560,300,000 found (Reported: 0, Sum: 8,560,300,000). |
| [0000004] Statement of changes... | IncreaseDecreaseThroughSharebasedPaymentTransactions | ❌ | Discrepancy of -131,700,000 found (Reported: 0, Sum: 131,700,000). |
| [0000004] Statement of changes... | IssueOfEquity | ❌ | Discrepancy of -49,000,000 found (Reported: 0, Sum: 49,000,000). |
| [0000004] Statement of changes... | DividendsPaid | ❌ | Discrepancy of -1,368,300,000 found (Reported: 0, Sum: 1,368,300,000). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of 425,400,000 found (Reported: 6,134,600,000, Sum: 5,709,200,000). |
| [0000004] Statement of changes... | PriorPeriodProfit | ❌ | Discrepancy of -12,269,200,000 found (Reported: -6,134,600,000, Sum: 6,134,600,000). |
| [0000004] Statement of changes... | ProfitLoss | ❌ | Discrepancy of 6,395,800,000 found (Reported: 6,395,800,000, Sum: 0). |
| [0000004] Statement of changes... | ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod | ❌ | Discrepancy of -37,700,000 found (Reported: 0, Sum: 37,700,000). |
| [0000004] Statement of changes... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of -68,900,000 found (Reported: 0, Sum: 68,900,000). |
| [0000004] Statement of changes... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of 8,900,000 found (Reported: 0, Sum: -8,900,000). |
| [0000004] Statement of changes... | ComprehensiveIncome | ❌ | Discrepancy of 6,298,100,000 found (Reported: 6,395,800,000, Sum: 97,700,000). |
| [0000004] Statement of changes... | PurchaseOfTreasuryShares | ❌ | Discrepancy of -4,639,700,000 found (Reported: 0, Sum: 4,639,700,000). |
| [0000004] Statement of changes... | IncreaseDecreaseThroughSharebasedPaymentTransactions | ❌ | Discrepancy of -66,400,000 found (Reported: 0, Sum: 66,400,000). |
| [0000004] Statement of changes... | IssueOfEquity | ❌ | Discrepancy of -81,800,000 found (Reported: 0, Sum: 81,800,000). |
| [0000004] Statement of changes... | DividendsPaid | ❌ | Discrepancy of -2,559,800,000 found (Reported: 0, Sum: 2,559,800,000). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of 1,505,600,000 found (Reported: 6,395,800,000, Sum: 4,890,200,000). |
| [0000004] Statement of changes... | PriorPeriodProfit | ❌ | Discrepancy of -12,791,600,000 found (Reported: -6,395,800,000, Sum: 6,395,800,000). |
| [0000004] Statement of changes... | ProfitLoss | ❌ | Discrepancy of 8,115,200,000 found (Reported: 8,115,200,000, Sum: 0). |
| [0000004] Statement of changes... | ShareOfOtherComprehensiveIncomeOfAssociatesAndJointVenturesAccountedForUsingEquityMethod | ❌ | Discrepancy of -200,000 found (Reported: 0, Sum: 200,000). |
| [0000004] Statement of changes... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of 67,600,000 found (Reported: 0, Sum: -67,600,000). |
| [0000004] Statement of changes... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of 15,200,000 found (Reported: 0, Sum: -15,200,000). |
| [0000004] Statement of changes... | ComprehensiveIncome | ❌ | Discrepancy of 8,197,800,000 found (Reported: 8,115,200,000, Sum: -82,600,000). |
| [0000004] Statement of changes... | PurchaseOfTreasuryShares | ❌ | Discrepancy of -1,000,000,000 found (Reported: 0, Sum: 1,000,000,000). |
| [0000004] Statement of changes... | IncreaseDecreaseThroughSharebasedPaymentTransactions | ❌ | Discrepancy of -139,800,000 found (Reported: 0, Sum: 139,800,000). |
| [0000004] Statement of changes... | IssueOfEquity | ❌ | Discrepancy of -99,400,000 found (Reported: 0, Sum: 99,400,000). |
| [0000004] Statement of changes... | DividendsPaid | ❌ | Discrepancy of -2,348,300,000 found (Reported: 0, Sum: 2,348,300,000). |
| [0000004] Statement of changes... | Equity | ❌ | Discrepancy of 20,900,000 found (Reported: 8,115,200,000, Sum: 8,094,300,000). |
| [0000008] Statement of compreh... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of -150,700,000 found (Reported: 95,400,000, Sum: 246,100,000). |
| [0000008] Statement of compreh... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of -218,000,000 found (Reported: 68,900,000, Sum: 286,900,000). |
| [0000008] Statement of compreh... | GainsLossesOnExchangeDifferencesOnTranslationNetOfTax | ❌ | Discrepancy of -151,300,000 found (Reported: -67,600,000, Sum: 83,700,000). |
| [0000008] Statement of compreh... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of 16,500,000 found (Reported: 38,800,000, Sum: 22,300,000). |
| [0000008] Statement of compreh... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of -7,600,000 found (Reported: -8,900,000, Sum: -1,300,000). |
| [0000008] Statement of compreh... | OtherComprehensiveIncomeNetOfTaxCashFlowHedges | ❌ | Discrepancy of 7,600,000 found (Reported: -15,200,000, Sum: -22,800,000). |
| [0000002] Statement of compreh... | ComprehensiveIncome | ❌ | Calculation discrepancy of 97,700,000 found (Reported: 97,700,000, Expected: 0). |
| [0000002] Statement of compreh... | ComprehensiveIncome | ❌ | Calculation discrepancy of 156,200,000 found (Reported: 156,200,000, Expected: 0). |
| [0000002] Statement of compreh... | ComprehensiveIncome | ❌ | Calculation discrepancy of 82,600,000 found (Reported: -82,600,000, Expected: 0). |
| [0000001] Statement of compreh... | ProfitLossFromOperatingActivities | ❌ | Calculation discrepancy of 213,700,000 found (Reported: 7,043,900,000, Expected: 6,830,200,000). |