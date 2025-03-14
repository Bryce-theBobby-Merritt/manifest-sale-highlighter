1. Executive Summary & Purpose
Purpose:
This document defines the requirements for a web-based tool that allows users to upload two files (an Excel file with item and sale information, and a PDF manifest), identify which items from the manifest are on sale, and output a highlighted list of those sale items. The aim is to streamline and automate a process that previously required manual comparison between data sources.

Objectives:

Enable quick and accurate identification of sale items that are in an upcoming shipment (manifest).
Provide a user-friendly web interface for uploading files and generating a highlighted report.
Enhance operational efficiency by reducing manual checks and errors.
2. Stakeholder & User Analysis
2.1 RACI Matrix
Stakeholder	Role	RACI	Responsibilities
Product Manager (You)	Oversees product vision	A (Accountable)	Final decision-maker; ensures product meets business goals.
Project Manager	Delivery & scheduling	R (Responsible)	Manages project plan, timelines, and resource allocation.
Technical Lead	Tech architecture	C (Consulted)	Provides input on feasibility, architecture, and constraints.
UX/UI Designer	User interface design	C (Consulted)	Designs front-end interface & user journey.
QA Engineer	Quality assurance	C (Consulted)	Tests product functionality & ensures defect-free release.
Operations/Logistics	End-user & domain expert	I (Informed)	Provides feedback on usability & operational constraints.
Executive Sponsor	Funding & strategic view	I (Informed)	Monitors alignment with broader organizational goals.
Key:

R (Responsible): Does the work to achieve the task.
A (Accountable): Ultimately answerable for the task’s success.
C (Consulted): Provides input or advice.
I (Informed): Kept up-to-date on progress or decisions.
2.2 User Personas
Logistics Coordinator (Primary User)

Goals:
Quickly identify which items on an incoming shipment are on sale.
Minimize manual data comparison to save time.
Pain Points:
Current process requires opening two files side by side.
Risk of human error in manual comparisons.
Technical Comfort:
Moderate; familiar with Excel and basic web tools.
Merchandise Manager (Secondary User)

Goals:
Verify that correct sale items are being shipped and flagged correctly in the system.
Pain Points:
Inefficiency when sale items are incorrectly flagged or missed.
Difficulty ensuring data consistency across different sources (Excel vs. manifest).
Technical Comfort:
Moderate to high; uses multiple retail systems and reporting dashboards.
IT Administrator (Internal Stakeholder)

Goals:
Ensure system reliability, security of uploaded data, and seamless integration with existing infrastructure.
Pain Points:
Any system disruptions or data integrity issues create downstream operational challenges.
Technical Comfort:
High; proficient in database management, web application deployment, and IT security.
3. Value Proposition & Differentiation (Value Proposition Canvas)
Customer Segment (Users & Their Needs)
Jobs to be Done: Quickly upload files, compare data, and see which items are on sale.
Pains: Manual data entry, high error rate, time-consuming double-checking.
Gains: Seamless, automated highlighting of sale items on manifest.
Product Offering (Features & Benefits)
Pain Relievers:
Automated highlight generation.
Single interface for file upload (Excel and PDF).
Gain Creators:
Time saved by removing manual checks.
Reduced risk of overlooking sale items.
Unique Selling Points (USPs):

Automated Workflow: Reduces manual workload by offering quick, one-click identification of sale items.
Integrated Web-Based Solution: No need for multiple software tools; everything is done via a secure website.
Clear Visualization: Highlighted output makes it instantly clear which items are on sale.
4. Business Model & Market Context
4.1 Business Model Canvas
Key Partners	Key Activities	Key Resources	Value Propositions
- External software vendors (if needed for PDF parsing).
- Cloud hosting providers.	- Develop web-based file upload & comparison tool.
- Provide ongoing maintenance & support.	- Development team (front-end, back-end)
- Cloud infrastructure for hosting
- Technical libraries for PDF & Excel parsing	- Automates sale item identification
- Saves time & reduces error in logistics processes
- Streamlined user experience
Customer Relationships	Channels	Customer Segments	Cost Structure
- Support/training for initial rollout.
- Ongoing customer feedback loops.	- Web-based platform accessible via standard browsers.
- Potential integration with existing enterprise systems (optional).	- Retailers dealing with large volumes of shipment items.
- Logistics teams needing quick data reconciliation.	- Development & maintenance costs
- Hosting & infrastructure
- Support & training
- Potential licensing fees for libraries used
Revenue Streams			(Optional) Could be subscription-based for advanced features in the future, or internal cost savings if used in-house.
4.2 Competitive Landscape (Porter’s Five Forces)
Threat of New Entrants: Moderate. While creating a web tool is not highly capital-intensive, specialized knowledge of Excel and PDF parsing is required.
Bargaining Power of Suppliers: Low. Standard cloud hosting and parsing libraries are widely available.
Bargaining Power of Buyers: Moderate. If companies don’t see value or can do this manually, they may opt out.
Threat of Substitutes: High. Users could do manual checks or use generic data-comparison tools in Excel.
Competitive Rivalry: Low–Moderate. There are data-comparison tools, but few specialized for “manifest plus sale price detection.”
5. Requirements Gathering & Prioritization (MoSCoW)
5.1 Functional Requirements
File Upload
The system must allow users to upload an Excel (.xlsx) file containing:
A column named “Article No.”
A column named “US Sale” (which, if not empty, represents the sale price).
The system must allow users to upload a PDF manifest file containing item numbers that match the “Article No.”
Data Extraction and Matching
The system must parse the Excel to identify sale vs. non-sale items.
The system must parse the PDF to extract item numbers.
The system must match these item numbers against the Excel list to determine which items are both on sale and on the manifest.
Highlighting & Output
The system should provide a highlighted list (visual display) of items that are on sale and on the manifest.
The system should allow users to download or view a report that contains these highlighted items.
User Interface & Experience
The solution should present a clean web interface for file uploads and output.
The interface should display clear success/failure messages (e.g., “File upload successful” or “Parsing error”).
Security & Permissions
The system must securely handle file uploads and ensure data is not exposed to unauthorized users.
Performance & Scalability
The system should handle typical manifest sizes (hundreds to thousands of line items) without significant lag.
5.2 MoSCoW Prioritization
Requirement	Priority
Must	
1. Ability to upload .xlsx and PDF files	Must
2. Extraction of “Article No.” from both files	Must
3. Identify sale items based on “US Sale” column	Must
4. Match sale items with those in the PDF manifest	Must
5. Highlight matching sale items in output	Must
Should	
6. Downloadable highlighted report (e.g., PDF/Excel)	Should
7. User notifications upon completion of processing	Should
Could	
8. User account system with saved uploads	Could
9. Integrations with inventory management systems (API-based)	Could
Won’t (Not in this scope)	
10. Real-time collaboration between multiple users	Won’t
11. Advanced analytics or forecasting features	Won’t
6. Risk & Assumption Analysis
6.1 Mini-SWOT
Strengths	Weaknesses
- Clear, tangible use case for immediate time-savings.
- Simple, intuitive workflow that matches users’ mental model.	- Limited advanced features (e.g., integration with external systems).
- Reliance on correct formatting of Excel/PDF.
Opportunities	Threats
-------------------------------------------------------	------------------------------------------------------------
- Potential to expand into broader inventory management comparisons.
- Could add real-time data extraction from suppliers’ systems.	- Competitive data comparison tools already exist.
- Manual process might suffice for smaller companies, limiting adoption.
6.2 Risk Register
Risk	Probability	Impact	Mitigation
1. File Parsing Failure (Excel/PDF)	Medium	High	- Validate file formats on upload.
- Provide clear error messages.
2. Incorrect Matching Due to Data Inconsistency	High	High	- Enforce data format standards.
- Consider partial string matches if feasible.
3. Security Breach of Uploaded Data	Low	High	- Implement secure file storage/encryption.
- Access control & authentication.
4. Scalability for Large Files	Medium	Medium	- Use efficient data parsing libraries.
- Set file size limits & performance testing.
7. Success Metrics & KPIs
Metric	Description	Target
User Adoption Rate	% of total target users who actively use the system	80% adoption within first 3 months
Average Processing Time	Time taken from file upload to highlighted output	Under 2 minutes for 1,000 items
Error Rate (Data Mismatches)	% of incorrectly flagged items (false positives/negatives)	< 2% of total matched items
User Satisfaction (NPS)	Net Promoter Score or equivalent post-use feedback	NPS of +30 or higher
Cost Savings (if internal)	Reduction in manual labor hours and data errors	25% reduction in labor hours
Linking Requirements to KPIs:

Accurate matching (Requirements #2 and #3) directly influences Error Rate.
Efficient file parsing (Requirement #5: Performance & Scalability) impacts Processing Time.
A simple web UI (Requirement #4) drives User Adoption and User Satisfaction.
8. Next Steps & Proposed Timeline
High-Level Milestones
Requirement Validation & Technical Feasibility (1–2 weeks)

Validate final scope with key stakeholders.
Confirm technical approach (libraries, hosting, security).
Design Phase (2–3 weeks)

UX/UI wireframes and mockups.
Architecture design, system flow diagrams.
Security & compliance checks.
Development Phase (4–6 weeks)

Front-end implementation (file upload interface, progress indicators).
Back-end implementation (Excel & PDF parsing, matching logic).
Testing environment setup.
Quality Assurance & UAT (2–3 weeks)

Comprehensive testing (functional, performance, security).
User Acceptance Testing with a pilot group of Logistics Coordinators.
Deployment & Training (1–2 weeks)

Roll out to production environment.
Conduct user training sessions.
Gather initial feedback.
Post-Launch Monitoring & Optimization (Ongoing)

Monitor KPIs (user adoption, error rate).
Implement continuous improvements.
Known Dependencies/Constraints
Access to reliable parsing libraries for Excel (.xlsx) and PDF.
Availability of IT resources for setting up hosting and security.
User acceptance training schedules.
