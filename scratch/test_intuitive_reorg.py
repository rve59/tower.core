import os
import sys

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill, OllamaProvider, AuditReportGenerator

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    print(f"Loading Filing semantic model: {package_path}...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Initialize Auditor with Ollama
    provider = OllamaProvider()
    auditor = XDTAuditor(filing, provider=provider)
    auditor.register_skill(DimensionalRollupSkill())
    
    # ---------------------------------------------------------
    # TEST A: Full Mechanical Scan (No Role Provided)
    # ---------------------------------------------------------
    print("\n[TEST A] Testing FULL MECHANICAL SCAN (No Role ID)...")
    results_full = auditor.audit(role_id=None, scope="FULL")
    
    report_path_full = AuditReportGenerator.save_report(results_full)
    print(f"Full MECH Report saved to: {report_path_full}")
    
    assert "AAPL-2024FY-10-K" in report_path_full
    assert "audit_FULL_XDT_MECH" in report_path_full
    assert os.path.exists(report_path_full)
    
    # ---------------------------------------------------------
    # TEST B: Targeted AI Audit (Role ID Provided)
    # ---------------------------------------------------------
    print("\n[TEST B] Testing TARGETED AI AUDIT (Role ID: 9954516)...")
    # We use a substring match for the role search
    results_ai = auditor.audit(role_id="9954516", model="phi3:medium")
    
    report_path_ai = AuditReportGenerator.save_report(results_ai)
    print(f"Targeted AI Report saved to: {report_path_ai}")
    
    assert "AAPL-2024FY-10-K" in report_path_ai
    assert "audit_ROLE_XDT_OLLAMA" in report_path_ai
    assert os.path.exists(report_path_ai)

    print("\nALL INTUITIVE REORG TESTS PASSED.")

if __name__ == "__main__":
    main()
