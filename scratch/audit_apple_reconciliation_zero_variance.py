import sys
import os

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill, OllamaProvider

def main():
    # Role Parms
    package_path = "sample_filings_ugaap/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    role_id = "9954517" # The ERL parm requested
    model_parm = "phi3:medium" # The LLM model parm optimized for VRAM
    
    # Initialize Filing
    print(f"Loading Apple 2024 Filing...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Initialize Auditor with Persistence
    auditor = XDTAuditor(filing, provider=OllamaProvider())
    auditor.register_skill(DimensionalRollupSkill())
    
    # Execute AI-Assisted Audit
    print(f"Executing AI Audit on Role {role_id} with {model_parm}...")
    report_data = auditor.audit(role_id=role_id, model=model_parm)
    
    if "error" in report_data:
        print(f"Error: {report_data['error']}")
    else:
        print(f"Audit Successful.")
        print(f"Report Location: {report_data['report_path']}")
        
        # Output the Proof directly to console for verification
        for role_uri, results in report_data["roles"].items():
            for skill_name, detail in results["sections"].items():
                if detail.get("ai_opinion"):
                    print("\n=== AI RECONCILIATION PROOF (VRAM Optimized) ===")
                    print(detail["ai_opinion"])

if __name__ == "__main__":
    main()
