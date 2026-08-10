import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'evaluation/fixtures/multi-source/realistic-v1');
const packet = JSON.parse(fs.readFileSync(path.join(dir, 'source-packet.json'), 'utf8'));
const sources = new Map(packet.sources.map((s) => [s.source_id, s]));

function ev(sourceId, location) {
  const s = sources.get(sourceId);
  const c = s?.citations.find((x) => x.location === location);
  if (!s || !c) throw new Error(`Unknown citation ${sourceId} ${location}`);
  return { quote: c.quote, source_name: s.source_name, source_id: s.source_id,
    source_type: s.source_type, location: c.location, ...(c.speaker ? {speaker: c.speaker} : {}),
    content_hash: s.content_hash };
}
const PB='SRC-REALISTIC-PB-001', MT='SRC-REALISTIC-MT-001', SN='SRC-REALISTIC-SN-001';
const make = (id,type,statement,status,refs,extra={}) => ({id,type,statement,status,
  priority: extra.priority ?? 'Unspecified', evidence: refs.map(([s,l])=>ev(s,l)),
  confidence: extra.confidence ?? 1, ...(extra.target?{target:extra.target}: {})});

const items = [
 make('STK-001','stakeholder','Priya Sharma is identified as the Product Manager and author of the Product Brief.','stated',[[PB,'line:3']]),
 make('PER-001','persona','Business analysts who currently export data to Excel are a target user group.','stated',[[PB,'line:11']]),
 make('PER-002','persona','Team leads who need weekly performance summaries are a target user group.','stated',[[PB,'line:12']]),
 make('PER-003','persona','Executives who want a high-level overview are a target user group.','stated',[[PB,'line:13']]),
 make('FR-001','functional_requirement','Provide an analytics dashboard that gives business users visibility into key metrics without requiring SQL or help from the data team.','stated',[[PB,'line:8']]),
 make('FR-002','functional_requirement','Display revenue, active users, churn rate, NPS score, and support ticket volume.','stated',[[PB,'line:16']]),
 make('FR-003','functional_requirement','Allow dashboard filtering by last 7 days, 30 days, 90 days, or a custom date range.','stated',[[PB,'line:17']]),
 make('FR-004','functional_requirement','Refresh dashboard data every 15 minutes rather than in real time to manage cost.','contradictory',[[PB,'line:18']]),
 make('FR-005','functional_requirement','Support role-based access so executives see all data and team leads see only their team data.','stated',[[PB,'line:19']]),
 make('FR-006','functional_requirement','Export the dashboard to PDF for monthly board reports.','stated',[[PB,'line:20']]),
 make('DEP-001','dependency','Integrate with the existing PostgreSQL data warehouse.','stated',[[PB,'line:23']]),
 make('CON-001','constraint','Do not use third-party analytics tools because of licensing cost concerns.','stated',[[PB,'line:24']]),
 make('NFR-001','non_functional_requirement','Make the dashboard accessible on mobile through responsive design.','contradictory',[[PB,'line:25']]),
 make('DDL-001','deadline','Target the dashboard launch for Q3 2026.','stated',[[PB,'line:26'],[MT,'line:24'],[SN,'line:36']]),
 make('FR-007','functional_requirement','Allow report filtering by date range, category, and status.','stated',[[MT,'line:12']]),
 make('NFR-002','non_functional_requirement','Complete report filtering in under two seconds.','stated',[[MT,'line:16']],{target:'under 2 seconds'}),
 make('FR-008','functional_requirement','Place the reporting feature on a new dedicated page.','stated',[[MT,'line:20']]),
 make('CON-002','constraint','Use the existing design system for the reporting page.','stated',[[MT,'line:20']]),
 make('STK-002','stakeholder','Sarah is the Product Manager owner for the reporting feature.','stated',[[MT,'line:24']]),
 make('DDL-002','deadline','Complete designs by the end of April.','stated',[[MT,'line:24']]),
 make('FR-009','functional_requirement','Auto-refresh dashboard data every five seconds for now.','contradictory',[[MT,'line:52'],[MT,'line:62']]),
 make('CON-003','constraint','Minimize API calls because the infrastructure cannot handle frequent calls.','contradictory',[[MT,'line:56']]),
 make('FR-010','functional_requirement','Provide real-time data freshness in response to user complaints about stale data.','contradictory',[[MT,'line:58']]),
 make('RSK-001','risk','A five-second refresh interval may cause outages under current infrastructure limits.','stated',[[MT,'line:64']]),
 make('FR-011','functional_requirement','Support both PDF and CSV export.','stated',[[MT,'line:74']]),
 make('AC-001','acceptance_criterion','Include the company logo on every page of a PDF export.','stated',[[MT,'line:74']]),
 make('AC-002','acceptance_criterion','Preserve formulas in the spreadsheet-oriented export.','stated',[[MT,'line:74']]),
 make('CON-004','constraint','Keep the user-facing export label as “Export to CSV.”','stated',[[MT,'line:82']]),
 make('DEP-002','dependency','Optimize the query layer before adding new features.','stated',[[SN,'line:10']]),
 make('CON-005','constraint','Avoid expensive dashboard queries that overload the database.','stated',[[SN,'line:10']]),
 make('CON-006','constraint','Implement analytics as its own microservice rather than adding it to the monolith.','suggested',[[SN,'line:12']]),
 make('CON-007','constraint','Use the existing events table as the data source.','suggested',[[SN,'line:14']]),
 make('CON-008','constraint','Add an index on the timestamp column to address full-table scans.','suggested',[[SN,'line:14']]),
 make('FR-012','functional_requirement','Prioritize answers and insights over merely presenting charts.','stated',[[SN,'line:22']]),
 make('CON-009','constraint','Build the dashboard as a single-page application.','contradictory',[[SN,'line:24']]),
 make('CON-010','constraint','Use server-rendered pages for SEO.','contradictory',[[SN,'line:24']]),
 make('CON-011','constraint','Prioritize desktop delivery and make mobile a fast follow.','contradictory',[[SN,'line:26']]),
 make('FR-013','functional_requirement','Provide dark mode.','suggested',[[SN,'line:28']],{priority:'Nice to Have'}),
 make('DDL-003','deadline','Deliver a basic version by the end of March for the next board meeting.','suggested',[[SN,'line:34']]),
 make('RSK-002','risk','Missing Q3 may put one of the top three enterprise accounts at risk.','stated',[[SN,'line:36']]),
 make('FR-014','functional_requirement','Predict which customers are likely to churn.','suggested',[[SN,'line:40']]),
 make('FR-015','functional_requirement','Filter all data by customer account to support multi-tenant data ownership.','stated',[[SN,'line:48']]),
 make('FR-016','functional_requirement','Support white-labeling so enterprise customers can use their own logo and colors.','suggested',[[SN,'line:50']]),
 make('FR-017','functional_requirement','Prioritize search and filtering over adding new metrics.','stated',[[SN,'line:52']]),
];
const contradictions = [
 {id:'CTR-001',description:'The specified data freshness ranges from 15-minute refreshes to five-second refreshes and real-time behavior.',item_ids:['FR-004','FR-009','FR-010'],resolution_status:'unresolved',clarification_question:'Which refresh cadence is authoritative for the dashboard?'},
 {id:'CTR-002',description:'Five-second auto-refresh conflicts with the requirement to minimize API calls and the reported outage risk.',item_ids:['FR-009','CON-003','RSK-001'],resolution_status:'unresolved',clarification_question:'What refresh mechanism and load budget can satisfy freshness without overloading infrastructure?'},
 {id:'CTR-003',description:'Mobile-responsive delivery conflicts with the proposal to make mobile a later fast follow.',item_ids:['NFR-001','CON-011'],resolution_status:'unresolved',clarification_question:'Is mobile responsiveness required at launch or after desktop launch?'},
 {id:'CTR-004',description:'The proposed single-page application conflicts with the engineering preference for server-rendered pages for SEO.',item_ids:['CON-009','CON-010'],resolution_status:'unresolved',clarification_question:'Which rendering architecture should the dashboard use?'},
];
const missing = (id,category,description,clarification_question,refs)=>({id,category,description,clarification_question,evidence:refs.map(([s,l])=>ev(s,l))});
const missing_information = [
 missing('MISS-001','scope','The dashboard layout strategy is undecided.','Should the first release support custom layouts or use a fixed layout?',[[PB,'line:29']]),
 missing('MISS-002','scope','Alerting is an open question.','Is churn-threshold alerting required?',[[PB,'line:30']]),
 missing('MISS-003','performance','The acceptable dashboard page-load target is not decided.','Is the suggested under-three-second page-load target accepted?',[[PB,'line:31']]),
 missing('MISS-004','data','The reporting data source approach is undecided.','Should reporting read live data or use precomputed warehouse data?',[[MT,'line:26'],[MT,'line:28']]),
 missing('MISS-005','scope','The requested AI capability has no defined inputs or outputs.','What data should the AI use and what output should it produce?',[[MT,'line:40'],[MT,'line:42'],[MT,'line:44']]),
 missing('MISS-006','export','CSV formula preservation may require an XLSX implementation while retaining a CSV label.','Should the export be XLSX internally while remaining labeled CSV?',[[MT,'line:76'],[MT,'line:80'],[MT,'line:82']]),
 missing('MISS-007','scope','The incomplete dashboard notes do not define the real-time behavior.','What did John mean by real-time, and is it an approved requirement?',[[MT,'line:90'],[MT,'line:91']]),
 missing('MISS-008','budget','The budget is not defined.','What budget is approved?',[[MT,'line:92']]),
 missing('MISS-009','ownership','The design follow-up owner is unknown.','Who owns the design follow-up?',[[MT,'line:94']]),
 missing('MISS-010','deadline','End-of-March, end-of-April, and Q3 dates appear to apply to different deliverables but their scope is not explicit.','Which deliverable is due at each milestone?',[[SN,'line:34'],[MT,'line:24'],[PB,'line:26']]),
 missing('MISS-011','data','Churn prediction lacks defined data availability and an accuracy target.','What data and minimum accuracy are required for churn prediction?',[[SN,'line:40'],[SN,'line:42']]),
 missing('MISS-012','scope','White-labeling scope is not decided.','Is white-labeling required for the initial release?',[[SN,'line:50']]),
];
const output={schema_version:'1.0.0',run_id:packet.run_id,extraction_status:'partial',
 summary:'Conservative unified extraction from the reviewed Product Brief, Meeting Transcripts, and Stakeholder Notes. Conflicts remain unresolved and open questions are not promoted to requirements.',
 items,contradictions,missing_information};
fs.writeFileSync(path.join(dir,'expected-requirement-extraction.json'),`${JSON.stringify(output,null,2)}\n`);
console.log(`Wrote ${items.length} items, ${contradictions.length} contradictions, and ${missing_information.length} missing-information entries.`);
