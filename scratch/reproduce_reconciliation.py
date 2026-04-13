import sys
import os

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill, OllamaProvider

def main():
    package_path = "sample_filings_ugaap/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    role_id = "9954517" # The "Reconciliation of Segment Operating Income" role
    
    # Initialize Filing
    print(f"Loading Apple 2024 Filing for AI-Assisted Reconciliation...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Initialize AI Provider
    provider = OllamaProvider()
    
    # Initialize Auditor
    auditor = XDTAuditor(filing, provider=provider)
    auditor.register_skill(DimensionalRollupSkill())
    
    # Execute AI-Assisted Audit (targeting the reconciliation bridge)
    # Using gemma4:26b as the expert reasoner
    print(f"Executing Expert Audit on Role {role_id} with gemma4:26b...")
    report_data = auditor.audit(role_id=role_id, model="gemma4:26b")
    
    if "error" in report_data:
        print(f"Error: {report_data['error']}")
    else:
        print(f"AI Audit Successful. Report saved to: {report_data['report_path']}")
        
        # Check if AI produced an opinion
        for role_uri, results in report_data["roles"].items():
            for skill_name, detail in results["sections"].items():
                if detail.get("ai_opinion"):
                    print("\n--- AI RECONCILIATION OPINION ---")
                    print(detail["ai_opinion"])

if __name__ == "__main__":
    main()
