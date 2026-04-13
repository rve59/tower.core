# Tutorial: Python Library Development

## From Concept to Component with Poetry

Welcome to the NEXUS Hands-on Lab for Python module development. This document
covers the modern workflow for creating, managing, and distributing reusable
Python libraries, anchored in a real-world case study: **The IFRS Guideline
Parsing Tool**.

---

### Phase 1: Conceptual Foundations

Before writing your first line of code, it's essential to understand that
professional software isn't just about logic—it's about **architecture**. In the
Python ecosystem, how you structure and share your code determines whether your
project will scale or collapse under its own weight.

Every piece of Python software exists at one of three distinct layers.
Understanding these is the first step toward building a "NEXUS-ready" toolset.

#### 1. The Module: Your Atomic Unit

A **Module** is any single `.py` file. It is the basic unit of code
organization.

**IFRS Case Study: The Hierarchy Parser** _Leading Question:_ How do you handle
thousands of pages of hierarchical rules (e.g., IFRS 17, IFRS 9) without your
code becoming a tangled mess of "If-Else" statements?

_The Traditional (Suboptimal) Path:_ It’s tempting to start by putting your
paragraph extraction, rule-tree construction, and cross-reference logic into one
massive 5,000-line `ifrs_extractor.py` file. However, this "megascript" approach
quickly becomes a trap. When you try to update the logic for parsing Appendices,
you might accidentally break the core paragraph parser simply because they are
buried in the same complex module. This lack of isolation turns every minor
update into a high-risk operation.

- **The "NEXUS" Approach:** You create a dedicated `rule_tree.py` module. It has
  one job: represent the hierarchical relationship between Sections, Paragraphs,
  and Sub-paragraphs. It doesn't know _what_ the rules say, only _how_ they are
  structured.
- **The Benefit:** By isolating the structure logic, you can update how
  paragraphs are identified (e.g., changing from regex to a deep-learning model)
  without touching the logic that handles standard-to-standard cross-references.

#### 2. The Package: Your Organizational Unit

A **Package** is a directory that contains one or more modules. To be recognized
by Python, it traditionally contains an `__init__.py` file.

**IFRS Case Study: The Suite of Standards** _Leading Question:_ How do you keep
the specific parsing rules for IFRS 16 (Leases) from clashing with the rules for
IFRS 9 (Financial Instruments) logic?

_The Traditional (Suboptimal) Path:_ In many projects, developers start by
throwing files like `ifrs16_rules.py`, `ifrs9_rules.py`, and a generic
`utils.py` into a single root folder. This lack of structure leads to immediate
friction; you eventually find yourself with multiple versions of a paragraph ID
cleaner, and Python’s import system might shadow the wrong one. You import
`clean_id` from a generic utility script when you actually needed the
IFRS-standardized version that preserves critical "Appendix A" prefixes, leading
to subtle but devastating parsing errors.

- **The "NEXUS" Approach:** You group your logic into a package named
  `ifrs_framework`. Inside, you have sub-packages like
  `ifrs_framework.standards` and `ifrs_framework.parsers`.
- **The Benefit:** Namespacing prevents **name shadowing**. You can have
  `ifrs_framework.ifrs17.parser` and `ifrs_framework.ifrs9.parser` in the same
  project without conflict.

#### 3. The Distribution Package: Your Shippable Product

A **Distribution Package** is a version of your package bundled with
**Metadata** (name, version, author, requirements) into a standard format
extension like a `.whl` (Wheel) file.

**IFRS Case Study: The Taxonomy Engine** _Leading Question:_ How do you ensure
that two different accounting firms are extracting the _exact same_ rule-tree
from the 2026 IFRS Guidelines?

_The Traditional (Suboptimal) Path:_ The most common "quick fix" for sharing
code is to zip up your `ifrs_framework` folder and email it to your colleagues.
This "Zip and Pray" method is notoriously unreliable in a professional setting.
If Firm A runs your code but has an older version of an XML-parsing library on
their machine, your code might produce a slightly different hierarchy because
that specific library handled nested tags differently. Without a formal
distribution, you lose all control over the environment where your code runs.

- **The "NEXUS" Approach:** You create a formal `.whl` file via Poetry. This
  file contains a cryptographic "receipt" (the lockfile) of every library
  version used to build the engine.
- **The Benefit:** Poetry ensures both firms install the _exact_ library
  versions you used during development. The extracted taxonomy is identical,
  verifiable, and audit-ready.

---

### The Core Problem: How to reuse code?

#### IFRS Case Study: The Versioning Nightmare

_Leading Question:_ What happens when your 2025 IFRS parser works perfectly but
crashes the moment you move it to a project handling the 2026 Guidelines?

_Option A: The "Dirty" Way (Hardcoding Paths):_ You might try to link your new
project to your old code using `sys.path.append("/path/to/ifrs_2025_parser")`.
This hardcoded link is a disaster for version-sensitive standards. When you
update a core paragraph extraction rule to accommodate a 2026 change, your older
2025 project also picks up that new rule because they share the same source
files. Suddenly, you can no longer parse historical documents correctly, and
your manual path manipulation has created a maintenance vacuum that swallows
your time.

- **Option B: The "Professional" Way (Poetry-driven Installation):** You install
  your IFRS parser into the environment as a formal library.
- **The "NEXUS" Approach:** You run `poetry add ifrs-parser`. Poetry handles the
  abstraction. Your 2025 project stays on `ifrs-parser==1.0`, while your 2026
  project uses `ifrs-parser==2.0`.
- **The Benefit:** Your projects are isolated. You can maintain multiple
  versions of the IFRS standards simultaneously without ever worrying about one
  "bleeding" into the other.

---

### Why "Dirty" Coding Kills Projects

#### IFRS Case Study: The Cross-Reference Disaster

_Leading Question:_ Why does adding a new "Chapter" parser break the paragraphs
in every other standard in your suite?

1.  **Path Fragility:** Hardcoding paths to local IFRS guideline PDFs like
    `/home/user/documents/ifrs_standards/IFRS17_Final.pdf` is a time bomb. They
    break the moment you share the tool or move the files.
2.  **Namespace Collisions:** If you copy-paste utility files, you eventually
    shadow built-in Python modules. If you name a file `xml.py` (common when
    parsing IFRS guidelines), you'll break the actual Python `xml` library for
    your whole project.
3.  **Circular Dependency Hell:** Without strict boundaries, your
    `HierarchyParser` imports the `paragraphExtractor`, which imports the
    `HierarchyParser`. Poetry and professional packaging detect and prevent this
    "circular logic" before you ever run the code.

**Componentization as the Cure:** Treat each standard's parser as a standalone
"Black Boxes." By building a library (like `ifrs-engine`), you create a single
source of truth for the community.

**The Bridge: Editable Mode (Dev Mode):** Running `poetry install` creates a
**Live Link**. You can tweak a rule in the 2026 guideline parser and see it
reflected **immediately** in your extraction tool without any re-installing.

---

### Phase 2: The Tooling Choice

**IFRS Case Study: Structural Dependency Management** _Leading Question:_ Your
IFRS parser depends on `lxml` for structured XML processing and `spacy` for
linguistic paragraph analysis. How do you stop them from conflicting?

_The Traditional (Suboptimal) Path:_ Relying on a flat `requirements.txt` file
often feels sufficient at first, but it lacks deep resolution. If you install
Spacy and it updates a hidden sub-dependency six months later, that update might
unknowingly break `lxml`. Since your requirement list didn't lock that hidden
sub-dependency, your whole taxonomy engine can crash during a critical audit
because of an update you didn't even know happened. This is the source of "it
worked yesterday" nightmares.

- **The "NEXUS" Approach (Poetry & Deterministic Management):** Poetry generates
  a `poetry.lock` file that records the **exact version and checksum** of every
  single library in your tree.
- **The Benefit:** When any auditor in the world runs `poetry install`, they get
  a byte-for-byte identical environment. This eliminates the "It works on my
  machine" nightmare for standardized financial reporting.

---

### Phase 3: Hands-on Lab: `nexus-core`

#### Step 1: Project Initialization

```bash
poetry new nexus-core --src
```

**IFRS Case Study: Defensive Coding for Standards** _Leading Question:_ Why is
the `src` folder mandatory for a tool that handles official IFRS standards?

- **The Traditional Pitfall:** Putting your code in the root folder makes it too
  easy to accidentally import a local "notes.py" or experiment file that you
  never meant to include in the engine. The `src/` layout creates a physical
  barrier, forcing you to properly "install" the package to use it. If it works
  here, you are 100% sure it will work when deployed to a client's environment.

#### Step 2: Implement a Reusable Component

Create `src/nexus_core/logic.py` and update `src/nexus_core/__init__.py`.

**IFRS Case Study: The Taxonomy API** _Leading Question:_ How do you hide 20,000
rules for parsing IFRS Guidelines behind a single, clean function?

- **The Traditional Pitfall:** High-stakes tools often fail because they force
  users to import deep internal modules like
  `from ifrs.internal.engines.parser_v2.paragraphs import extract_data`. By
  contrast, the "NEXUS" way is to expose key functions in `__init__.py`. The
  user only sees `from nexus_core import get_paragraph`. This allows you to
  refactor your internal engines without ever breaking the auditor’s tools.

---

### Phase 4: Sharing & Distribution

#### Step 5: Packaging for Distribution

```bash
poetry build
```

**IFRS Case Study: The Trusted Taxonomy Engine** _Leading Question:_ Why is a
"Wheel" file the only acceptable way to ship an IFRS Guideline parser to a
global firm?

- **The Benefit:** The Wheel is a standardized, "Frozen" version of your code.
  It is guaranteed to be consistent across every machine, ensuring that every
  financial audit performed with your tool uses the _exact_ same extraction
  logic, regardless of location.

---

### Key Takeaways

- **`pyproject.toml`** is the single source of truth for your IFRS engine.
- **`poetry.lock`** is your guarantee that every audit is performed in an
  identical environment.
- **Editable Mode** bridges the gap between prototyping your parser and
  deploying a professional taxonomy engine.
- **Componentization** turns separate guideline parsers into a unified, reusable
  NEXUS of professional tools.

---

## THE IFRS GUIDELINES PARSER: Hands-on Lab

As a curriculum designer, I have structured this final phase to bridge the gap
between architectural theory and mission-critical execution. In this lab, you
will build a functional **IFRS Guideline Parser** that uses OCR to transform
hierarchical rules from a specific PDF (`ifrs-16-leases.pdf`) into a modular
Python engine.

### Prerequisites: OS-Level Infrastructure

Before we can use Python to parse page images, we need the underlying "engines"
of OCR and PDF processing. Ensure these are installed on your Linux system:

```bash
# Install Tesseract OCR and Poppler (for PDF-to-image conversion)
sudo apt update
sudo apt install tesseract-ocr poppler-utils
```

---

### Step 1: Project Initialization (Architecture Step)

**Exercise 1**: High-fidelity projects like a IFRS Parser must be "isolated"
from your local machine's clutter to be audit-ready. Referring back to **Phase 3
(Initialization)**, how do we initialize our parser to ensure it following the
"Defensive Coding" industry standard?

- **Task**: Create the project directory and initialize it with Poetry using the
  mandatory `src` layout.
- **Target Path**:
  `/home/raynier/Development/workspaces/fullstack/vibes/00_NEXUS/tools.core/tutorials/ifrs_guidelines_parser.core`

> [!TIP] **Professional Answer**: Use
> `poetry new ifrs_guidelines_parser.core --src`.
>
> **Rationale**: The `--src` flag creates a physical barrier. You are forced to
> "install" the package to use it. If your tests pass in this layout, you are
> 100% sure it will work when deployed to a client's machine.

---

### Step 2: Dependency Management (Isolation Step)

**Exercise 2**: An OCR engine relies on "heavy" libraries like `pytesseract` and
`pdf2image`. Referring to **Phase 2 (Tooling)**, how do we add these
dependencies to our project to ensure that when an auditor installs our tool six
months from now, they get the exact same environment?

- **Task**: Add `pytesseract`, `pdf2image`, and `Pillow` (for image processing).
- **Action**: `poetry add pytesseract pdf2image pillow`

> [!TIP] **Professional Answer**: After running `poetry add`, verify the
> creation of the `poetry.lock` file.
>
> **Rationale**: The lockfile records the exact version and cryptographic
> checksum of every library in your entire dependency tree. This prevents
> "Dependency Hell" and ensures your taxonomy engine produces identical
> financial reports on every office machine.

---

### Step 3: Implement the OCR Engine (Atomic Units)

**Exercise 3**: Professional system design is about **separating concerns**.
Referring to **Phase 1 (Modules)**, why should the "PDF-to-Image" logic be a
separate atomic module from the "IFRS Parsing" logic?

- **Task**: Create `src/ifrs_core/ocr_engine.py` and implement a function to
  convert a PDF page to a hierarchical text json object.

> [!TIP] **Professional Answer**:
>
> ```python
> from pdf2image import convert_from_path
>
> def parse_image_blocks(page) -> list:
>     """Atomic Unit: Addresses manual block parsing of the image into structural text components."""
>     # Note: OCR-specific library logic (e.g., Tesseract) will be introduced in a later phase.
>     blocks = []
>
>     # For now, we simulate the hierarchical block extraction logic.
>     blocks.append({
>         "block_num": 1,
>         "paragraphs": ["Manual block parsing logic will be finalized here."]
>     })
>     return blocks
>
> def extract_hierarchical_text(pdf_path: str) -> dict:
>     """OCR returns a hierarchical JSON-ready object with layout blocks."""
>     pages = convert_from_path(pdf_path)
>     results = {"metadata": {"source": pdf_path, "total_pages": len(pages)}, "pages": []}
>
>     for i, page in enumerate(pages):
>         page_obj = {
>             "page_number": i + 1,
>             "blocks": parse_image_blocks(page)
>         }
>         results["pages"].append(page_obj)
>     return results
> ```
>
> **Rationale**: High-stakes standards like IFRS Guidelines rely on hierarchical
> positioning (e.g., distinguishing a header from a paragraph). By starting with
> a structured JSON framework, we ensure that as we introduce the final OCR
> engine, our data model is already robust and audit-ready.

---

### Step 4: Hierarchical Rule Extraction (Packages & Namespacing)

**Exercise 4**: IFRS Guideline documents are highly structured (paragraphs
17.A.b, etc.). How do we use **Namespacing (Phase 1, Section 2)** to keep our
"Lease-specific" rules organized as our tool grows to handle hundreds of
different standards?

- **Task**: Create a sub-package structure: `src/ifrs_core/standards/ifrs16.py`.

> [!TIP] **Professional Answer**: Use a sub-package (`standards.ifrs16`) to
> contain the specific regex/logic for IFRS 16: Leases.
>
> **Rationale**: This prevents "Spaghetti Code." You can have an `ifrs16.parser`
> and an `ifrs9.parser` in the same project without conflict. This hierarchical
> organization mirrors the hierarchy of the Standards themselves.

---

### Step 5: IFRS Guideline Block Parser Design

**Exercise 5**: Look at the hierarchical structure of the exact block types
within our standards: **Document, Section, Paragraph, and lettered
sub-paragraph**. Based on your analysis of `ifrs-16-leases.pdf`, how could we
define the logical structure of a page image and represent it as a JSON outline
that follows this specific legal taxonomy?

- **Task**: Define the JSON schema for our guideline parser using this document
  hierarchy and specify the key metadata required for professional auditing.

> [!TIP] **Professional Answer**: We will use a hierarchical outline that
> follows a strict parent-child data model (**Document 1:n Sections**, **Section
> 1:n Paragraphs**, **Paragraph 1:n Sub-Paragraphs**):
>
> 1. **Document Level**: (e.g., IFRS 16: Leases, metadata, year, version)
> 2. **Section Level**: (Major headings, e.g., "Measurement" or "Scope")
> 3. **Paragraph Level**: (Numbered rules, e.g., "Paragraph 26")
> 4. **Sub-Paragraph Level**: (Lettered/Numbered lists, e.g., clause "(a)")
>
> **Rationale**: This "Document-to-Sub-paragraph" mapping ensures that a
> financial auditor can precisely trace a single line of machine-extracted text
> back to a specific legal clause in the official IFRS standard.

- **Follow-up Inquiry**: Why do we recognize these different block components
  and give them unique names?

> [!TIP] **Professional Answer**: We anticipate building a specialized **Block
> Parser** for each specific image block type. Each dedicated parser will look
> at its assigned image region, interpret what it "sees" based on its specific
> rules (e.g., a Section Heading vs. a Paragraph index), and proceed
> accordingly—even calling other block parsers recursively as it navigates the
> 1:n hierarchy.

- **Follow-up Inquiry**: How would you organize the code to hierarchically
  descend the block regions of the PDF page image?

> [!TIP] **Professional Answer**: We will implement a specialized **Recursive
> Descent Parser**. The top-level `DocumentParser` identifies the standard's
> metadata, then calls a `SectionParser` for each detected section. The
> `SectionParser` then "descends" to identify and call the `ParagraphParser`,
> which in turn handles its own sub-clauses. This modular, hierarchical approach
> ensures our code perfectly mirrors the official structure of the Guidelines.

- **Architectural Remark**: We have seen that the Guideline is a very structured
  hierarchical document and we can make use of that. Basically, the block parser
  of every image block is structurally the same.

- **Follow-up Inquiry**: What do you think would be a good outline for each of
  these specific block parsers?

> [!TIP] **Professional Answer**: Each parser follows an **Iterative
> Segmentation** pattern—identifying sub-components, segmenting them as new
> images, and delegating the work to the next level down the hierarchy:
>
> ```python
> def page_img_block_parser(page_image) -> dict:
>     """Atomic Unit: Handles page-level metadata and delegates to Section Parsers."""
>     # 1. Handle the page-specific titles and text (Identify)
>     page_json = {
>         "metadata": extract_page_metadata(page_image),
>         "sections": []
>     }
>
>     # 2. Proceed with processing any optional paragraphs (Segment)
>     # (These are paragraphs that exist before the first section heading)
>     page_json["optional_paragraphs"] = extract_page_paragraphs(page_image)
>
>     # 3. In the page, determine the 'section' sub-image regions
>     section_sub_images = segment_sections(page_image)
>     if not section_sub_images:
>         return page_json # Still return metadata even if no sections exist
>
>     # 4. For each section sub-image, call its specialized parser (Delegate)
>     for sect_img in section_sub_images:
>         section_data = section_img_block_parser(sect_img)
>         page_json["sections"].append(section_data)
>
>     return page_json
> ```

- **The Recursive Hierarchy Pattern**: This pattern is not unique to the page
  level; it repeats itself symmetrically through every tier of the IFRS
  Guideline document. Whether you are parsing a whole **Document**, a
  **Section**, or a single **Paragraph**, the "NEXUS-standard" approach follows
  these three repeatable steps:

1.  **Extract Specific Blocks**: Isolate the image regions required to support
    the processing of the current block type (e.g., a Section identifying its
    own internal Paragraph boundaries).
2.  **Process Internal Structure**: Analyze the current block's layout to
    extract its specific information (e.g., the Section Title or Paragraph
    Index).
3.  **Identify Lower Hierarchies**: Look for any nested block types within the
    current level (e.g., a Paragraph searching for its lettered sub-paragraphs).

**Outline Processing Rationale**: By standardizing every layer of the parser
around these three steps, we create a modular engine that mirrors the legal
taxonomy of the standards. Each parser focuses exclusively on its own
hierarchical level and then delegates the remaining complexity to the levels
below. This ensures that a single change to how "Sections" are identified never
breaks the logic for how "Sub-paragraphs" are parsed.

- **Follow-up Inquiry**: Now that we understand the recursive pattern, what do
  you think we can do next to physically isolate these blocks as separate image
  regions?

> [!TIP] **Professional Answer**: We can analyze the **exact captured images**
> for the hierarchy blocks and identify the visual signatures we can use to
> extract them from their "container block image." By looking for consistent
> patterns in the raw pixels, we define the physical rules of the extraction
> engine.

- **Inquiry (Visual Signature)**: What are the specific visual characteristics
  of a **Section**, a **Paragraph**, and a **Lettered Sub-paragraph**? Think in
  terms of horizontal lines, font sizes, line separators, and specific start/end
  pixel columns.

  ![Annotated IFRS-16 Section Hierarchy](/home/raynier/Development/workspaces/fullstack/vibes/00_NEXUS/tools.core/tutorials/ifrs_guidelines_parser.core/sources/annotated_section_ifrs_16_1.png)

So now the logic will be as follows:

**extract the text area**: scan the entire page image and find the header blank
area, the footer blank area and the left and right empty margin blank areas.
This will give us the "text area" of the page. Extract the text area as a new
text-area-image.

I alway like to proceed level by level and 'annotate' th epage image with
outlines of the various block types. This way we can track the descend into the
structure of the page block parsing logic.

So lets stop here and annotated the page image with the text area outline first.

> [!TIP] **Professional Answer**:
> ```python
> from PIL import Image, ImageDraw, ImageOps
>
> def annotate_text_area(image_path: str, output_path: str) -> dict:
>     """Atomic Unit: Roots the parsing logic by finding the core text-area margins."""
>     img = Image.open(image_path).convert("RGB")
>     
>     # 1. 'Identify' the text area boundaries using inversion (highlights text pixels)
>     gray = img.convert('L')
>     inverted = ImageOps.invert(gray)
>     left, top, right, bottom = inverted.getbbox()
>     
>     # 2. 'Annotate' the image with a RED outline to track our descent
>     draw = ImageDraw.Draw(img)
>     draw.rectangle([left, top, right, bottom], outline="red", width=8)
>     img.save(output_path)
>     
>     # 3. Return the dimensions for use by the Section-level parsers
>     return {"x0": left, "y0": top, "x1": right, "y1": bottom}
> ```

**extract the page sections**: take the text-area-image find pixel lines that
are all white pixels. Collect the pixel lines in ranges of consecutive white and
non-white blocks. These will be the section separators and the section blocks.

As you can see from the attached image section separators are higher (more
consecutive blank lines) than the paragraph line-separators. This is a heuristic
to determine for every document.

### Step 6: The API Surface (API Stability)

**Exercise 6**: How do we hide 20,000 internal lines of OCR and hierarchy logic
behind a single, user-friendly "Auditor Button"? Referring to **Phase 3 (Lab
Step 2)**, what file do we update to provide this stable interface?

- **Task**: Update `src/ifrs_core/__init__.py`.

> [!TIP] **Professional Answer**:
>
> ```python
> from .ocr_engine import extract_text_from_pdf
> from .standards.ifrs16 import parse_leases
>
> __all__ = ["extract_text_from_pdf", "parse_leases"]
> ```
>
> **Rationale**: This is the "API Surface." By exposing your key functions here,
> the user only sees `from ifrs_core import parse_leases`. You can rename your
> internal modules or refactor your engines without ever breaking the user's
> code.

---

### Step 7: Final Verification: The Live Loop

**Exercise 7**: You've built the engine. Now, referring to **The Bridge:
Editable Mode**, how do we "proof-run" this and verify that our IFRS-16 tool is
working correctly?

- **Action**:
  1. Place `ifrs-16-leases.pdf` in the `sources/` directory.
  2. Run `poetry install` to create the Live Link.
  3. Create a test script to import `ifrs_core` and parse the PDF.

**Design Rationale**: In this lab, we have transitioned from a single "Dirty"
script to a professional, modular **Taxonomy Engine**. You fix a rule in your
source folder, and it is immediately live in your extraction tool—isolated,
auditable, and ready for distribution.
