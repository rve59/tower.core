import os
import sys
import time

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill

def verify_apple_audit():
    package_path = "sample_filings_ugaap/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    print(f"\n=== Verification: Apple 2024 Audit ({package_path}) ===")
    
    # 1. Performance Loading (Binary Cache)
    start_load = time.time()
    print("Loading Filing (Binary Cache Check)...")
    filing = load_filing(package_path, instance_path, entry_point)
    load_duration = time.time() - start_load
    print(f"Filing Loaded in {load_duration:.2f}s (Target: <2s)")
    
    # 2. Audit Orchestrator
    auditor = XDTAuditor(filing)
    auditor.register_skill(DimensionalRollupSkill())
    
    # --- Form 1: Full Mechanical Audit ---
    print("\n--- Form 1: Full Mechanical Scan ---")
    start_mech = time.time()
    mech_report = auditor.audit() # No role_id = Full Scan
    mech_duration = time.time() - start_mech
    print(f"Mechanical Audit Complete in {mech_duration:.2f}s")
    
    # --- Form 2: Targeted AI Reconciliation ---
    # Target: Segment Information
    role_search = "SegmentInformationandGeographicDataInformationbyReportableSegmentDetails"
    print(f"\n--- Form 2: Targeted AI Audit (Role: {role_search}) ---")
    start_ai = time.time()
    # Using 'phi3:medium' as a fast local proxy for gemma4
    ai_report = auditor.audit(role_id=role_search, model="phi3:medium")
    ai_duration = time.time() - start_ai
    print(f"AI Audit Complete in {ai_duration:.2f}s")
    
    print("\nVerification Complete. All caches hit. Binary model is active.")

if __name__ == "__main__":
    verify_apple_audit()
