import os
import sys
import json
from io import StringIO
from lib_xbrl import load_filing

def generate_markdown_report(filing, role_search):
    # 1. Perform Validation
    report = filing.validate_dimensions(role_search)
    role_uri = report["role"]
    
    # 2. Capture Tree Output
    tree_io = StringIO()
    filing.hierarchy_dimensions(role_search, file=tree_io)
    tree_text = tree_io.getvalue()
    
    # 3. Build Markdown
    md = []
    md.append(f"# XBRL Dimensional Report")
    md.append(f"**ELR:** `{role_uri}`")
    md.append(f"**Package:** `Apple 2024 (aapl-20240928)`")
    md.append("")
    
    md.append("## Validation Summary")
    status_emoji = "✅" if report["status"] == "success" else "❌"
    md.append(f"- **Status**: {status_emoji} {report['status'].upper()}")
    md.append(f"- **Facts Checked**: {report['total_facts_checked']}")
    md.append(f"- **Violations Found**: {len(report['violations'])}")
    md.append("")
    
    if report["violations"]:
        md.append("### Violations Details")
        md.append("")
        md.append("| Fact | Context | Type | Message |")
        md.append("| :--- | :--- | :--- | :--- |")
        for v in report["violations"]:
            md.append(f"| {v['fact']} | {v['context']} | {v['type']} | {v['message']} |")
        md.append("")

    md.append("## Dimensional Structure")
    md.append("```text")
    md.append(tree_text.strip())
    md.append("```")
    md.append("")
    
    md.append("## Context Resolution (Sample)")
    md.append("")
    md.append("| Context ID | Relevant Dimensions (ELR + Explicit Overrides) |")
    md.append("| :--- | :--- |")
    
    # Get a sample of contexts relevant to the facts checked
    elr_dims = filing.dts.get_elr_dimensions(role_uri)
    
    # For now just show the first 10
    for ctx_id in sorted(list(filing.contexts.keys()))[:10]:
        ctx = filing.contexts[ctx_id]
        relevant = ctx.get_relevant_dimensions(filing.dts, elr_dims)
        
        # Format dimensions for table
        dim_lines = []
        for d, m in relevant.items():
            d_short = d.split("}")[-1] if "}" in d else d
            m_short = str(m).split("}")[-1] if "}" in str(m) else str(m)
            dim_lines.append(f"`{d_short}`: `{m_short}`")
        
        if not dim_lines:
            md.append(f"| {ctx_id} | *No relevant dimensions (Total/Default)* |")
        else:
            md.append(f"| {ctx_id} | {'<br>'.join(dim_lines)} |")
        
    md.append("## Hierarchical Fact Report")
    md.append("> This view groups facts by their **Dimensional Identity** and nests them based on the **Context Ontology** (specialization relationships).")
    md.append("")
    
    fact_tree = filing.get_hierarchical_fact_details(role_search)
    
    def _render_fact_node(node, level=0):
        indent = "  " * level
        # Identity Summary
        dim_members = [str(m).split("}")[-1] for m in node['identity'].values()]
        id_str = f"**{', '.join(dim_members)}**" if dim_members else "**Total (ELR Domain Default)**"
        
        md.append(f"{indent}- {id_str}")
        
        # Facts for this node (sorted by concept name)
        sorted_facts = sorted(node['facts'], key=lambda x: x['concept'])
        for f in sorted_facts:
            c_short = f['concept'].split("}")[-1] if "}" in f['concept'] else f['concept']
            
            # Resolve period from context
            ctx = filing.contexts.get(f['context_id'])
            period_str = ""
            if ctx:
                if ctx.period_instant:
                    period_str = f" **[{ctx.period_instant}]**"
                elif ctx.period_start and ctx.period_end:
                    # Show simplified year if possible, or full range
                    start_year = ctx.period_start.split("-")[0]
                    end_year = ctx.period_end.split("-")[0]
                    if start_year == end_year:
                        period_str = f" **[{end_year}]**"
                    else:
                        period_str = f" **[{start_year}-{end_year}]**"

            md.append(f"{indent}  - `{c_short}`: {f['value']}{period_str}")
            
        # Children
        for child in node['children']:
            _render_fact_node(child, level + 1)

    if not fact_tree:
        md.append("*No facts reported for this ELR.*")
    else:
        for root in fact_tree:
            _render_fact_node(root)
    md.append("")
    
    # 4. Dimensional Aggregation Validation
    md.append("## Dimensional Aggregation (XDT Rollup) Validation")
    md.append("> This check verifies that the value reported on a Parent Member (Total) equals the sum of values reported on its immediate Child Members (Segments).")
    md.append("")
    agg_report = filing.validate_dimensional_aggregations(role_search)
    md.append(f"- **Checks Performed**: {agg_report['check_count']}")
    md.append(f"- **Successes**: {agg_report['success_count']}")
    md.append(f"- **Failures**: {agg_report['failed_count']}")
    md.append("")
    
    if agg_report["results"]:
        md.append("| Parent Member | Concept | Period | Reported | Children Sum | Diff | Status |")
        md.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
        for r in sorted(agg_report["results"], key=lambda x: (x['parent_value'], x['concept']), reverse=True):
            p_members = [str(m).split("}")[-1] for m in r['parent_identity'].values()]
            p_id_str = f"**{', '.join(p_members)}**" if p_members else "Total"
            c_short = r['concept'].split("}")[-1] if "}" in r['concept'] else r['concept']
            status_ico = "✅" if r['status'] == "success" else "❌"
            
            # Use period without prefixes
            p_clean = r['period'][2:] if ":" in r['period'] else r['period']
            
            md.append(f"| {p_id_str} | {c_short} | {p_clean} | {r['parent_value']:,.0f} | {r['children_sum']:,.0f} | {r['discrepancy']:,.0f} | {status_ico} |")
        md.append("")

    return "\n".join(md)

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    results_dir = "results"
    os.makedirs(results_dir, exist_ok=True)
    
    # Using Segment Information as the primary use case for Dimensional Aggregation
    role_search = "SegmentInformationandGeographicDataInformationbyReportableSegmentDetails"
    
    # Load the filing
    print(f"Loading {package_path}...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    print(f"Generating hierarchical dimensional report for {role_search}...")
    md_content = generate_markdown_report(filing, role_search)
    
    report_file = "results/dimensional_report.md"
    os.makedirs("results", exist_ok=True)
    with open(report_file, "w") as f:
        f.write(md_content)
    
    print(f"Report saved to {report_file}")

if __name__ == "__main__":
    sys.path.append(os.path.join(os.getcwd(), 'libraries'))
    main()
