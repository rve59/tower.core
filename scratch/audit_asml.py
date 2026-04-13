import sys
import os
import time

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill, OllamaProvider

def main():
    # 1. Configuration for ASML 2023
    package_path = "sample_filings_ifrs/ASML-2023-ESEF-Package/asml-2023-12-31-en"
    instance_path = "reports/asml-2023-12-31-en.xhtml"
    
    print(f"Loading ASML 2023 IFRS Filing...")
    start_load = time.time()
    # Note: load_filing will automatically use PackageLoader for the directory
    filing = load_filing(package_path, instance_path)
    print(f"Filing Loaded in {time.time() - start_load:.2f}s")
    
    # 2. Orchestration
    # We'll use a local model if available, otherwise just mechanical
    provider = OllamaProvider()
    auditor = XDTAuditor(filing, provider=provider)
    auditor.register_skill(DimensionalRollupSkill())
    
    # 3. Targeted Audit
    # We'll look for the Statement of Financial Position (Role 0000003)
    target_role = "http://www.asml.com/role/StatementoffinancialpositioncurrentnoncurrentStatement"
    
    print(f"Executing AI Audit on ASML Role [Statement of Financial Position]...")
    start_audit = time.time()
    
    # We run a mechanical scan first to see the facts
    result = auditor.audit(role_id=target_role, model="phi3:medium")
    
    print(f"Audit Completed in {time.time() - start_audit:.2f}s")
    print(f"Report Location: {result.get('report_path')}")

if __name__ == "__main__":
    main()
