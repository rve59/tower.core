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
    
    # ---------------------------------------------------------
    # TEST 1: Mechanical Only Audit
    # ---------------------------------------------------------
    print("\n[TEST 1] Testing MECHANICAL MODE...")
    auditor_mech = XDTAuditor(filing, provider=None) # No provider = MECH
    auditor_mech.register_skill(DimensionalRollupSkill())
    
    role_search = "SegmentInformationandGeographicDataInformationbyReportableSegmentDetails"
    results_mech = auditor_mech.audit_role(role_search)
    
    audit_dir_mech = results_mech["audit_dir"]
    report_file_mech = os.path.join(audit_dir_mech, "audit_report.md")
    AuditReportGenerator.save_report(results_mech, report_file_mech)
    
    print(f"Mechanical Audit results saved to: {report_file_mech}")
    assert "MECH" in audit_dir_mech
    assert os.path.exists(report_file_mech)
    
    # ---------------------------------------------------------
    # TEST 2: Ollama Assisted Audit
    # ---------------------------------------------------------
    print("\n[TEST 2] Testing OLLAMA MODE...")
    provider = OllamaProvider()
    auditor_ai = XDTAuditor(filing, provider=provider)
    auditor_ai.register_skill(DimensionalRollupSkill())
    
    results_ai = auditor_ai.audit_role(role_search, model="phi3:medium")
    
    audit_dir_ai = results_ai["audit_dir"]
    report_file_ai = os.path.join(audit_dir_ai, "audit_report.md")
    AuditReportGenerator.save_report(results_ai, report_file_ai)
    
    print(f"AI Audit results saved to: {report_file_ai}")
    assert "OLLAMA" in audit_dir_ai
    assert os.path.exists(report_file_ai)

    print("\nALL VERIFICATION TESTS PASSED.")

if __name__ == "__main__":
    main()
