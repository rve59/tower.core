import os
import sys
from lib_xbrl import load_filing
from lib_xbrl.dts import Context, Fact

def test_modeling_error():
    sys.path.append(os.path.join(os.getcwd(), 'libraries'))
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    filing = load_filing(package_path, instance_path, entry_point)
    
    # 1. Create a "Ghost" dimension that is neither in ELR nor in Global Defaults
    # Add a fact with a context containing this ghost dimension
    ghost_ctx = Context(
        id="ghost-ctx",
        entity_scheme="http://fake.com",
        entity_id="123",
        explicit_dimensions={"{http://fake.com}GhostAxis": "{http://fake.com}GhostMember"}
    )
    filing.add_context(ghost_ctx)
    
    # Add a fact that uses a concept already in the disaggregation table (to ensure it gets checked)
    # The role RevenueNetSalesDisaggregatedbySignificantProductsandServicesDetails has RevenueFromContractWithCustomerExcludingAssessedTax
    ghost_fact = Fact(
        qname="{http://fasb.org/us-gaap/2024}RevenueFromContractWithCustomerExcludingAssessedTax",
        value="1000",
        context_id="ghost-ctx"
    )
    filing.facts.append(ghost_fact)
    
    role_search = "RevenueNetSalesDisaggregatedbySignificantProductsandServicesDetails"
    print(f"Validating {role_search} with ghost fact...")
    report = filing.validate_dimensions(role_search)
    
    violations = [v for v in report["violations"] if v["type"] == "ModelingError"]
    if violations:
        print("✅ SUCCESS: Modeling Error detected!")
        for v in violations:
            print(f"  - {v['message']}")
    else:
        print("❌ FAILURE: Modeling Error NOT detected.")

if __name__ == "__main__":
    test_modeling_error()
