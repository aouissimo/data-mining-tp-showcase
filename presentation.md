<!--
AI PROMPT: Please transform the following Markdown content into a professional, visually stunning presentation.
Use a modern, clean design with emphasis on data-driven insights.
Maintain the structure of one slide per '---' separator.
Use the technical report as the main reference, while keeping clear references to the program used and the implementation code.
-->

# Interactive ID3 Dashboard
## Implementing Knowledge Discovery and Interactive Visualization for Supervised Classification
**Project Verification: Complete - Data Mining Research 2026**

---

# Introduction
### Bridging Raw Data and Interpretable Machine Learning
* This project presents a robust implementation of the **ID3 (Iterative Dichotomiser 3)** algorithm inside an interactive dashboard.
* As part of the **Knowledge Discovery in Databases (KDD)** process, the application transforms raw records into transparent decision trees.
* **Key focus areas:**
  * Algorithmic integrity
  * Data preprocessing
  * Visual clarity
* **Outcome:** A working tool that combines theory, code, and visualization.

---

# Recursive Methodology
### Information Gain and Shannon Entropy
* The ID3 algorithm recursively partitions the dataset using **Information Gain**.
* At each step, the attribute that reduces uncertainty the most becomes the splitting node.
* **Core Formula:**
  * `Entropy(S) = - sum( p_i * log2(p_i) )`
* **Weather Case Study:**
  * The base entropy is calculated from 14 `Play = Yes/No` records.
  * `Outlook`, `Temperature`, `Humidity`, and `Wind` are evaluated.
  * `Outlook` gives the highest information gain and becomes the root.
  * For `Outlook = Overcast`, entropy becomes 0, so the result is immediately `Yes`.

---

# Technical Stack
### Program Used in the Project
* **Real-time Engine:**
  * **Vite** for development and build speed
  * **React** for the interactive user interface
  * **TypeScript** for type-safe application logic
* **Visualization Layer:**
  * **React Flow** for graph rendering
  * **D3 Hierarchy** for tree layout
  * **Framer Motion** for interface polish
* **Why this matters:** The stack supports live interaction, clean code organization, and visual explanation of the model.

---

# Implementation in Code
### How the Application Is Organized
* **`src/App.tsx`:** Manages dataset selection, preprocessing controls, tabs, and model training.
* **`src/utils/preprocessing.ts`:** Implements missing-value handling, normalization, and discretization.
* **`src/utils/id3-core.ts`:** Contains entropy, information gain, recursive tree generation, and prediction logic.
* **`src/components/TreeVisualizer.tsx`:** Renders the generated decision tree as an interactive graph.
* **Result:** The code structure mirrors the KDD stages described in the technical report.

---

# Dataset Analysis
### Validation Dataset and Real-World Sample
* **Weather (Play Tennis):**
  * A classic 14-record dataset used to validate classification logic.
  * Includes 4 categorical attributes and 1 binary target.
* **Titanic Survival:**
  * A sample of passenger data with missing values and continuous `Age` data.
  * Requires preprocessing before decision-tree mining.
* **Transformation Insight:** The system applies equal-width discretization so numeric age values can be used by ID3.

---

# Preprocessing Pipeline
### Cleaning and Preparing the Data
* **Missing Value Handling:** Null or empty fields are detected and filled using mode imputation.
* **Normalization:** Numeric columns can be scaled to keep values comparable.
* **Discretization:** Continuous values like `Age` are converted into categorical bins.
* **Audit Trail:** The application logs each preprocessing action so the workflow can be explained clearly.

---

# Visualization Gallery
### From Model Output to Visual Explanation
* **Weather Tree:** `Outlook` appears as the root and branches into `Humidity` and `Wind`.
* **Titanic Tree:** Attributes such as `Sex` show a strong relationship with survival outcomes.
* **Preprocessing Log:** The interface records cleaning and discretization steps as an audit trail.
* **Presentation Value:** The visual layer makes the algorithm easier to understand than raw tables alone.

---

# Project Conclusion
### From Technical Report to Presentation
* The **ID3 Visual Explorer** bridges the gap between raw data and interpretable machine learning.
* It combines a recursive algorithm, preprocessing utilities, and interactive graphics in one dashboard.
* The presentation now follows the structure of **`report.html`** while also explaining the program used and the implementation code.
