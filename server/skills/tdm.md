# TDM Project — Comprehensive Delivery Estimation Skill

This file is the **authoritative source** for estimating TDM work. All effort
numbers, complexity rules, technology impacts, and AI-savings percentages below
are the agreed figures every delivery team must use, so that the same requirement
always yields the **same estimate**.

> The model must use ONLY the numbers and frameworks in this file. It must not
> invent tasks, efforts, savings, or complexity multipliers. If a requirement
> does not map to a known TDM workflow or is too vague, return the guardrail
> response ("More information needed").

---

## Skill Name
**TDM Delivery Estimator**

## Purpose
Use this skill to estimate delivery **hours** for TDM-related software engineering,
data engineering, ETL, Redshift, AWS, and integration work.

This skill generates a clear effort estimate with:
- Total estimated hours
- Phase-wise breakdown
- Technology-wise breakdown
- Complexity level
- Confidence level
- Risks and assumptions
- Validation scope
- Deployment impact
- Final estimate with buffer

---

## 1. Project Overview

TDM is a data-integration project that lands data from a source system into
Amazon Redshift and makes it available to downstream consumers.

- **ETL tool:** Informatica Cloud Data Integration (IICS) + ETL Works. Jobs are
  **already up and running** — connectivity to the source is established.
- **Warehouse:** Amazon Redshift (4 clusters).
- **Integration patterns in use:** Informatica Cloud ELTL, ETL Works, Zero-ETL
  integration, stored procedures, Lambda, S3.
- **Source systems:** AS400, Titan, TBE, APIs, S3 files, Zero ETL replicas.

---

## 2. Redshift Cluster Architecture (drives effort)

Redshift has **4 clusters** — 3 production + 1 UAT:

| Cluster | Role | Purpose | Notes |
|---|---|---|---|
| **PROD1** | Producer / Write cluster | Primary transformation and data loading | All writes happen here. Informatica loads data into PROD1. Tables, stored procedures, staging, facts, dimensions. |
| **PROD2** | BI/Reporting consumer | Looker and Power BI validation | Read-only via datashare. |
| **PROD3** | Application consumer | FLP360 and application validation | Read-only via datashare. |
| **UAT** | Testing & release verification | Pre-production validation | Read-only via datashare. |

### Key Architecture Constraint: Datashare

Prod2, Prod3, and UAT consume Prod1 through a Redshift **datashare**:

- When a **new table** is created in Prod1, it must be **added to the datashare**
  so data is available to Prod2/Prod3/UAT — **and a view must be created in each
  consuming cluster** to query the shared object. That's 3 views (Prod2, Prod3, UAT).
- When a **new column** is added to an existing Prod1 table, it
  **auto-propagates** to Prod2/Prod3/UAT via the datashare, so there is **no
  separate datashare task** — **but views must be updated** to expose the new column,
  and the change must be **tested in every cluster**.

---

## 3. TDM Technology Context

TDM work may involve one or more of the following technologies:

| Technology | Purpose in TDM |
|---|---|
| **Informatica Cloud Data Integration (IICS)** | ETL mappings, mapping tasks, taskflows, schedules, parameters, source/target config, full/incremental loads, error handling |
| **ETL Works** | Lightweight ETL flows, API/file ingestion, job scheduling, connector-based data movement, retry handling |
| **Amazon Redshift PROD1** | Primary write/processing cluster, core TDM transformations, stored procedures, staging tables, facts, dimensions, full/incremental logic |
| **Amazon Redshift PROD2** | Reporting/BI consumer cluster, Looker and Power BI validation through datashare |
| **Amazon Redshift PROD3** | Application consumer cluster, FLP360/application validation through datashare |
| **Amazon Redshift UAT** | UAT testing, validation, release verification before production |
| **Redshift Stored Procedures** | Main transformation logic, full/incremental load processing, temp table logic, validations, PL/pgSQL |
| **AWS S3** | File landing, staging, COPY/UNLOAD processing, archival, source file ingestion, patterns |
| **AWS Lambda** | Automation, notifications, audit process, alerts, CloudWatch logging, event processing |
| **Zero ETL Integration** | Source-to-Redshift replication, schema sync, CDC validation, downstream Redshift validation |
| **Redshift Performance Tuning** | DISTKEY, SORTKEY, ANALYZE, VACUUM, query plan review, temp table optimization |

---

## 4. Required Skill Set

| Area | Required Skills |
|---|---|
| **Informatica Cloud** | Mapping design, Mapping Task, Taskflow creation, parameters, schedules, source/target configuration, error handling, full/incremental branching |
| **ETL Works** | Flow creation, connector setup, scheduling, API/file ingestion, retry logic, logging |
| **Redshift SQL** | Joins, temp tables, CTEs, DELETE/INSERT/MERGE patterns, QUALIFY, window functions, transaction control |
| **Redshift Stored Procedures** | PL/pgSQL, exception handling, full/incremental branching, debug logging, performance optimization |
| **Redshift Performance** | DISTKEY/SORTKEY selection, ANALYZE, VACUUM, query plan analysis, temp table tuning, distribution strategy |
| **Redshift Datashare** | Producer/consumer setup, downstream table/view availability, report/application impact validation |
| **AWS S3** | Folder structure, file patterns, COPY command, UNLOAD, permissions, file archival, lifecycle policies |
| **AWS Lambda** | Event processing, Python/Node.js basics, CloudWatch logs, SNS/email alerting, error handling |
| **Zero ETL** | Source sync validation, schema drift detection, CDC behavior, target table verification |
| **Data Validation** | Source-to-target counts, reconciliation queries, duplicate detection, null checks, business rule validation |
| **Release Management** | UAT to PROD movement, backup/rollback planning, deployment checklists, post-deployment monitoring |

---

## 5. Work Type Categories

Use one of these when estimating:

| Work Type | Description |
|---|---|
| **Data Fix / One-Time Update** | Manual correction, historical data update, targeted table update, backfill |
| **Bug Fix** | Existing logic issue, incorrect data, report mismatch, null/missing values, calculation error |
| **Stored Procedure Enhancement** | Update to existing Redshift procedure logic |
| **New Stored Procedure** | New transformation or aggregation logic in Redshift |
| **Informatica Enhancement** | Change to existing IICS mapping/taskflow |
| **New Informatica Pipeline** | New source-to-target ETL pipeline using IICS |
| **ETL Works Enhancement** | Change to existing ETL Works job/flow |
| **New ETL Works Pipeline** | New ETL Works ingestion or transformation flow |
| **Redshift Performance Tuning** | Query/procedure optimization, DISTKEY/SORTKEY tuning, temp table optimization |
| **S3 File Ingestion** | New or changed file ingestion from S3 |
| **Lambda Automation** | New or changed Lambda-based alert/audit/automation |
| **Zero ETL Validation / Integration** | Zero ETL source sync, schema drift, CDC, downstream validation |
| **Full TDM Feature** | Multiple technologies, multiple clusters, full lifecycle delivery |

---

## 6. Base Hour Ranges

Use these as starting points before applying complexity, technology add-ons,
validation, deployment, and risk buffer.

| Work Type | Low Complexity | Medium Complexity | High Complexity |
|---|---:|---:|---:|
| Data Fix / One-Time Update | 4–8 hrs | 8–16 hrs | 16–32 hrs |
| Bug Fix | 6–12 hrs | 12–32 hrs | 32–80 hrs |
| Stored Procedure Enhancement | 8–16 hrs | 16–40 hrs | 40–80 hrs |
| New Stored Procedure | 16–32 hrs | 32–80 hrs | 80–160 hrs |
| Informatica Enhancement | 8–16 hrs | 16–40 hrs | 40–80 hrs |
| New Informatica Pipeline | 24–40 hrs | 40–80 hrs | 80–160 hrs |
| ETL Works Enhancement | 6–12 hrs | 12–32 hrs | 32–64 hrs |
| New ETL Works Pipeline | 16–32 hrs | 32–64 hrs | 64–120 hrs |
| Redshift Performance Tuning | 8–16 hrs | 16–40 hrs | 40–100 hrs |
| S3 File Ingestion | 12–24 hrs | 24–60 hrs | 60–120 hrs |
| Lambda Automation | 8–16 hrs | 16–40 hrs | 40–80 hrs |
| Zero ETL Validation / Integration | 16–32 hrs | 32–80 hrs | 80–160 hrs |
| Full TDM Feature | 40–80 hrs | 80–200 hrs | 200–400+ hrs |

---

## 7. Complexity Classification Rules

Classify the work using these rules. Complexity drives the multiplier applied to
base effort.

### Low Complexity (1.0x multiplier)
Use low complexity when:
- One table or one procedure is impacted
- Existing source and target structure are stable
- No major business rule change
- No downstream BI/application validation needed
- No new AWS component
- Not production critical / month-end impacting

Example: Add a new non-critical column to an existing table in Prod1 only.

### Medium Complexity (1.5x multiplier)
Use medium complexity when:
- Multiple tables are impacted
- Existing ETL or stored procedure logic changes
- UAT and PROD validation are required
- Some downstream report or application validation needed
- Incremental logic needs validation
- Data quality checks are required

Example: Update an Informatica mapping to handle a source schema change and
validate in UAT before PROD deployment.

### High Complexity (2.5x multiplier)
Use high complexity when:
- Multiple technologies are involved
- Multiple Redshift clusters are impacted
- Both full and incremental logic need changes
- Business rules are complex or changing
- Month-end, bonus, order, member, or sponsor logic is impacted
- Zero ETL, Lambda, or new S3 ingestion is involved
- Large historical backfill or one-time update needed
- Downstream Looker, Power BI, FLP360, or application validation required

Example: Add a new table to PROD1 (Informatica job + stored procedure) and
validate in Prod2 (Looker), Prod3 (FLP360), and UAT.

### Critical Complexity (3.0x multiplier)
Use critical complexity when:
- Production month-end or financial/bonus aggregation is impacted
- Customer-facing reporting/application output is impacted
- Large historical data correction is required
- Rollback is difficult
- Multiple teams must coordinate (TBE, Titan, FLP360, etc.)
- High risk of data mismatch across TDM, BI, and application layers

Example: Fix a calculation error in a bonus aggregation fact table that impacts
month-end reporting and customer payouts.

---

## 8. Complexity Multipliers

| Complexity | Multiplier |
|---|---:|
| Low | 1.0x |
| Medium | 1.5x |
| High | 2.5x |
| Critical | 3.0x |

**Formula:**
```
Adjusted Estimate = Base Estimate × Complexity Multiplier
```

---

## 9. Technology Add-On Hours

Add these hours when the technology is part of the delivery scope. These are
**in addition to** the base work type estimate.

| Technology / Impact | Add-On Hours |
|---|---:|
| Informatica Cloud mapping/taskflow change | +8 to +40 hrs |
| New Informatica Cloud pipeline | +24 to +80 hrs |
| ETL Works flow change | +6 to +32 hrs |
| New ETL Works flow | +16 to +64 hrs |
| Redshift stored procedure change | +8 to +60 hrs |
| Redshift performance tuning | +8 to +40 hrs |
| PROD1 cluster validation | +4 to +16 hrs |
| PROD2 BI/reporting validation (Looker, Power BI) | +8 to +32 hrs |
| PROD3 application validation (FLP360) | +8 to +32 hrs |
| UAT validation | +8 to +32 hrs |
| S3 new file/load pattern | +8 to +40 hrs |
| Lambda change/new automation | +8 to +40 hrs |
| Zero ETL validation/change | +16 to +80 hrs |
| Historical backfill / one-time update | +8 to +80 hrs |
| Report/query validation | +8 to +40 hrs |
| Production deployment and rollback plan | +8 to +24 hrs |

---

## 10. Standard Phase Breakdown

For every estimate, break effort into these phases. Use the default percentages
unless the work is very small (e.g., data fix) or very complex.

| Phase | Default % of Total | Activities |
|---|---:|---|
| Requirement Analysis | 10% | Understand business rules, source, target, issue, edge cases |
| Technical Design | 10% | Data flow, table impact, cluster impact, ETL/procedure design |
| Development | 35% | IICS, ETL Works, Redshift SQL, stored procedure, S3, Lambda, Zero ETL work |
| Unit Testing | 15% | Developer testing, reruns, sample validation, failure handling |
| Data Validation | 15% | Source-to-target counts, duplicate checks, null checks, reconciliation |
| Performance Testing | 5% | Runtime, query plan, Redshift performance, data volume checks |
| Deployment | 5% | UAT/PROD deployment, backup, rollback, release validation |
| Post-Deployment Support | 5% | Monitoring, production validation, issue triage |

**For small data fixes**, reduce design and performance effort (e.g., 5% + 5% +
50% + 15% + 15% + 0% + 5% + 5%).

**For critical production features**, keep all phases and may increase
post-deployment support to 10%.

---

## 11. Risk Buffer

Apply a risk buffer **after** base estimate, complexity, add-ons, and validation
effort are summed.

| Risk Level | Buffer |
|---|---:|
| Low | +10% |
| Medium | +20% |
| High | +30% |
| Critical | +40% |

**Formula:**
```
Final Estimate = Subtotal Estimate + Risk Buffer
```

---

## 12. Confidence Level

Use these rules to assign confidence to the estimate:

| Confidence | When to Use |
|---|---|
| **High** | Requirement is clear, source/target known, low unknowns, similar work done before |
| **Medium** | Some unknowns exist, but technology and impacted tables are mostly known |
| **Low** | Requirement is incomplete, impacted tables are unclear, source data quality unknown, or multiple teams involved |

---

## 13. Cluster Impact Rules

Adjust the complexity and add-on hours based on how many clusters are impacted:

- **PROD1 only:** Low to Medium cluster impact
- **PROD1 + UAT:** Medium impact
- **PROD1 + PROD2:** Medium to High impact
- **PROD1 + PROD3:** Medium to High impact
- **PROD1 + PROD2 + PROD3 + UAT:** High impact

For each additional cluster requiring validation, add **+8 to +32 hours** depending
on the validation complexity.

---

## 14. Estimation Formula

Use this formula to compute the final estimate:

```
Subtotal Estimate =
  Base Work Type Hours
  + Technology Add-On Hours
  + Cluster Impact Hours
  + Validation Hours
  + Deployment Hours

Adjusted Estimate = Subtotal Estimate × Complexity Multiplier

Final Estimate = Adjusted Estimate + Risk Buffer
```

When exact details are not available, provide a **range**:

```
Estimated Range = Low Estimate to High Estimate
Recommended Estimate = realistic midpoint or slightly above midpoint
```

---

## 15. Required Output Format

Always produce the estimate in this structured format.

### Executive Summary

| Item | Value |
|---|---|
| Work Type | [e.g., New Informatica Pipeline] |
| Complexity | [Low / Medium / High / Critical] |
| Confidence | [High / Medium / Low] |
| Risk Level | [Low / Medium / High / Critical] |
| Estimated Range | [X hrs to Y hrs] |
| Recommended Estimate | [Z hrs] |
| Final Estimate with Buffer | [Z + buffer hrs] |

### Technology Impact

| Technology | Impact | Estimated Hours |
|---|---|---:|
| Informatica Cloud | [Yes/No] | [X hrs] |
| ETL Works | [Yes/No] | [X hrs] |
| Redshift PROD1 | [Yes/No] | [X hrs] |
| Redshift PROD2 | [Yes/No] | [X hrs] |
| Redshift PROD3 | [Yes/No] | [X hrs] |
| Redshift UAT | [Yes/No] | [X hrs] |
| Stored Procedures | [Yes/No] | [X hrs] |
| AWS S3 | [Yes/No] | [X hrs] |
| AWS Lambda | [Yes/No] | [X hrs] |
| Zero ETL | [Yes/No] | [X hrs] |

(Only include technologies that are relevant.)

### Phase-Wise Estimate

| Phase | Activities | Estimated Hours |
|---|---|---:|
| Requirement Analysis | [details] | [X hrs] |
| Technical Design | [details] | [X hrs] |
| Development | [details] | [X hrs] |
| Unit Testing | [details] | [X hrs] |
| Data Validation | [details] | [X hrs] |
| Performance Testing | [details] | [X hrs] |
| Deployment | [details] | [X hrs] |
| Post-Deployment Support | [details] | [X hrs] |
| **Total** | | **[X hrs]** |

### Assumptions

List assumptions clearly. Example:

- Source data structure is stable.
- No new source system onboarding is required.
- Existing Redshift table structure can be reused.
- Downstream Looker/Power BI validation is limited to impacted reports only.
- Informatica connectivity to the source already exists.

### Risks

List identified risks. Example:

- Source data mismatch may increase validation effort.
- Stored procedure runtime may need additional tuning if data volume is large.
- PROD2/PROD3 datashare validation may reveal downstream report or application issues.
- Month-end timing may compress testing window.

### Validation Plan

Include the validation steps that apply:

- [ ] Source-to-target count validation
- [ ] Duplicate check
- [ ] Null check
- [ ] Business rule validation
- [ ] Full load validation
- [ ] Incremental load validation
- [ ] PROD1 validation
- [ ] PROD2 BI/reporting validation
- [ ] PROD3 application validation
- [ ] UAT sign-off
- [ ] Post-deployment monitoring

### Final Recommendation

Give one short, clear recommendation. Example:

```
Recommended estimate: 120 hours including 20% buffer, because the work impacts
Redshift stored procedures, UAT validation, and downstream reporting checks.
Schedule: 3 weeks for development + 1 week for validation + deployment.
```

---

## 16. Standard Catalog Patterns (Quick Mapping)

For the most common TDM work, use these standard catalogs. These are
pre-calculated using the framework above and represent the authoritative numbers
all teams must use.

### Catalog A — Add a NEW table to PROD1 (sourced from AS400)

Use this when the requirement is to add/create a new table in PROD1 and make it
available downstream.

| # | Task | Phase | Manual Hours | AI Savings % | Automatable | Justification |
|---|------|-------|-------------|-------------|-------------|---------------|
| 1 | Mapping document & requirement analysis | MVP | 4 | 20% | No | Understand columns, sources, lookups, validations. |
| 2 | Data lake table creation (S3 + staging) | MVP | 8 | 30% | Partial | Create historical data lake table and staging table. |
| 3 | Table creation in PROD1 (DDL, DISTKEY/SORTKEY) | MVP | 6 | 50% | Partial | AI drafts DDL and suggests dist/sort keys; human confirms. |
| 4 | Informatica Cloud job (ELTL from AS400) | MVP | 24 | 30% | Partial | AI scaffolds mappings/SQL; source config and testing manual. |
| 5 | Informatica mapping tasks & taskflows | MVP | 16 | 40% | Partial | Create mapping task, add to taskflow, parameter setup. |
| 6 | Schedule the job | MVP | 4 | 10% | Partial | Configure schedule, frequency, parameters, error handling. |
| 7 | Add table to datashare (PROD2/PROD3/UAT) | MVP | 6 | 25% | Yes | Console/config; AI generates GRANT/ALTER statements. Includes UAT datashare consolidation (previously separate task). |
| 8 | Create views in PROD2/PROD3/UAT | MVP | 2 | 70% | Yes (high) | View DDL near-identical across clusters; AI templates all 3 with one schema. |
| 9 | Validate data in PROD1 (source-to-target) | MVP | 4 | 45% | Partial | AI generates reconciliation queries; mismatch investigation manual. |
| 10 | Validate data in UAT | MVP | 4 | 45% | Partial | AI generates reconciliation queries; investigation manual. |
| 11 | Test end-to-end in UAT | MVP | 4 | 25% | No | Full load + incremental load testing, edge cases. |
| 12 | Add table to audit (if needed) | Phase2 | 4 | 40% | Yes | Configure audit rules, thresholds, alerts. |
| 13 | Documentation & handover | Phase2 | 6 | 60% | Yes | AI drafts data dictionary, runbook; human reviews. |
| 14 | Coordination & status updates | MVP | 4 | 0% | No | Manager review, lead discussion, Jira updates, daily standup. |
| 15 | Coordinate with downstream teams (FLP360, TBE, Titan) | MVP | 8 | 0% | No | Clarification, sign-off, validation feedback. |

**Subtotal (MVP + Phase2):** ~114 hours (manual) → ~80 hours (with AI, ~30% saved).

**Confidence:** High (if requirement is clear, sources are known).

**Risk Buffer:** +20% for standard deployment.

**Final estimate:** ~96 hours.

---

### Catalog B — Add a COLUMN to an existing PROD1 table

Use this when the requirement is to add a column/field to a table that already
exists in PROD1. **Note the nuance:** the column auto-propagates via datashare,
so there is **no datashare task** — but views must be **updated** to expose it,
and it must be validated everywhere.

| # | Task | Phase | Manual Hours | AI Savings % | Automatable | Justification |
|---|------|-------|-------------|-------------|-------------|---------------|
| 1 | Requirement & impact analysis | MVP | 4 | 20% | No | Understand column source, business rules, downstream impact. |
| 2 | Alter / recreate table in PROD1 | MVP | 6 | 40% | Partial | AI drafts ALTER/recreate DDL; review + DISTKEY impact human. |
| 3 | Update Informatica mapping | MVP | 8 | 30% | Partial | AI scaffolds mapping/SQL change; config + testing manual. |
| 4 | Update views in PROD2/PROD3/UAT to expose column | MVP | 2 | 70% | Yes | Change across 3 clusters nearly identical; AI templates all 3. |
| 5 | Validate in PROD1 (source-to-target) | MVP | 3 | 45% | Partial | AI generates reconciliation queries; mismatch investigation manual. |
| 6 | Validate in UAT | MVP | 3 | 45% | Partial | AI generates reconciliation queries; investigation manual. |
| 7 | Test end-to-end in UAT | MVP | 4 | 25% | No | Full load, incremental load, edge case validation. |
| 8 | Coordinate downstream validation (Looker, FLP360) | MVP | 4 | 0% | No | Report/application review, sign-off. |
| 9 | Deploy to PROD | MVP | 4 | 10% | No | Deployment steps, backup, rollback plan. |
| 10 | Post-deployment monitoring | MVP | 4 | 0% | No | Monitor job execution, query performance, alerts. |

**Subtotal (MVP):** ~42 hours (manual) → ~30 hours (with AI, ~29% saved).

**Confidence:** High (if source and target are known).

**Risk Buffer:** +20% for standard deployment.

**Final estimate:** ~36 hours.

---

## 17. Detailed Example: Create a Brand New Table (Full Lifecycle)

This example shows all the steps, effort, and considerations for creating a new
table from scratch in TDM. Use this as a reference for similar work.

### Scenario
**Business Requirement:** Add a new table `CUSTOMER_ORDERS` to PROD1, sourced from
AS400, and make it available to Looker (PROD2), FLP360 (PROD3), and UAT for
reporting and application validation.

### Executive Summary

| Item | Value |
|---|---|
| Work Type | Full TDM Feature (New Table) |
| Complexity | High (multiple clusters, full lifecycle) |
| Confidence | High |
| Risk Level | Medium |
| Estimated Range | 88–114 hours |
| Recommended Estimate | 96 hours |
| Final Estimate with Buffer | 115 hours (96 + 20% buffer) |

### Phase-Wise Breakdown

| Phase | Activities | Hours |
|---|---|---:|
| **1. Requirement Analysis** | Understand CUSTOMER_ORDERS structure, columns, AS400 source mapping, business rules, lookup tables needed, uniqueness constraints, refresh frequency (full vs incremental). Clarification discussion with manager, lead. | 8 |
| **2. Technical Design** | Design data flow: AS400 → Informatica → PROD1. Determine DISTKEY/SORTKEY strategy for CUSTOMER_ORDERS. Plan staging table. Design incremental load logic (identify delta). List columns, data types, lookups from existing tables. Plan downstream view structure. | 10 |
| **3. Data Lake & Staging** | Create S3 folder structure (landing, staging, archive). Create Redshift staging table (staging_customer_orders). Set up data archival policy. | 8 |
| **4. PROD1 Table Creation** | Write table creation DDL for CUSTOMER_ORDERS (columns, primary key, DISTKEY, SORTKEY, NOT NULLs, defaults). Create destination table in PROD1. Apply ANALYZE to establish statistics. | 6 |
| **5. Informatica Mapping** | Design source (AS400) → target (CUSTOMER_ORDERS) mapping. Include any transformations, lookups (e.g., join with DIM_CUSTOMER). Handle error records. Configure source qualifiers. | 24 |
| **6. Informatica Mapping Tasks & Taskflows** | Create mapping task for CUSTOMER_ORDERS. Create taskflow. Add parameters (e.g., load_date, batch_id). Set up task dependencies. Configure error handling and notifications. | 16 |
| **7. Full Load & Incremental Logic** | Implement full load process (TRUNCATE + INSERT all rows). Implement incremental process (INSERT new rows, UPDATE changed rows, DELETE deleted rows). Test both paths. | 16 |
| **8. Schedule & Automation** | Set up Informatica Cloud schedule (e.g., daily at 2 AM). Configure frequency, notification rules, retry logic. Document schedule in Jira. | 4 |
| **9. Add Table to Datashare** | In Informatica or Redshift console, grant datashare access for CUSTOMER_ORDERS to PROD2, PROD3, UAT consumers. Includes UAT datashare consolidation. | 6 |
| **10. Create Consumer Views** | Create view in PROD2 (for Looker): `SELECT * FROM shared_customer_orders_prod1.CUSTOMER_ORDERS`. Create view in PROD3 (for FLP360). Create view in UAT. AI templates all 3 from single schema. | 2 |
| **11. Data Validation — PROD1** | Write reconciliation queries (source row count vs Redshift row count, duplicate check, null check, business rule validation). Run full load and incremental validation. | 8 |
| **11b. Data Validation — UAT** | Run UAT validation of reconciliation queries. Investigate any mismatches. | 8 |
| **12. Performance Testing** | Run CUSTOMER_ORDERS query with various WHERE clauses. Review query plans. Confirm DISTKEY/SORTKEY choice is optimal. Check job execution time. Optimize if needed. | 8 |
| **13. UAT Testing** | Deploy full setup to UAT. Run end-to-end test (full load, incremental load, view queries). Test error scenarios (source data unavailable, AS400 down, network timeout). Test rollback. | 4 |
| **14. Looker / FLP360 Validation** | Coordinate with Looker team: verify view is queryable, reports can be built, performance acceptable. Coordinate with FLP360 team: verify table is available, application queries work, no missing columns. | 8 |
| **15. Audit Configuration** | Add CUSTOMER_ORDERS to audit rules (if needed). Set up threshold alerts (e.g., warn if > 1M rows loaded). Configure audit logging. | 4 |
| **16. Documentation** | Create data dictionary (columns, data types, business definitions). Write runbook (how to monitor job, troubleshoot, rerun). Document DISTKEY/SORTKEY rationale. Document disaster recovery steps. | 6 |
| **17. Deployment to PROD** | Create deployment checklist. Back up PROD1 pre-deployment. Deploy table DDL to PROD. Deploy Informatica job to PROD. Add to datashare. Create views in PROD2/PROD3. Verify access. | 8 |
| **18. Rollback Plan** | Document how to rollback (drop table, revert Informatica job, remove datashare). Test rollback in UAT. Keep backup of pre-deployment state. | 4 |
| **19. Post-Deployment Monitoring** | Monitor first week of job execution (success rate, runtime, data quality). Watch Looker and FLP360 usage. Respond to issues. Verify no performance degradation in PROD1. | 8 |
| **21. Coordination & Communication** | Daily Jira updates. Standup meetings. Manager/lead reviews. Clarification calls with downstream teams. | 4 |
| | **TOTAL** | **144 hours** |

### Technology Impact

| Technology | Impact | Hours |
|---|---|---:|
| **Informatica Cloud IICS** | New mapping + mapping task + taskflow + schedule + full/incremental branching | +40 |
| **Redshift PROD1** | New table DDL + staging table + DISTKEY/SORTKEY tuning | +6 |
| **Redshift PROD2 (Looker)** | View creation + BI team coordination + query validation | +16 |
| **Redshift PROD3 (FLP360)** | View creation + application team coordination + query validation | +16 |
| **Redshift UAT** | Full UAT testing + validation + sign-off | +12 |
| **AWS S3** | Landing/staging folders + archival policy | +8 |
| **Data Lake & Staging** | Staging table + incremental logic + historical backfill | +12 |
| **Validation & Reconciliation** | Counts, duplicates, nulls, business rules, full/incremental tests | +16 |
| **Production Deployment** | Backup, deployment, rollback plan, post-deployment monitoring | +16 |

### Assumptions

- Source AS400 structure is stable and documented.
- Informatica Cloud connectivity to AS400 already exists and is tested.
- No new source system onboarding is required.
- PROD1 table structure is compatible with existing DISTKEY/SORTKEY strategy.
- Downstream teams (Looker, FLP360) can validate in parallel.
- Historical data backfill (if any) is limited to < 3 years.
- No month-end/financial reporting impact initially.

### Risks

- **Source data quality:** If AS400 source has unexpected nulls or duplicate keys, validation will take longer. **Mitigation:** Validate sample data early.
- **Informatica mapping complexity:** If lookups involve complex joins or multiple source tables, mapping design takes longer. **Mitigation:** Sketch mapping early with Informatica expert.
- **Downstream report impact:** Looker or FLP360 may discover missing columns or business rules during PROD2/PROD3 validation. **Mitigation:** Align on column list early with stakeholders.
- **Performance tuning:** If CUSTOMER_ORDERS is large (> 100M rows), DISTKEY/SORTKEY tuning may require additional testing. **Mitigation:** Estimate data volume early.
- **UAT sign-off:** Multiple team approvals (manager, lead, Looker, FLP360) may add latency. **Mitigation:** Schedule reviews early.

### Validation Plan

- [x] Requirement analysis & business rule documentation
- [x] Source AS400 data sample review (5,000+ rows)
- [x] Informatica mapping design review
- [x] Redshift table DDL review (DISTKEY/SORTKEY rationale)
- [x] Full load validation: source row count = Redshift row count
- [x] Incremental load validation: inserts, updates, deletes tracked correctly
- [x] Duplicate key check: no duplicates on primary key
- [x] Null check: NOT NULL columns have no nulls
- [x] Business rule validation: e.g., ORDER_DATE is never in future, AMOUNT >= 0
- [x] PROD1 query performance: full table scan, filtered queries, join queries
- [x] PROD2 (Looker) view queryable & Looker report building test
- [x] PROD3 (FLP360) view queryable & application query test
- [x] UAT end-to-end test (full load + incremental load + queries)
- [x] Rollback test: drop table, restore backup, verify data integrity
- [x] Post-deployment monitoring (week 1): job success rate, runtimes, data quality alerts

### Final Recommendation

```
Recommended estimate: 176 hours total.
With 20% buffer: 211 hours.

Schedule recommendation:
- Weeks 1–2: Requirement analysis + technical design + mapping design (20 hrs)
- Weeks 2–4: Informatica mapping + table creation + full/incremental logic (40 hrs)
- Weeks 4–5: Unit testing + data validation (20 hrs)
- Weeks 5–6: UAT testing + downstream team validation (20 hrs)
- Week 6: PROD deployment + rollback plan (8 hrs)
- Weeks 7–8: Post-deployment monitoring + issue resolution (8 hrs)

Total: 8 weeks (including buffer for review cycles, team coordination, and
post-deployment support).

Critical success factors:
- Start with a clear mapping document from the business.
- Validate source data quality early (week 1).
- Get Informatica expert review on mapping (week 2).
- Engage Looker & FLP360 teams early for downstream validation alignment (week 3).
- Plan deployment for non-month-end window.
- Keep backup and rollback plan updated throughout.
```

---

## 18. Estimation Quality Rules

Follow these rules for all estimates:

- **Do not** provide a single number without a breakdown.
- **Always** show assumptions clearly.
- **Always** show risk buffer (and the % used).
- **Always** separate development, testing, validation, and deployment phases.
- **Always** mention impacted Redshift clusters (PROD1, PROD2, PROD3, UAT).
- **Always** include downstream validation if PROD2, PROD3, Looker, Power BI, or FLP360 is involved.
- **Always** call out if the estimate has low confidence — list the unknowns.
- **Do not** under-estimate production or month-end related work.
- **Do not** ignore UAT and post-deployment support — they are 10–15% of total effort.
- **Do not** treat data validation as optional — it is 15% of total effort.
- **Do not** skip risk buffer — apply it always, especially for high-complexity or critical work.

---

## 19. Guardrail — When NOT to Estimate

There are two different "cannot estimate" cases. **Handle them differently** —
do not ask TDM clarifying questions about work that has nothing to do with TDM.

### A) Out of scope — not TDM work at all

The requirement is unrelated to TDM data-engineering: e.g., building an
app / website / mobile app / dashboard from scratch, ML models, infrastructure
or DevOps, authentication, payments — anything not about TDM data pipelines.

Return:
- `covered=false`
- `message`: ONE clear, friendly sentence that says it is outside what the TDM
  estimator covers and names what the tool *does* handle. Example:
  "This looks outside what the TDM estimator covers — it estimates TDM
  data-engineering work (tables, columns, ETL / Informatica, stored procedures,
  validation), not application, web, or ML builds."
- `missingInfo`: `[]` (empty — no questions).

### B) Too vague — plausibly TDM, but missing detail

The requirement could be TDM but can't be mapped yet (unclear whether it's a new
table vs a column, whether AS400 is the source, which clusters, etc.).

Return:
- `covered=false`
- `message`: "More information needed."
- `missingInfo`: a short list of specific questions, e.g.:
  - "Is this a new table or a new column on an existing table?"
  - "Is the data sourced from AS400 (does it need an Informatica Cloud job)?"
  - "Which clusters need the data — PROD1 only, or also PROD2 (Looker), PROD3 (FLP360), UAT?"
  - "What is the load frequency — full load only, or incremental (daily/weekly)?"

In **both** cases output **no tasks and no numbers**.

---

## 20. Estimation Framework Summary

To estimate any TDM requirement:

1. **Identify the work type** (new table, new column, bug fix, performance tuning, etc.)
2. **Classify complexity** (low, medium, high, critical)
3. **Select base hours** from Section 6 (work type + complexity)
4. **Add technology hours** from Section 9 (IICS, Redshift, S3, Lambda, etc.)
5. **Add cluster impact** (PROD1, PROD2, PROD3, UAT)
6. **Multiply by complexity multiplier** (1.0x, 1.5x, 2.5x, 3.0x)
7. **Break down by phase** (10% + 10% + 35% + 15% + 15% + 5% + 5% + 5%)
8. **Apply risk buffer** (10%, 20%, 30%, 40% depending on risk level)
9. **Assign confidence** (high, medium, low)
10. **Output in the standard format** (executive summary, technology impact, phase-wise, assumptions, risks, validation, recommendation)

---

## 21. Required Inputs for Every Estimation

Collect or infer these inputs before estimating:

| Input | Example | Impact |
|---|---|---|
| **Work Type** | New table, bug fix, performance tuning, etc. | Determines base hours |
| **Complexity Level** | Low / Medium / High / Critical | Drives 1.0x–3.0x multiplier |
| **Source System** | AS400, Titan, TBE, S3, API, Zero ETL | Affects Informatica/ETL effort |
| **Target Tables** | CUSTOMER_ORDERS, DIM_CUSTOMER, FACT_ORDERS | Determines table impact scope |
| **Load Type** | Full load, incremental load, one-time backfill | Affects development & testing effort |
| **Technologies Involved** | IICS, ETL Works, Redshift SP, S3, Lambda, Zero ETL | Adds to base hours |
| **Clusters Impacted** | PROD1, PROD2, PROD3, UAT | Affects validation & deployment |
| **Stored Procedure Impact** | Yes / No | May add +8–60 hours |
| **Informatica Impact** | Existing mapping change, new pipeline | May add +8–80 hours |
| **Downstream Impact** | Looker, Power BI, FLP360, application | Adds validation hours |
| **Risk Level** | Low / Medium / High / Critical | Determines buffer |

If inputs are missing, **do not block the estimate**. State the assumptions
clearly and provide a best-effort estimate with a lower confidence level.

---

## 22. Prompt Template for Estimation Requests

Use this when asking for a TDM estimate:

```
Act as a TDM Delivery Estimator for data engineering and software delivery.

Use the TDM Delivery Estimation Skill from memory. Estimate the delivery hours
for the following requirement.

REQUIREMENT:
[Paste the requirement here]

KNOWN DETAILS (fill in what you know):
- Business Context: [e.g., Canada split, TBE merge, member update, bonus correction]
- Work Type: [e.g., New table, bug fix, enhancement]
- Source System: [e.g., AS400, Titan, TBE, S3, API]
- Target Tables: [e.g., dim_member, fact_orders]
- Load Type: [e.g., Full load, incremental, one-time backfill]
- Technologies Involved: [e.g., IICS, ETL Works, Redshift, S3, Lambda, Zero ETL]
- Clusters Impacted: [e.g., PROD1, PROD2, PROD3, UAT]
- Stored Procedure Impact: [Yes/No]
- Informatica Impact: [Existing mapping change / New pipeline / None]
- Downstream Impact: [e.g., Looker, Power BI, FLP360, application]
- Validation Scope: [e.g., Counts, reconciliation, report-level, business-rule]
- Deployment Scope: [e.g., UAT only, PROD only, UAT to PROD]
- Risk Level: [Low / Medium / High / Critical]

PROVIDE:
1. Executive summary (work type, complexity, confidence, risk, estimated range, recommended estimate, final with buffer)
2. Technology-wise estimate (IICS, Redshift, S3, Lambda, etc.)
3. Phase-wise estimate (requirement analysis → post-deployment)
4. Assumptions (list all assumptions made)
5. Risks (identify risks and mitigations)
6. Validation plan (what will be tested/verified)
7. Final recommendation (one short summary + schedule recommendation)

Do not guess silently. If any detail is missing, state the assumption and
continue with a best-effort estimate. If the requirement does not map to TDM
data engineering work, use the guardrail response.
```

---

## 23. Preferred Output Tone

Use simple, clear, professional language. The estimate should be understandable
by:

- Data Architect
- Engineering Manager
- Scrum Master
- Product Owner
- Customer-facing delivery team

**Be specific to TDM**, Redshift, ETL, AWS, and downstream validation. Avoid
overly generic estimates.

Example:

> Recommended estimate: 115 hours including 20% buffer, because the work involves
> creating a new Informatica Cloud mapping, adding a table to PROD1, validating
> in all downstream clusters (PROD2, PROD3, UAT), and coordinating with Looker
> and FLP360 teams. Schedule: 6–8 weeks including development, testing, UAT,
> and post-deployment monitoring.

---

**This skill is the source of truth. All teams use these numbers and frameworks.
No estimates are made outside this skill.**
