import crypto from 'node:crypto';
import fs from 'node:fs';

const output = 'workflows/n8n/prd-genie-realistic-gap-analysis-canary-v0.1.json';
const gapChildId = process.argv[2] || 'wGBE80XMjD5rTKql';
const extraction = JSON.parse(fs.readFileSync(
  'evaluation/fixtures/multi-source/realistic-v1/expected-requirement-extraction.json',
  'utf8',
));

const id = () => crypto.randomUUID();
const nodes = [
  {
    parameters: {},
    id: id(),
    name: 'Manual Trigger',
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: [-680, 0],
  },
  {
    parameters: {
      jsCode: `const extraction=${JSON.stringify(extraction)}; extraction.run_id='RUN-REALISTIC-GAP-'+Date.now(); extraction.extractor_notes=Array.isArray(extraction.extractor_notes)?extraction.extractor_notes:[]; return [{json:{schema_version:'1.0.0',run_id:extraction.run_id,extraction,orchestration_context:{parent_trace_id:Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join(''),test_id:'REALISTIC-PB-MT-SN',environment:'realistic-gap-canary'}}}];`,
    },
    id: id(),
    name: 'Load Accepted Realistic Extraction',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [-440, 0],
  },
  {
    parameters: {
      source: 'database',
      workflowId: {
        __rl: true,
        value: gapChildId,
        mode: 'list',
        cachedResultName: 'PRD Genie - Gap Analyzer Child v1.0',
      },
      mode: 'once',
      options: { waitForSubWorkflow: true },
    },
    id: id(),
    name: 'Execute Gap Analyzer Child v1.0',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1.3,
    position: [-160, 0],
  },
  {
    parameters: {
      jsCode: `const stage=$input.first().json; const source=$('Load Accepted Realistic Extraction').first().json; const x=source.extraction; const errors=[]; if(stage.run_id!==source.run_id)errors.push('run_id'); if(stage.stage!=='gap_analysis'||stage.execution_status!=='passed')errors.push('stage status'); if(stage.groundedness_percent!==100)errors.push('groundedness'); if(!stage.observability?.ingestion_accepted)errors.push('Langfuse ingestion'); if(stage.observability?.parent_trace_id!==source.orchestration_context.parent_trace_id)errors.push('parent trace'); const ga=stage.output?.gap_analysis; const gate=stage.output?.generation_gate; if(!ga||!gate)errors.push('output'); const itemIds=new Set((x.items||[]).map(v=>v.id)); const missIds=new Set((x.missing_information||[]).map(v=>v.id)); const riskIds=new Set((x.items||[]).filter(v=>v.type==='risk').map(v=>v.id)); const usedMiss=new Set(); const usedRisks=new Set(); for(const g of ga?.gaps||[]){for(const v of g.related_item_ids||[])if(!itemIds.has(v))errors.push('unknown gap item '+v); for(const v of g.source_missing_information_ids||[]){if(!missIds.has(v))errors.push('unknown missing '+v);usedMiss.add(v)}} for(const c of ga?.contradictions||[]){for(const v of c.related_item_ids||[])if(!itemIds.has(v))errors.push('unknown contradiction item '+v)} for(const r of ga?.risks||[]){for(const v of r.related_item_ids||[])if(!itemIds.has(v))errors.push('unknown risk item '+v);for(const v of r.source_risk_ids||[]){if(!riskIds.has(v))errors.push('unknown source risk '+v);usedRisks.add(v)}} const missingCoverage=[...missIds].filter(v=>!usedMiss.has(v)); if(missingCoverage.length)errors.push('missing-information coverage '+missingCoverage.join(',')); const expectedCtr=new Map((x.contradictions||[]).map(v=>[v.id,JSON.stringify([...(v.item_ids||[])].sort())])); for(const [cid,links] of expectedCtr){const got=(ga?.contradictions||[]).find(v=>v.id===cid);if(!got||JSON.stringify([...(got.related_item_ids||[])].sort())!==links)errors.push('contradiction parity '+cid)} if((ga?.contradictions||[]).some(v=>!expectedCtr.has(v.id)))errors.push('unsupported contradiction'); const missingRiskCoverage=[...riskIds].filter(v=>!usedRisks.has(v)); if(missingRiskCoverage.length)errors.push('risk coverage '+missingRiskCoverage.join(',')); if((ga?.gaps||[]).length<12)errors.push('gap count below missing-information count'); if(gate?.prd_generation_eligible!==ga?.generation_allowed)errors.push('gate eligibility'); if(stage.decision!==gate?.route)errors.push('stage decision'); if(errors.length)throw new Error('Realistic Gap Analysis canary failed: '+[...new Set(errors)].join('; ')); return [{json:{schema_version:'1.0.0',result_type:'realistic_gap_analysis_canary_result',run_id:stage.run_id,execution_status:'completed',contract_status:'passed',current_stage:'gap_analysis',next_route:stage.next_route,gap_count:ga.gaps.length,contradiction_count:ga.contradictions.length,risk_count:ga.risks.length,missing_information_coverage:usedMiss.size+'/'+missIds.size,contradiction_coverage:expectedCtr.size+'/'+expectedCtr.size,source_risk_coverage:usedRisks.size+'/'+riskIds.size,groundedness_percent:100,unsupported_claims:0,semantic_review_required:true,gap_analysis_stage:stage,recorded_at:new Date().toISOString()}}];`,
    },
    id: id(),
    name: 'Validate Realistic Gap Analysis',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [120, 0],
  },
];

const workflow = {
  name: 'PRD Genie - Realistic Gap Analysis Canary v0.1',
  nodes,
  pinData: {},
  connections: {
    'Manual Trigger': { main: [[{ node: 'Load Accepted Realistic Extraction', type: 'main', index: 0 }]] },
    'Load Accepted Realistic Extraction': { main: [[{ node: 'Execute Gap Analyzer Child v1.0', type: 'main', index: 0 }]] },
    'Execute Gap Analyzer Child v1.0': { main: [[{ node: 'Validate Realistic Gap Analysis', type: 'main', index: 0 }]] },
  },
  active: false,
  settings: { executionOrder: 'v1' },
  versionId: id(),
  meta: { templateCredsSetupCompleted: true },
  tags: [],
};

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output} for Gap Analyzer child ${gapChildId}`);
