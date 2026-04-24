import shutil
from pathlib import Path
import sys

# Add tower_kernel to path if running from scratch directory
sys.path.append(str(Path(__file__).parent.parent.parent / "tower_kernel/src"))

try:
    from tower_kernel.services.discovery_indexer import MasterDiscoveryService
    from tower_kernel.utils.logging import log_progress
except ImportError:
    print("Warning: Could not import TOWER-K services. Some re-init steps may fail.")

def reset_to_blank_slate():
    """
    Purges all processed state from the TOWER system.
    """
    data_root = Path("tower_kernel/data")
    paths_to_wipe = [
        data_root / "lake",
        data_root / "master/registry",
        data_root / "workspace",
        Path("tower.core/logs"),
        Path("tower_kernel/logs")
    ]

    print("--- TOWER SYSTEM RESET ---")
    for path in paths_to_wipe:
        if path.exists():
            print(f"Wiping: {path}...")
            shutil.rmtree(path)
            path.mkdir(parents=True, exist_ok=True)
        else:
            print(f"Skipping: {path} (not found)")

    print("\n[SUCCESS] System is now at a Blank Slate state.")
    print("Source archives in 'tower_kernel/data/historic' have been preserved.")

def reinitialize_system():
    """
    Re-establishes the master discovery index.
    """
    print("\n--- RE-INITIALIZING SYSTEM ---")
    try:
        MasterDiscoveryService.rebuild_index()
        print("[SUCCESS] Master Discovery Index re-established.")
        print("You can now begin re-ingesting specific companies using FERCMasterExtractor.")
    except Exception as e:
        print(f"[ERROR] Re-initialization failed: {e}")

if __name__ == "__main__":
    # Safety Check
    confirm = input("This will DELETE ALL processed data in the lake. Proceed? (y/N): ")
    if confirm.lower() == 'y':
        reset_to_blank_slate()
        
        re_init = input("\nRe-establish Master Discovery Index now? (y/N): ")
        if re_init.lower() == 'y':
            reinitialize_system()
    else:
        print("Reset aborted.")
