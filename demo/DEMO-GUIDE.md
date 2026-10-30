# Careerly - two classroom demo sets

Generated for 2026-10-27. All people, colleges, companies, achievements, events and vacancies below are fictional. Links use example.com as demonstration placeholders, not real applications or learning resources.

## Load and sign in

In the configured project folder, run `npm.cmd run demo:seed`. Start Careerly with `npm.cmd run dev` and refresh. The seed command adds only labelled demo fixtures; it does not replace real accounts or records. Re-running refreshes demo deadlines relative to the current date.

Use your existing admin login for admin navigation. The two new accounts are students only. Student password for both: **CareerlyDemo2026!** (fictional local demo accounts only). Sign out before changing accounts.

Run **npm.cmd run demo:clear** to remove the demo accounts and fixtures after the presentation. Keep demo accounts out of a public deployment.

## What is automatic

Dashboard statistics, Admin Overview, Student directory, Career Insights and Notifications are calculated from saved records. You do not type their statistics manually. Student directory entries require profile sharing; both fictional students explicitly share their profiles. Notifications come from upcoming application deadlines, interview dates and shared announcements.

The AI reads current published, unexpired opportunities each time matching is requested. This is an admin-entered demo database, not a live jobs API, continuous background monitor or application-submission service. Matching is guidance, not a hiring guarantee. There are six open demo listings, one draft, one closed listing and one expired published listing.

You can enter the values manually using this guide, or use the seed command. JSON exports contain all sample values; DEMO-JOBS.csv contains the shared opportunity records.

## Set A - Frontend developer

Student login: **aarav.demo@example.test**. Password: **CareerlyDemo2026!**.

### Profile (avatar / Edit profile)

| Field | Sample value |
|---|---|
| Full name / name | Aarav Shah (Demo) |
| College | Demo Institute of Technology (fictional) |
| Degree | B.Tech Computer Engineering |
| Graduation year | 2027 |
| Career goal / target role | Frontend developer internship |
| Skills | JavaScript, React, HTML, CSS, SQL |
| Share profile with placement admin | true |

### Dashboard

This set contributes 3 tracked applications, 1 application at Interview status, 1 resume with 2 saved versions, 3 coding problems and a 100% completed sample profile. It has 2 projects and 4 skill records. The figures are for each demo student's account; shared admin totals may also include your existing data.

### Applications

**Record 1**

| Field | Sample value |
|---|---|
| Company | Demo - PixelPath Labs |
| Role | React Frontend Intern |
| Link (demo placeholder) | https://example.com/?careerly-demo=react-intern |
| Date | 2026-10-24 |
| Deadline | 2026-11-17 |
| Status / preparation | Interview |
| Next interview | 2026-10-29T10:30 |
| Notes / suggested approach | SIMULATION: prepare a walkthrough of the task-board project. |

**Record 2**

| Field | Sample value |
|---|---|
| Company | Demo - CloudNest Systems |
| Role | Junior Web Developer |
| Link (demo placeholder) | https://example.com/?careerly-demo=web-developer |
| Date | 2026-10-25 |
| Deadline | 2026-11-26 |
| Status / preparation | Applied |
| Notes / suggested approach | SIMULATION: tailor the resume to REST APIs and Git. |

**Record 3**

| Field | Sample value |
|---|---|
| Company | Demo - PixelPath Labs |
| Role | UI Developer Assistant |
| Link (demo placeholder) | https://example.com/?careerly-demo=ui-assistant |
| Date | 2026-10-27 |
| Deadline | 2026-11-10 |
| Status / preparation | Saved |
| Notes / suggested approach | SIMULATION: check the responsive-layout requirements. |


### Opportunities

The student feed shows all six open published demo listings across both sets. React Frontend Intern, Junior Web Developer and UI Developer Assistant are the expected discussion candidates for this profile; the AI explains relevance and gaps. Draft, closed and expired records are excluded from AI matching. Select **Save to tracker** to review an application form. Links are demo placeholders.

### Resume Manager

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Aarav Frontend Resume |
| Full name / name | Aarav Shah (Demo) |
| Email | aarav.demo@example.test |
| Career goal / target role | Frontend developer internship |
| Professional summary | Fictional computer engineering student practising React, JavaScript and SQL through academic projects. |
| Education | Demo Institute of Technology (fictional) \| B.Tech Computer Engineering \| Expected graduation 2027 |
| Experience and achievements | Demo academic teamwork: contributed task components, form validation and SQL summary queries. No professional employment is claimed. |
| Skills | JavaScript, React, HTML, CSS, SQL, Git |
| Projects | Campus Task Board - React task creation, editing and filtering. Student Expense Tracker - categorized expenses and SQL summaries. |


The seeded resume has two dated versions. Open **Preview & export PDF**, switch versions, then use **Print / Save PDF**. To demonstrate AI drafting, choose the resume task and review the draft in the editor before saving.

### My Projects

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Campus Task Board |
| Description | Fictional academic project: a React task board with create, edit, status filters and local persistence. The demo student implemented the task components and form validation. |
| Technology stack | React, JavaScript, CSS |
| GitHub URL | Leave blank |
| Link (demo placeholder) | https://example.com/?careerly-demo=task-board |
| Date | 2026-09-27 |

**Record 2**

| Field | Sample value |
|---|---|
| Title | Demo - Student Expense Tracker |
| Description | Fictional academic project: categorized expenses, monthly summaries and SQL-backed records. The demo student designed the expense table and summary queries. |
| Technology stack | JavaScript, SQL, HTML, CSS |
| GitHub URL | Leave blank |
| Link (demo placeholder) | https://example.com/?careerly-demo=expense-tracker |
| Date | 2026-10-13 |


### Skill Tracker

**Record 1**

| Field | Sample value |
|---|---|
| Full name / name | React |
| Current proficiency (%) | 70 |
| Target proficiency (%) | 85 |

**Record 2**

| Field | Sample value |
|---|---|
| Full name / name | JavaScript |
| Current proficiency (%) | 75 |
| Target proficiency (%) | 90 |

**Record 3**

| Field | Sample value |
|---|---|
| Full name / name | SQL |
| Current proficiency (%) | 45 |
| Target proficiency (%) | 75 |

**Record 4**

| Field | Sample value |
|---|---|
| Full name / name | Git |
| Current proficiency (%) | 55 |
| Target proficiency (%) | 80 |


### Coding Tracker

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Two Sum |
| Platform | Classroom practice |
| Difficulty | Easy |
| Topic | Arrays and hash maps |
| Date | 2026-10-24 |
| Link (demo placeholder) | https://example.com/?careerly-demo=two-sum |

**Record 2**

| Field | Sample value |
|---|---|
| Title | Demo - Valid Parentheses |
| Platform | Classroom practice |
| Difficulty | Easy |
| Topic | Stacks |
| Date | 2026-10-25 |
| Link (demo placeholder) | https://example.com/?careerly-demo=parentheses |

**Record 3**

| Field | Sample value |
|---|---|
| Title | Demo - Longest Unique Substring |
| Platform | Classroom practice |
| Difficulty | Medium |
| Topic | Sliding window |
| Date | 2026-10-26 |
| Link (demo placeholder) | https://example.com/?careerly-demo=substring |


### Interview Prep

**Record 1**

| Field | Sample value |
|---|---|
| Question | Explain React props and state. |
| Category | Technical |
| Status / preparation | Confident |
| Notes / suggested approach | Props are passed to a component. State stores values that the component updates. |

**Record 2**

| Field | Sample value |
|---|---|
| Question | Describe a bug you debugged in your project. |
| Category | Behavioral |
| Status / preparation | Practicing |
| Notes / suggested approach | SIMULATION: a stale filter value caused task results to lag; updated the state flow and checked the filter cases. |

**Record 3**

| Field | Sample value |
|---|---|
| Question | Tell me about yourself. |
| Category | HR |
| Status / preparation | Practicing |
| Notes / suggested approach | I am a fictional engineering student interested in frontend internships. My sample portfolio includes a task board and expense tracker. |


### Career Insights

Career goal: **Frontend developer internship**. The lowest saved proficiency is SQL (45%), giving you a concrete learning discussion. Try the job-description keyword checker using the requirements of a published demo role. The keyword check is a simple text comparison, not an ATS or hiring score.

**AI Coach prompts to paste:**

- Match my React and JavaScript skills to the published demo internships. Explain skill gaps.
- Suggest two portfolio projects that strengthen my SQL skills.
- Draft a resume using only my saved academic projects. Do not invent employment.

### Notifications

Show the three upcoming application deadlines, the scheduled interview in the Interview application, and both shared announcements. Dates are refreshed by demo:seed. Email reminders are not connected.

### Admin Overview

Sign out and use your existing admin credentials. Across both demo sets, the fixtures add 2 shared student profiles, 4 companies, 9 opportunity records, 6 practice questions, 4 learning resources and 2 announcements. Of the opportunity records, 6 are open and published. The existing Published roles metric counts all Published statuses, including the expired demo record; the student feed also checks deadlines.

### Students

This set appears as **Aarav Shah (Demo)**, with the college, degree, year and goal above because profile sharing is enabled. Turn sharing off on the student profile and refresh the admin list to demonstrate consent.

### Companies

**Record 1**

| Field | Sample value |
|---|---|
| Full name / name | Demo - PixelPath Labs |
| Industry | Web development |
| Link (demo placeholder) | https://example.com/?careerly-demo=pixelpath |
| Description | Fictional employer for the classroom presentation. |
| Status / preparation | Active |

**Record 2**

| Field | Sample value |
|---|---|
| Full name / name | Demo - CloudNest Systems |
| Industry | Software services |
| Link (demo placeholder) | https://example.com/?careerly-demo=cloudnest |
| Description | Fictional software company; no real vacancies. |
| Status / preparation | Active |


### Manage Opportunities

**Record 1**

| Field | Sample value |
|---|---|
| Company | Demo - PixelPath Labs |
| Title | Demo - React Frontend Intern |
| Location | Mumbai / Hybrid |
| Type | Internship |
| Deadline | 2026-11-17 |
| Requirements / skills | JavaScript, React, HTML and CSS. SQL is helpful. Open to engineering students; portfolio project preferred. |
| Link (demo placeholder) | https://example.com/?careerly-demo=react-intern |
| Status / preparation | Published |

**Record 2**

| Field | Sample value |
|---|---|
| Company | Demo - CloudNest Systems |
| Title | Demo - Junior Web Developer |
| Location | Pune / Hybrid |
| Type | Placement |
| Deadline | 2026-11-26 |
| Requirements / skills | JavaScript, React, SQL and Git. Familiarity with REST APIs; final-year students may apply. |
| Link (demo placeholder) | https://example.com/?careerly-demo=web-developer |
| Status / preparation | Published |

**Record 3**

| Field | Sample value |
|---|---|
| Company | Demo - PixelPath Labs |
| Title | Demo - UI Developer Assistant |
| Location | Remote |
| Type | Part-time |
| Deadline | 2026-11-10 |
| Requirements / skills | HTML, CSS, responsive layouts and basic JavaScript. React is a plus. |
| Link (demo placeholder) | https://example.com/?careerly-demo=ui-assistant |
| Status / preparation | Published |

**Record 4**

| Field | Sample value |
|---|---|
| Company | Demo - CloudNest Systems |
| Title | Demo - Full Stack Intern (draft) |
| Location | Mumbai |
| Type | Internship |
| Deadline | 2026-11-21 |
| Requirements / skills | React, Node.js, SQL and API testing. |
| Link (demo placeholder) | https://example.com/?careerly-demo=draft-fullstack |
| Status / preparation | Draft |

**Record 5**

| Field | Sample value |
|---|---|
| Company | Demo - PixelPath Labs |
| Title | Demo - Closed Design Internship |
| Location | Remote |
| Type | Internship |
| Deadline | 2026-11-16 |
| Requirements / skills | HTML, CSS and accessibility basics. |
| Link (demo placeholder) | https://example.com/?careerly-demo=closed-design |
| Status / preparation | Closed |


### Question Bank

**Record 1**

| Field | Sample value |
|---|---|
| Question | What is the difference between props and state in React? |
| Category | Technical |
| Notes / suggested approach | Define each, explain ownership and give a component example. |

**Record 2**

| Field | Sample value |
|---|---|
| Question | How would you make a web form accessible? |
| Category | Technical |
| Notes / suggested approach | Discuss labels, keyboard support, clear validation and focus handling. |

**Record 3**

| Field | Sample value |
|---|---|
| Question | Tell me about a time you worked in a team. |
| Category | Behavioral |
| Notes / suggested approach | Use situation, task, action and result; avoid invented personal experience. |


### Learning Resources

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - React Component Practice |
| Skill | React |
| Link (demo placeholder) | https://example.com/?careerly-demo=react-resource |
| Description | Placeholder resource for presenting admin-managed learning links. |

**Record 2**

| Field | Sample value |
|---|---|
| Title | Demo - SQL Query Exercises |
| Skill | SQL |
| Link (demo placeholder) | https://example.com/?careerly-demo=sql-resource |
| Description | Placeholder exercise pack for the classroom demonstration. |


### Announcements

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Frontend Portfolio Review |
| Description | FICTIONAL DEMO EVENT: prepare a two-minute walkthrough of a React project and review the published demo frontend roles. |
| Date | 2026-10-27 |


## Set B - Data analyst

Student login: **meera.demo@example.test**. Password: **CareerlyDemo2026!**.

### Profile (avatar / Edit profile)

| Field | Sample value |
|---|---|
| Full name / name | Meera Iyer (Demo) |
| College | Demo School of Computing (fictional) |
| Degree | B.Sc Data Science |
| Graduation year | 2027 |
| Career goal / target role | Data analyst internship |
| Skills | Python, SQL, Pandas, Excel, Power BI |
| Share profile with placement admin | true |

### Dashboard

This set contributes 3 tracked applications, 1 application at Interview status, 1 resume with 2 saved versions, 3 coding problems and a 100% completed sample profile. It has 2 projects and 4 skill records. The figures are for each demo student's account; shared admin totals may also include your existing data.

### Applications

**Record 1**

| Field | Sample value |
|---|---|
| Company | Demo - InsightBridge Analytics |
| Role | Data Analyst Intern |
| Link (demo placeholder) | https://example.com/?careerly-demo=data-analyst |
| Date | 2026-10-23 |
| Deadline | 2026-11-20 |
| Status / preparation | Assessment |
| Notes / suggested approach | SIMULATION: practise joins, missing values and descriptive statistics. |

**Record 2**

| Field | Sample value |
|---|---|
| Company | Demo - DataOrbit Solutions |
| Role | Junior BI Analyst |
| Link (demo placeholder) | https://example.com/?careerly-demo=bi-analyst |
| Date | 2026-10-24 |
| Deadline | 2026-12-01 |
| Status / preparation | Interview |
| Next interview | 2026-10-30T14:00 |
| Notes / suggested approach | SIMULATION: prepare a dashboard walkthrough and discuss filter choices. |

**Record 3**

| Field | Sample value |
|---|---|
| Company | Demo - InsightBridge Analytics |
| Role | Reporting Assistant |
| Link (demo placeholder) | https://example.com/?careerly-demo=reporting-assistant |
| Date | 2026-10-26 |
| Deadline | 2026-11-14 |
| Status / preparation | Saved |
| Notes / suggested approach | SIMULATION: review Excel lookup functions and report validation. |


### Opportunities

The student feed shows all six open published demo listings across both sets. Data Analyst Intern, Junior BI Analyst and Reporting Assistant are the expected discussion candidates for this profile; the AI explains relevance and gaps. Draft, closed and expired records are excluded from AI matching. Select **Save to tracker** to review an application form. Links are demo placeholders.

### Resume Manager

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Meera Data Analyst Resume |
| Full name / name | Meera Iyer (Demo) |
| Email | meera.demo@example.test |
| Career goal / target role | Data analyst internship |
| Professional summary | Fictional data science student practising Python, SQL and dashboard design with sample academic datasets. |
| Education | Demo School of Computing (fictional) \| B.Sc Data Science \| Expected graduation 2027 |
| Experience and achievements | Demo academic teamwork: cleaned sample datasets, wrote aggregation queries and presented dashboards. No paid work or real business impact is claimed. |
| Skills | Python, SQL, Pandas, Excel, Power BI, descriptive statistics |
| Projects | Retail Sales Dashboard - sample-data cleaning, SQL summaries and Power BI visuals. Campus Library Analysis - missing-value handling and category trends. |


The seeded resume has two dated versions. Open **Preview & export PDF**, switch versions, then use **Print / Save PDF**. To demonstrate AI drafting, choose the resume task and review the draft in the editor before saving.

### My Projects

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Retail Sales Dashboard |
| Description | Fictional academic project: cleaned a sample retail dataset, wrote monthly sales queries and built an interactive Power BI dashboard. No real business outcomes are claimed. |
| Technology stack | Python, Pandas, SQL, Power BI |
| GitHub URL | Leave blank |
| Link (demo placeholder) | https://example.com/?careerly-demo=sales-dashboard |
| Date | 2026-09-29 |

**Record 2**

| Field | Sample value |
|---|---|
| Title | Demo - Campus Library Analysis |
| Description | Fictional academic project: analyzed sample library borrowing patterns, handled missing values and summarized category trends with charts. |
| Technology stack | Python, Pandas, Excel |
| GitHub URL | Leave blank |
| Link (demo placeholder) | https://example.com/?careerly-demo=library-analysis |
| Date | 2026-10-15 |


### Skill Tracker

**Record 1**

| Field | Sample value |
|---|---|
| Full name / name | Python |
| Current proficiency (%) | 75 |
| Target proficiency (%) | 90 |

**Record 2**

| Field | Sample value |
|---|---|
| Full name / name | SQL |
| Current proficiency (%) | 70 |
| Target proficiency (%) | 90 |

**Record 3**

| Field | Sample value |
|---|---|
| Full name / name | Power BI |
| Current proficiency (%) | 55 |
| Target proficiency (%) | 80 |

**Record 4**

| Field | Sample value |
|---|---|
| Full name / name | Statistics |
| Current proficiency (%) | 45 |
| Target proficiency (%) | 75 |


### Coding Tracker

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Duplicate Customer Records |
| Platform | Classroom SQL practice |
| Difficulty | Easy |
| Topic | GROUP BY and HAVING |
| Date | 2026-10-24 |
| Link (demo placeholder) | https://example.com/?careerly-demo=duplicate-records |

**Record 2**

| Field | Sample value |
|---|---|
| Title | Demo - Second Highest Salary |
| Platform | Classroom SQL practice |
| Difficulty | Medium |
| Topic | Subqueries and ranking |
| Date | 2026-10-25 |
| Link (demo placeholder) | https://example.com/?careerly-demo=salary-ranking |

**Record 3**

| Field | Sample value |
|---|---|
| Title | Demo - Monthly Revenue Summary |
| Platform | Classroom SQL practice |
| Difficulty | Medium |
| Topic | Joins and aggregation |
| Date | 2026-10-26 |
| Link (demo placeholder) | https://example.com/?careerly-demo=monthly-revenue |


### Interview Prep

**Record 1**

| Field | Sample value |
|---|---|
| Question | When would you use an INNER JOIN versus a LEFT JOIN? |
| Category | Technical |
| Status / preparation | Confident |
| Notes / suggested approach | Use INNER JOIN for matched rows; LEFT JOIN retains all rows from the left table, including unmatched rows. |

**Record 2**

| Field | Sample value |
|---|---|
| Question | How do you handle missing values? |
| Category | Technical |
| Status / preparation | Practicing |
| Notes / suggested approach | Inspect the cause and amount of missingness. Explain deletion or imputation choices and validate the result. |

**Record 3**

| Field | Sample value |
|---|---|
| Question | Explain your dashboard to a nontechnical stakeholder. |
| Category | Behavioral |
| Status / preparation | Practicing |
| Notes / suggested approach | SIMULATION: start with the business question, explain the main trend, then discuss limits of the sample dataset. |


### Career Insights

Career goal: **Data analyst internship**. The lowest saved proficiency is Statistics (45%), giving you a concrete learning discussion. Try the job-description keyword checker using the requirements of a published demo role. The keyword check is a simple text comparison, not an ATS or hiring score.

**AI Coach prompts to paste:**

- Match my Python, SQL and Power BI skills to the published demo opportunities. Explain gaps such as DAX.
- Suggest a portfolio project that strengthens my statistics skills.
- Draft a data analyst resume using only my saved profile and academic projects.

### Notifications

Show the three upcoming application deadlines, the scheduled interview in the Interview application, and both shared announcements. Dates are refreshed by demo:seed. Email reminders are not connected.

### Admin Overview

Sign out and use your existing admin credentials. Across both demo sets, the fixtures add 2 shared student profiles, 4 companies, 9 opportunity records, 6 practice questions, 4 learning resources and 2 announcements. Of the opportunity records, 6 are open and published. The existing Published roles metric counts all Published statuses, including the expired demo record; the student feed also checks deadlines.

### Students

This set appears as **Meera Iyer (Demo)**, with the college, degree, year and goal above because profile sharing is enabled. Turn sharing off on the student profile and refresh the admin list to demonstrate consent.

### Companies

**Record 1**

| Field | Sample value |
|---|---|
| Full name / name | Demo - InsightBridge Analytics |
| Industry | Business analytics |
| Link (demo placeholder) | https://example.com/?careerly-demo=insightbridge |
| Description | Fictional analytics employer for demonstration only. |
| Status / preparation | Active |

**Record 2**

| Field | Sample value |
|---|---|
| Full name / name | Demo - DataOrbit Solutions |
| Industry | Data services |
| Link (demo placeholder) | https://example.com/?careerly-demo=dataorbit |
| Description | Fictional data services company; all listed roles are simulated. |
| Status / preparation | Active |


### Manage Opportunities

**Record 1**

| Field | Sample value |
|---|---|
| Company | Demo - InsightBridge Analytics |
| Title | Demo - Data Analyst Intern |
| Location | Mumbai / Hybrid |
| Type | Internship |
| Deadline | 2026-11-20 |
| Requirements / skills | Python, SQL, Pandas and Excel. Explain data cleaning and basic descriptive statistics. |
| Link (demo placeholder) | https://example.com/?careerly-demo=data-analyst |
| Status / preparation | Published |

**Record 2**

| Field | Sample value |
|---|---|
| Company | Demo - DataOrbit Solutions |
| Title | Demo - Junior BI Analyst |
| Location | Bengaluru / Hybrid |
| Type | Placement |
| Deadline | 2026-12-01 |
| Requirements / skills | SQL, Power BI, Excel and clear communication. DAX knowledge is preferred, not mandatory. |
| Link (demo placeholder) | https://example.com/?careerly-demo=bi-analyst |
| Status / preparation | Published |

**Record 3**

| Field | Sample value |
|---|---|
| Company | Demo - InsightBridge Analytics |
| Title | Demo - Reporting Assistant |
| Location | Remote |
| Type | Part-time |
| Deadline | 2026-11-14 |
| Requirements / skills | Excel, SQL, charts and careful validation of business reports. Python is helpful. |
| Link (demo placeholder) | https://example.com/?careerly-demo=reporting-assistant |
| Status / preparation | Published |

**Record 4**

| Field | Sample value |
|---|---|
| Company | Demo - DataOrbit Solutions |
| Title | Demo - Expired Data Internship |
| Location | Remote |
| Type | Internship |
| Deadline | 2026-10-20 |
| Requirements / skills | Python and SQL. |
| Link (demo placeholder) | https://example.com/?careerly-demo=expired-data |
| Status / preparation | Published |


### Question Bank

**Record 1**

| Field | Sample value |
|---|---|
| Question | Explain INNER JOIN and LEFT JOIN with a small example. |
| Category | Technical |
| Notes / suggested approach | Describe which rows are retained and explain unmatched values. |

**Record 2**

| Field | Sample value |
|---|---|
| Question | How would you validate a data dashboard? |
| Category | Technical |
| Notes / suggested approach | Reconcile totals with the source, check filters and date ranges, and document assumptions. |

**Record 3**

| Field | Sample value |
|---|---|
| Question | How do you explain an uncertain conclusion to a stakeholder? |
| Category | Behavioral |
| Notes / suggested approach | State the evidence and limitations; avoid claiming certainty that the data does not support. |


### Learning Resources

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Pandas Cleaning Checklist |
| Skill | Python |
| Link (demo placeholder) | https://example.com/?careerly-demo=pandas-resource |
| Description | Placeholder checklist for a fictional sample-data exercise. |

**Record 2**

| Field | Sample value |
|---|---|
| Title | Demo - BI Dashboard Review Guide |
| Skill | Power BI |
| Link (demo placeholder) | https://example.com/?careerly-demo=bi-resource |
| Description | Placeholder classroom resource for charts, filters and validation. |


### Announcements

**Record 1**

| Field | Sample value |
|---|---|
| Title | Demo - Analytics Interview Practice |
| Description | FICTIONAL DEMO EVENT: revise joins, missing values and dashboard validation. Review the published demo analytics roles. |
| Date | 2026-10-27 |


## Suggested presentation flow

1. Sign in as admin. Show Companies and Manage Opportunities; point out the clearly labelled demo records and publication statuses.
2. Sign out; log in as Aarav (Set A). Show dashboard, profile, projects and skill levels. Ask AI Coach to match opportunities.
3. Review a recommendation and save it to the application tracker. Do not claim the example.com link is a real vacancy.
4. Draft a resume with AI, review it, save a version and open PDF preview. Show coding records, interview notes and reminders.
5. Sign out; log in as Meera (Set B). Repeat matching and compare the analytics-focused suggestions. Student records remain separate.
6. Return to admin login. Show the shared student directory, curated questions, learning resources and announcements.

Before a later presentation, re-run **npm.cmd run demo:seed** to refresh deadlines, then **npm.cmd run demo:export** if you want to regenerate the guide separately. Gemini must have internet access and available quota for live AI responses. Review generated suggestions; do not present them as guaranteed outcomes.
