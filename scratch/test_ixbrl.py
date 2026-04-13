import sys
import os
sys.path.append('libraries')

from lib_xbrl.ixbrl.docset import InlineDocSet
from lib_xbrl.ixbrl.processor import IXBRLProcessor
from lib_xbrl.dts import Dts
from lib_xbrl_auditor.visual import VisualRegistry

def test_ixbrl_ingestion():
    package_dir = "scratch/mock_ixbrl"
    print(f"--- Testing iXBRL Ingestion ---\nPackage: {package_dir}")
    
    # 1. Discover and Aggregare the DocSet
    docset = InlineDocSet.discover_in_package(package_dir)
    print(f"Discovered {len(docset.doc_paths)} XHTML documents.")
    for d in docset.doc_paths:
        print(f"  - {d}")

    # 2. Setup Digital Twin and Processor
    dts = Dts() # Using empty DTS for mock test
    visual_registry = VisualRegistry()
    
    processor = IXBRLProcessor(dts, docset, visual_registry=visual_registry)
    filing = processor.run()
    
    print(f"\nExtracted {len(filing.facts)} semantic facts.")
    
    # 3. Verify Facts (Accuracy Prioritization)
    for f in filing.facts:
        print(f"Fact: {f.qname} | Value: {f.value:,.0f} | Decimals: {f.decimals}")
        
        # Verify Visual Context
        v_ctx = visual_registry.get_context(f.id)
        if v_ctx:
            print(f"  [VISUAL] Source: {v_ctx.doc_path.split('/')[-1]}")
            print(f"  [VISUAL] Snippet: {v_ctx.snippet}")
            if v_ctx.precision_reason:
                print(f"  [REASON] {v_ctx.precision_reason}")
    
    # Check assets specifically
    asset_fact = next((f for f in filing.facts if f.qname == "Assets"), None)
    if asset_fact and asset_fact.value == 150000420:
        print("\n✅ SUCCESS: Accuracy Prioritization correctly selected the precise asset value (150,000,420).")
    else:
        print("\n❌ FAILURE: Precise asset value missing or incorrect.")

if __name__ == "__main__":
    test_ixbrl_ingestion()
