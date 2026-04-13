import os
import sys

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    print(f"Loading Filing semantic model: {package_path}...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Initialize the XDTAuditor Orchestrator
    auditor = XDTAuditor(filing)
    
    # Register core auditing skills
    auditor.register_skill(DimensionalRollupSkill())
    
    # Target ELR for Audit
    role_search = "SegmentInformationandGeographicDataInformationbyReportableSegmentDetails"
    print(f"Performing Intelligent Audit on Role: {role_search}...")
    
    # Execute Audit with AI Reconciliation (Gemma-4 / Gemma2 via Ollama)
    # Note: If Ollama is offline, the report will still contain mathematical findings.
    report = auditor.audit_role(role_search, model="phi3:medium")
    
    # Generate Professional Audit Report using the formal library generator
    output_dir = "results"
    os.makedirs(output_dir, exist_ok=True)
    report_file = os.path.join(output_dir, "audit_report_apple_004.md")
    
    from lib_xbrl_auditor import AuditReportGenerator
    AuditReportGenerator.save_report(report, report_file)
    
    print(f"Audit Complete. Basis for Opinion saved to: {report_file}")

if __name__ == "__main__":
    main()
