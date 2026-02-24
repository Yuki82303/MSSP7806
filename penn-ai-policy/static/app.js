const intentOptions = document.getElementById('intentOptions');
const useCaseOptions = document.getElementById('useCaseOptions');
const scenarioOptions = document.getElementById('scenarioOptions');
const suggestionsEl = document.getElementById('suggestions');
const questionEl = document.getElementById('question');
const lookbackEl = document.getElementById('lookback');
const maxResultsEl = document.getElementById('maxResults');
const docTypeEl = document.getElementById('docType');
const sortByEl = document.getElementById('sortBy');
const agencyFilterEl = document.getElementById('agencyFilter');
const situationScenarioEl = document.getElementById('situationScenario');
const buildQuestionBtn = document.getElementById('buildQuestionBtn');
const resourceFilterEl = document.getElementById('resourceFilter');
const resourceListEl = document.getElementById('resourceList');
const triageToggleEl = document.getElementById('triageToggle');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const keywordDisplayEl = document.getElementById('keywordDisplay');
const noResultsHelpEl = document.getElementById('noResultsHelp');
const sessionNotesEl = document.getElementById('sessionNotes');
const toastEl = document.getElementById('toast');
const triageListEl = document.getElementById('triageList');
const notifyListEl = document.getElementById('notifyList');
const nextListEl = document.getElementById('nextList');
const shortlistListEl = document.getElementById('shortlistList');
const shortlistEmptyEl = document.getElementById('shortlistEmpty');
const copyBtn = document.getElementById('copyBtn');
const exportFeedbackBtn = document.getElementById('exportFeedbackBtn');
const briefBtn = document.getElementById('briefBtn');
const briefModal = document.getElementById('briefModal');
const briefTextEl = document.getElementById('briefText');
const briefClose = document.getElementById('briefClose');
const briefCopy = document.getElementById('briefCopy');
const briefDownloadTxt = document.getElementById('briefDownloadTxt');
const briefDownloadMd = document.getElementById('briefDownloadMd');

const INTENT_DATA = {
  policy: {
    label: 'Policy Updates',
    prompts: [
      'What AI or automated decision rules were proposed in the last 30 days?',
      'Which agencies issued new AI guidance or enforcement signals?',
      'Recent rules on data privacy or algorithmic accountability?',
      'Which rulemakings could affect procurement of AI tools?',
      'Any updates touching civil rights or bias mitigation?',
      'Summarize the most impactful AI policy documents this month.'
    ]
  },
  eligibility: {
    label: 'Eligibility',
    prompts: [
      'Any eligibility criteria changes for benefits programs?',
      'Which documents mention Medicaid or Medicare eligibility updates?',
      'Look for rules impacting student aid eligibility.',
      'Recent changes to veterans benefits eligibility?',
      'Identify programs tightening or expanding eligibility thresholds.',
      'What eligibility guidance was issued in the last 60 days?'
    ]
  },
  documents: {
    label: 'Documents',
    prompts: [
      'Show the latest enforcement-related documents.',
      'Find new guidance on privacy or records management.',
      'What recent notices affect reporting obligations?',
      'Identify federal register documents about audits or inspections.',
      'List recent rules that mention compliance monitoring.',
      'Surface high-impact documents in the last 45 days.'
    ]
  },
  nextsteps: {
    label: 'Next Steps',
    prompts: [
      'What should we do after these policy updates?',
      'Which actions are recommended for compliance teams?',
      'Summarize next steps for impacted programs.',
      'Identify follow-up tasks for agency guidance.',
      'What actions should leadership review?',
      'What should be added to the policy roadmap?'
    ]
  }
};

const USE_CASES = {
  resident: {
    label: 'Resident Services',
    hint: 'service delivery, resident experience, intake, forms'
  },
  safetynet: {
    label: 'Safety Net',
    hint: 'benefits eligibility, program integrity, access'
  },
  procurement: {
    label: 'Procurement & Compliance',
    hint: 'contracts, vendor risk, audits, enforcement'
  }
};

const SCENARIOS = {
  resident: [
    {
      id: 'service-changes',
      label: 'Service Changes',
      lookback: 30,
      maxResults: 20,
      prompts: [
        'What changes affect resident-facing services or intake?',
        'Any new federal guidance impacting resident communications?',
        'Which agencies updated service delivery rules this month?',
        'Find policy changes affecting resident forms or applications.',
        'What is changing for online service access?',
        'Identify documents affecting resident experience.'
      ],
      plan: {
        triage: [
          'Identify changes affecting intake, forms, or resident touchpoints.',
          'Flag any new outreach or notice requirements.'
        ],
        notify: [
          'Service Delivery Lead',
          'Communications Lead',
          'Program Manager'
        ],
        next: [
          'Update resident-facing content and FAQs.',
          'Coordinate training for frontline staff.'
        ]
      }
    },
    {
      id: 'digital-access',
      label: 'Digital Access',
      lookback: 60,
      maxResults: 25,
      prompts: [
        'Any rules affecting digital access or accessibility?',
        'Look for guidance on online identity or verification.',
        'Changes to digital service delivery standards?',
        'Documents mentioning accessibility or language access.',
        'New requirements for online portals or forms?',
        'What policies address digital inclusion?'
      ],
      plan: {
        triage: [
          'Check for accessibility or language access requirements.',
          'Assess impacts on digital portals and authentication.'
        ],
        notify: [
          'Digital Services Director',
          'Accessibility Officer',
          'IT Security Lead'
        ],
        next: [
          'Schedule accessibility review of key workflows.',
          'Update user guidance and language access plans.'
        ]
      }
    }
  ],
  safetynet: [
    {
      id: 'eligibility-shifts',
      label: 'Eligibility Shifts',
      lookback: 90,
      maxResults: 30,
      prompts: [
        'Any eligibility criteria changes for benefits programs?',
        'Which documents mention Medicaid eligibility updates?',
        'Recent changes to SNAP or TANF rules?',
        'Identify programs tightening or expanding eligibility thresholds.',
        'What eligibility guidance was issued recently?',
        'Documents affecting recertification or renewals.'
      ],
      plan: {
        triage: [
          'Map proposed eligibility changes to current rules.',
          'Check for transition timelines or phased rollouts.'
        ],
        notify: [
          'Benefits Program Owner',
          'Eligibility Operations Lead',
          'Policy Analyst'
        ],
        next: [
          'Update eligibility logic and training materials.',
          'Prepare resident notifications if changes apply.'
        ]
      }
    },
    {
      id: 'program-integrity',
      label: 'Program Integrity',
      lookback: 60,
      maxResults: 20,
      prompts: [
        'Any fraud prevention or integrity requirements?',
        'New verification or documentation standards?',
        'Rules about audits or compliance for safety net programs?',
        'Recent enforcement notices affecting benefits programs?',
        'Guidance on overpayments or recoveries?',
        'Identify integrity-related policy updates.'
      ],
      plan: {
        triage: [
          'Identify new verification or documentation requirements.',
          'Assess exposure to audit or compliance changes.'
        ],
        notify: [
          'Program Integrity Lead',
          'Compliance Officer',
          'Legal Counsel'
        ],
        next: [
          'Update verification workflows.',
          'Align audit preparation and reporting cadence.'
        ]
      }
    }
  ],
  procurement: [
    {
      id: 'ai-vendor-risk',
      label: 'AI Vendor Risk',
      lookback: 45,
      maxResults: 25,
      prompts: [
        'Any new AI procurement or vendor risk guidance?',
        'Rules affecting algorithmic accountability in contracts?',
        'Look for notices about data sharing or model transparency.',
        'Recent policy updates on automated decision tools?',
        'Which agencies issued AI compliance expectations?',
        'Documents affecting vendor oversight or audits.'
      ],
      plan: {
        triage: [
          'Identify procurement clauses impacted by AI guidance.',
          'Check for new vendor reporting requirements.'
        ],
        notify: [
          'Procurement Director',
          'Vendor Management Lead',
          'CISO or Security Officer'
        ],
        next: [
          'Update contract templates and risk questionnaires.',
          'Review vendor compliance attestations.'
        ]
      }
    },
    {
      id: 'compliance-audit',
      label: 'Compliance & Audit',
      lookback: 60,
      maxResults: 20,
      prompts: [
        'Any new audit or inspection requirements?',
        'Documents about compliance reporting changes?',
        'Notices impacting procurement oversight?',
        'Rules affecting contract monitoring or performance reviews?',
        'Enforcement updates relevant to vendors?',
        'Identify compliance policy updates.'
      ],
      plan: {
        triage: [
          'Review for new audit timelines or reporting obligations.',
          'Flag enforcement shifts affecting vendor oversight.'
        ],
        notify: [
          'Compliance Officer',
          'Internal Audit Lead',
          'Contract Manager'
        ],
        next: [
          'Adjust monitoring cadence and audit scope.',
          'Update vendor communications and attestations.'
        ]
      }
    }
  ]
};

const ACTION_PLANS = {
  privacy: {
    triage: [
      'Review data handling, retention, or sharing requirements.',
      'Identify any new privacy impact assessment expectations.'
    ],
    notify: [
      'Chief Privacy Officer',
      'Data Governance Lead',
      'Legal Counsel'
    ],
    next: [
      'Update data inventory and privacy notices.',
      'Schedule a compliance review for affected systems.'
    ]
  },
  labor: {
    triage: [
      'Check for workforce or labor standards implications.',
      'Assess impacts on staffing models or overtime policies.'
    ],
    notify: [
      'HR Director',
      'Labor Relations Lead',
      'Program Manager'
    ],
    next: [
      'Brief leadership on staffing or cost implications.',
      'Coordinate with unions or workforce partners if required.'
    ]
  },
  benefits: {
    triage: [
      'Identify eligibility or benefit delivery changes.',
      'Map changes to current program rules.'
    ],
    notify: [
      'Benefits Program Owner',
      'Eligibility Operations Lead',
      'Communications Lead'
    ],
    next: [
      'Update public guidance and staff scripts.',
      'Adjust eligibility logic in systems if needed.'
    ]
  },
  enforcement: {
    triage: [
      'Look for new enforcement priorities or penalties.',
      'Flag compliance reporting deadlines.'
    ],
    notify: [
      'Compliance Officer',
      'Risk Management Lead',
      'Legal Counsel'
    ],
    next: [
      'Run a quick gap assessment for required controls.',
      'Schedule internal audits or monitoring updates.'
    ]
  },
  civilrights: {
    triage: [
      'Check for civil rights, discrimination, or bias directives.',
      'Assess affected programs and intake pathways.'
    ],
    notify: [
      'Civil Rights Officer',
      'Program Director',
      'Legal Counsel'
    ],
    next: [
      'Update bias mitigation and accessibility checks.',
      'Plan stakeholder outreach if service changes are needed.'
    ]
  },
  procurement: {
    triage: [
      'Identify vendor, contracting, or procurement changes.',
      'Check for new certification or reporting requirements.'
    ],
    notify: [
      'Procurement Director',
      'Vendor Management Lead',
      'Security Officer'
    ],
    next: [
      'Review contracts for updated clauses.',
      'Update vendor risk assessments.'
    ]
  },
  default: {
    triage: [
      'Scan the top results and identify high-impact items.',
      'Note any deadlines or comment periods.'
    ],
    notify: [
      'Program Owner',
      'Policy Lead'
    ],
    next: [
      'Log key documents in your tracking sheet.',
      'Decide if a formal response is needed.'
    ]
  }
};

const SITUATIONS = {
  policy: {
    label: 'Policy signal',
    lookback: 30,
    maxResults: 20,
    prompt: 'What policy signals or rulemakings should Pennsylvania agencies track right now?'
  },
  benefits: {
    label: 'Benefits eligibility',
    lookback: 90,
    maxResults: 30,
    prompt: 'What changes affect benefits eligibility or program access for Pennsylvania residents?'
  },
  procurement: {
    label: 'Procurement / vendor',
    lookback: 60,
    maxResults: 25,
    prompt: 'What federal documents affect procurement, vendor oversight, or contract compliance?'
  },
  civilrights: {
    label: 'Civil rights / bias',
    lookback: 60,
    maxResults: 20,
    prompt: 'What civil rights or bias-related policy updates should we act on?'
  },
  privacy: {
    label: 'Privacy / security',
    lookback: 45,
    maxResults: 20,
    prompt: 'What privacy or security guidance impacts Pennsylvania agency operations?'
  }
};

const QUALIFIER_PLAN = {
  resident_impact: {
    triage: ['Assess resident-facing communications and service changes.'],
    notify: ['Communications Lead', 'Service Delivery Lead'],
    next: ['Prepare resident guidance and FAQ updates.']
  },
  workflow_impact: {
    triage: ['Identify operational workflow changes needed.'],
    notify: ['Operations Lead', 'Program Manager'],
    next: ['Update SOPs and staff training materials.']
  },
  vendor_involved: {
    triage: ['Review vendor obligations and contract impacts.'],
    notify: ['Vendor Management Lead', 'Procurement Director'],
    next: ['Update vendor risk assessments and clauses.']
  },
  legal_risk: {
    triage: ['Flag potential legal exposure or compliance risk.'],
    notify: ['Legal Counsel', 'Risk Management Lead'],
    next: ['Schedule legal review and compliance check.']
  },
  time_sensitive: {
    triage: ['Identify deadlines or comment periods immediately.'],
    notify: ['Policy Lead', 'Executive Sponsor'],
    next: ['Set a rapid-response review timeline.']
  }
};

const STOPWORDS = new Set([
  'a','an','the','and','or','but','if','then','than','with','for','to','of','in','on','at','by',
  'is','are','was','were','be','being','been','do','does','did','doing','should','would','could',
  'we','us','our','you','your','they','their','it','this','that','these','those','what','which','how',
  'when','where','why','who','whom','about','into','from','as','not','no','yes','any','all','new',
  'recent','latest','update','updates','rule','rules','notice','notices','document','documents'
]);

const INTENT_KEYWORDS = {
  policy: ['policy', 'guidance', 'rulemaking'],
  eligibility: ['eligibility', 'benefits', 'access'],
  documents: ['notice', 'rule', 'guidance'],
  nextsteps: ['compliance', 'timeline', 'implementation']
};

const USECASE_KEYWORDS = {
  resident: ['intake', 'forms', 'eligibility', 'services'],
  safetynet: ['medicaid', 'snap', 'tanf', 'benefits'],
  procurement: ['procurement', 'vendor', 'contract', 'oversight']
};

const SCENARIO_KEYWORDS = {
  'service-changes': ['services', 'intake', 'forms'],
  'digital-access': ['website', 'portal', 'accessibility', 'digital'],
  'eligibility-shifts': ['eligibility', 'renewal', 'recertification'],
  'program-integrity': ['fraud', 'verification', 'overpayment'],
  'ai-vendor-risk': ['algorithm', 'ai', 'vendor', 'transparency'],
  'compliance-audit': ['audit', 'inspection', 'compliance'],
  policy: ['policy', 'guidance', 'rulemaking'],
  benefits: ['eligibility', 'benefits', 'access'],
  procurement: ['procurement', 'vendor', 'contract'],
  civilrights: ['discrimination', 'equal', 'title vi', 'civil rights'],
  privacy: ['privacy', 'security', 'data']
};

const RESOURCE_DIRECTORY = [
  {
    category: 'Policy & Legal',
    agency: 'PA Office of General Counsel',
    purpose: 'Legal review and policy interpretation support.',
    url: 'https://www.ogc.pa.gov/',
    nextSteps: [
      'Request legal review for policy interpretation.',
      'Document legal guidance and required changes.'
    ]
  },
  {
    category: 'Policy & Legal',
    agency: 'PA Governor’s Office',
    purpose: 'Statewide policy directives and executive guidance.',
    url: 'https://www.governor.pa.gov/',
    nextSteps: [
      'Check for relevant executive guidance.',
      'Align agency actions with statewide policy.'
    ]
  },
  {
    category: 'Data & Privacy',
    agency: 'PA Office of Administration',
    purpose: 'Enterprise policy, data governance, and IT standards.',
    url: 'https://www.oa.pa.gov/',
    nextSteps: [
      'Validate data governance requirements.',
      'Confirm enterprise IT standards for implementation.'
    ]
  },
  {
    category: 'Data & Privacy',
    agency: 'Pennsylvania IT Security',
    purpose: 'Security policies, risk management, and standards.',
    url: 'https://www.oa.pa.gov/it/Pages/default.aspx',
    nextSteps: [
      'Initiate security assessment and risk review.',
      'Document mitigation steps and approvals.'
    ]
  },
  {
    category: 'Benefits & Human Services',
    agency: 'PA Department of Human Services',
    purpose: 'Program guidance for benefits, eligibility, and services.',
    url: 'https://www.dhs.pa.gov/',
    nextSteps: [
      'Confirm program guidance alignment.',
      'Update eligibility or service guidance materials.'
    ]
  },
  {
    category: 'Benefits & Human Services',
    agency: 'PA Department of Aging',
    purpose: 'Guidance for aging services and program eligibility.',
    url: 'https://www.aging.pa.gov/',
    nextSteps: [
      'Check for impacts to aging programs.',
      'Coordinate updates with program owners.'
    ]
  },
  {
    category: 'Civil Rights & Access',
    agency: 'PA Human Relations Commission',
    purpose: 'Civil rights compliance and nondiscrimination guidance.',
    url: 'https://www.phrc.pa.gov/',
    nextSteps: [
      'Assess civil rights implications.',
      'Update nondiscrimination and accessibility checks.'
    ]
  },
  {
    category: 'Civil Rights & Access',
    agency: 'PA Office for People With Disabilities',
    purpose: 'Accessibility and disability services guidance.',
    url: 'https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/Office-for-People-With-Disabilities.aspx',
    nextSteps: [
      'Validate accessibility requirements.',
      'Coordinate disability services considerations.'
    ]
  },
  {
    category: 'Procurement & Vendor',
    agency: 'PA Department of General Services',
    purpose: 'Procurement policy, contracts, and vendor guidance.',
    url: 'https://www.dgs.pa.gov/',
    nextSteps: [
      'Check procurement policy impacts.',
      'Update vendor contract requirements.'
    ]
  },
  {
    category: 'Procurement & Vendor',
    agency: 'PA Office of Small Business Opportunities',
    purpose: 'Supplier diversity and vendor participation guidance.',
    url: 'https://www.dgs.pa.gov/Small,%20Diverse%20Business%20and%20Veteran%20Business/Pages/default.aspx',
    nextSteps: [
      'Assess supplier diversity impacts.',
      'Update vendor outreach plans.'
    ]
  },
  {
    category: 'Labor & Workforce',
    agency: 'PA Department of Labor & Industry',
    purpose: 'Workforce policy, labor standards, and compliance.',
    url: 'https://www.dli.pa.gov/',
    nextSteps: [
      'Review labor standards implications.',
      'Coordinate with HR and workforce teams.'
    ]
  },
  {
    category: 'Transparency & Records',
    agency: 'PA Office of Open Records',
    purpose: 'Public records and transparency guidance.',
    url: 'https://www.openrecords.pa.gov/',
    nextSteps: [
      'Verify record retention and disclosure obligations.',
      'Update public records response procedures.'
    ]
  }
];

let currentIntent = 'policy';
let currentUseCase = 'resident';
let currentScenarioId = null;
let lastResults = [];
let lastFiltered = [];
let lastTags = [];
let builderQualifiers = [];
let savedAgencyFilter = '';
let allowScenarioDefaults = true;
const FEEDBACK_KEY = 'pa_navigator_feedback_v1';
const SHORTLIST_KEY = 'pa_navigator_shortlist_v1';
const SETTINGS_KEY = 'pa_navigator_settings_v1';
const SESSION_KEY = 'pa_navigator_session_v1';

const detectedTags = (title = '') => {
  const t = title.toLowerCase();
  const tags = [];
  if (/(privacy|data|surveillance|records)/.test(t)) tags.push('privacy');
  if (/(labor|employment|workforce|union|wage|overtime)/.test(t)) tags.push('labor');
  if (/(benefit|eligibility|medicare|medicaid|social security|aid)/.test(t)) tags.push('benefits');
  if (/(enforcement|penalt|compliance|inspection|investigation)/.test(t)) tags.push('enforcement');
  if (/(civil rights|discrimination|bias|equity|accessibility)/.test(t)) tags.push('civilrights');
  if (/(procurement|contract|vendor|solicitation|acquisition)/.test(t)) tags.push('procurement');
  return tags;
};

const riskFlagsFromTags = (tags) => {
  const flags = [];
  if (tags.includes('privacy')) flags.push('Privacy');
  if (tags.includes('benefits')) flags.push('Eligibility');
  if (tags.includes('civilrights')) flags.push('Civil Rights');
  if (tags.includes('procurement')) flags.push('Procurement');
  if (tags.includes('enforcement')) flags.push('Enforcement');
  return flags;
};

const confidenceFrom = (item, tags) => {
  const dateStr = item.publication_date || '';
  let daysOld = 9999;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
      const now = new Date();
      daysOld = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    }
  }
  const tagScore = tags.length;
  if (daysOld <= 30 && tagScore >= 2) return 'High';
  if (daysOld <= 90 || tagScore >= 1) return 'Medium';
  return 'Low';
};

const getScenarioList = () => SCENARIOS[currentUseCase] || [];

const getScenario = () => {
  const list = getScenarioList();
  return list.find((s) => s.id === currentScenarioId) || list[0] || null;
};

const renderScenarios = () => {
  scenarioOptions.innerHTML = '';
  const list = getScenarioList();
  if (!list.length) return;
  if (!currentScenarioId) currentScenarioId = list[0].id;
  for (const s of list) {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.scenario = s.id;
    btn.textContent = s.label;
    if (s.id === currentScenarioId) btn.classList.add('selected');
    scenarioOptions.appendChild(btn);
  }
};

const applyScenarioSettings = () => {
  const scenario = getScenario();
  if (!scenario) return;
  if (allowScenarioDefaults) {
    lookbackEl.value = scenario.lookback;
    maxResultsEl.value = scenario.maxResults;
  }
  renderSuggestions();
  updateActionPlan(lastTags);
};

const setScenario = (scenarioId) => {
  currentScenarioId = scenarioId;
  for (const btn of scenarioOptions.querySelectorAll('button')) {
    btn.classList.toggle('selected', btn.dataset.scenario === scenarioId);
  }
  applyScenarioSettings();
  persistSettings();
};

const selectDefaultScenario = () => {
  const list = getScenarioList();
  currentScenarioId = list.length ? list[0].id : null;
  renderScenarios();
  applyScenarioSettings();
};

const buildQuestionFromSituation = () => {
  const scenarioId = situationScenarioEl.value;
  const situation = SITUATIONS[scenarioId];
  const qualifiers = Array.from(
    document.querySelectorAll('.builder-qualifiers input[type="checkbox"]:checked')
  ).map((el) => el.value);
  builderQualifiers = qualifiers;
  if (!situation) return;
  lookbackEl.value = situation.lookback;
  maxResultsEl.value = situation.maxResults;
  const parts = [situation.prompt];
  if (qualifiers.includes('resident_impact')) parts.push('Focus on resident impact.');
  if (qualifiers.includes('workflow_impact')) parts.push('Note workflow or staffing implications.');
  if (qualifiers.includes('vendor_involved')) parts.push('Include vendor or contract impacts.');
  if (qualifiers.includes('legal_risk')) parts.push('Flag legal or compliance risk.');
  if (qualifiers.includes('time_sensitive')) parts.push('Prioritize time-sensitive deadlines.');
  questionEl.value = parts.join(' ');
  renderSuggestions();
  const { keywords } = extractKeywords(questionEl.value);
  showKeywords(keywords);
  updateActionPlan(lastTags);
  persistSettings();
};

const renderSuggestions = () => {
  suggestionsEl.innerHTML = '';
  const scenario = getScenario();
  const prompts = scenario && scenario.prompts && scenario.prompts.length
    ? scenario.prompts
    : INTENT_DATA[currentIntent].prompts;
  for (const p of prompts) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = p;
    b.addEventListener('click', () => {
      questionEl.value = p;
      questionEl.focus();
    });
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        b.click();
      }
    });
    suggestionsEl.appendChild(b);
  }
};

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const getDerivedKeywords = () => {
  const intentKeys = INTENT_KEYWORDS[currentIntent] || [];
  const usecaseKeys = USECASE_KEYWORDS[currentUseCase] || [];
  const scenario = getScenario();
  const scenarioKeys = scenario ? (SCENARIO_KEYWORDS[scenario.id] || []) : [];
  const situationKeys = SCENARIO_KEYWORDS[situationScenarioEl.value] || [];
  const combined = [...intentKeys, ...usecaseKeys, ...scenarioKeys, ...situationKeys];
  const uniq = [...new Set(combined.filter(Boolean))];
  return uniq.slice(0, 4);
};

const extractKeywords = (text) => {
  const normalized = normalizeText(text || '');
  const terms = normalized.split(' ').filter((t) => t && !STOPWORDS.has(t));
  const counts = new Map();
  for (const t of terms) {
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.map(([t]) => t).slice(0, 8);
  const derived = getDerivedKeywords();
  const merged = [...new Set([...top, ...derived])];
  return {
    keywords: merged.slice(0, 10),
    derived
  };
};

const showKeywords = (keywords) => {
  if (!keywords.length) {
    keywordDisplayEl.textContent = '';
    return;
  }
  keywordDisplayEl.textContent = `Search keywords: ${keywords.join(', ')}`;
};

const showError = (message) => {
  statusEl.textContent = message;
  statusEl.classList.add('error');
  noResultsHelpEl.classList.add('hidden');
};

const clearError = () => {
  statusEl.classList.remove('error');
};

const updateActionPlan = (tags) => {
  const plan = {
    triage: [],
    notify: [],
    next: []
  };

  const scenario = getScenario();
  if (scenario && scenario.plan) {
    plan.triage.push(...scenario.plan.triage);
    plan.notify.push(...scenario.plan.notify);
    plan.next.push(...scenario.plan.next);
  }

  for (const q of builderQualifiers) {
    const extra = QUALIFIER_PLAN[q];
    if (!extra) continue;
    plan.triage.push(...extra.triage);
    plan.notify.push(...extra.notify);
    plan.next.push(...extra.next);
  }

  const shortlist = Object.values(loadShortlist());
  if (shortlist.length) {
    plan.triage.unshift(`Prioritize ${shortlist.length} shortlisted item(s) for review.`);
  }

  const tagList = tags.length ? tags : (scenario && scenario.plan ? [] : ['default']);

  for (const tag of tagList) {
    const section = ACTION_PLANS[tag] || ACTION_PLANS.default;
    plan.triage.push(...section.triage);
    plan.notify.push(...section.notify);
    plan.next.push(...section.next);
  }

  const uniq = (arr) => [...new Set(arr)];

  triageListEl.innerHTML = '';
  notifyListEl.innerHTML = '';
  nextListEl.innerHTML = '';

  for (const item of uniq(plan.triage)) {
    const li = document.createElement('li');
    li.textContent = item;
    triageListEl.appendChild(li);
  }
  for (const item of uniq(plan.notify)) {
    const li = document.createElement('li');
    li.textContent = item;
    notifyListEl.appendChild(li);
  }
  for (const item of uniq(plan.next)) {
    const li = document.createElement('li');
    li.textContent = item;
    nextListEl.appendChild(li);
  }
};

const appendResourceSteps = (resource) => {
  builderQualifiers = builderQualifiers || [];
  const extra = {
    triage: [`Review ${resource.agency} guidance for this issue.`],
    notify: [`Coordinate with ${resource.agency} liaison.`],
    next: resource.nextSteps
  };
  const uniq = (arr) => [...new Set(arr)];
  const triage = uniq([...(Array.from(triageListEl.querySelectorAll('li')).map((li) => li.textContent)), ...extra.triage]);
  const notify = uniq([...(Array.from(notifyListEl.querySelectorAll('li')).map((li) => li.textContent)), ...extra.notify]);
  const next = uniq([...(Array.from(nextListEl.querySelectorAll('li')).map((li) => li.textContent)), ...extra.next]);

  triageListEl.innerHTML = '';
  notifyListEl.innerHTML = '';
  nextListEl.innerHTML = '';

  for (const item of triage) {
    const li = document.createElement('li');
    li.textContent = item;
    triageListEl.appendChild(li);
  }
  for (const item of notify) {
    const li = document.createElement('li');
    li.textContent = item;
    notifyListEl.appendChild(li);
  }
  for (const item of next) {
    const li = document.createElement('li');
    li.textContent = item;
    nextListEl.appendChild(li);
  }
};

const renderResources = (filterText = '') => {
  const q = filterText.trim().toLowerCase();
  const groups = {};
  for (const r of RESOURCE_DIRECTORY) {
    const hay = `${r.category} ${r.agency} ${r.purpose}`.toLowerCase();
    if (q && !hay.includes(q)) continue;
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  }

  resourceListEl.innerHTML = '';
  const categories = Object.keys(groups);
  if (!categories.length) {
    const empty = document.createElement('div');
    empty.className = 'resource-meta';
    empty.textContent = 'No resources match this filter.';
    resourceListEl.appendChild(empty);
    return;
  }

  for (const cat of categories) {
    const section = document.createElement('div');
    section.className = 'resource-category';
    const h = document.createElement('h3');
    h.textContent = cat;
    section.appendChild(h);
    for (const r of groups[cat]) {
      const card = document.createElement('div');
      card.className = 'resource-card';
      const title = document.createElement('div');
      title.textContent = r.agency;
      const meta = document.createElement('div');
      meta.className = 'resource-meta';
      meta.textContent = r.purpose;
      const actions = document.createElement('div');
      actions.className = 'resource-actions';
      const link = document.createElement('a');
      link.href = r.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Open';
      link.addEventListener('click', () => recordClick(link.href));
      const useBtn = document.createElement('button');
      useBtn.type = 'button';
      useBtn.textContent = 'Use this resource';
      useBtn.addEventListener('click', () => appendResourceSteps(r));
      useBtn.addEventListener('click', async () => {
        window.open(r.url, '_blank', 'noopener');
        try {
          await navigator.clipboard.writeText(r.url);
          showToast('Link opened + copied');
        } catch {
          showToast('Link opened');
        }
        recordClick(r.url);
      });
      actions.appendChild(link);
      actions.appendChild(useBtn);
      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(actions);
      section.appendChild(card);
    }
    resourceListEl.appendChild(section);
  }
};

const renderResults = (items) => {
  resultsEl.innerHTML = '';
  clearError();
  noResultsHelpEl.classList.add('hidden');
  if (!items.length) {
    statusEl.textContent = 'No results found for the selected window.';
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Try expanding the lookback window, changing the document type, or refining your query.';
    resultsEl.appendChild(empty);
    noResultsHelpEl.classList.remove('hidden');
    updateActionPlan([]);
    return;
  }

  statusEl.textContent = `Showing ${items.length} result(s).`;

  const tagsSeen = new Set();

  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = item.html_url || '#';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = item.title || 'Untitled document';
    link.addEventListener('click', () => recordClick(link.href));
    title.appendChild(link);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const agencies = (item.agency_names || []).join(', ');
    const date = item.publication_date || 'Unknown date';
    const type = item.type || 'Unknown type';
    meta.textContent = `${date} | ${agencies || 'Unknown agency'} | ${type}`;

    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'tags';
    const tags = detectedTags(item.title || '');
    const showTags = tags.length ? tags : ['policy'];
    for (const tag of showTags) {
      tagsSeen.add(tag);
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag.replace('civilrights', 'Civil Rights').replace('policy', 'Policy');
      tagsWrap.appendChild(span);
    }

    const riskWrap = document.createElement('div');
    riskWrap.className = 'risk-flags';
    const risks = riskFlagsFromTags(tags);
    for (const risk of risks) {
      const r = document.createElement('span');
      r.className = 'risk';
      r.textContent = risk;
      riskWrap.appendChild(r);
    }
    const confidence = document.createElement('span');
    confidence.className = 'confidence';
    confidence.textContent = `Confidence: ${confidenceFrom(item, tags)}`;
    riskWrap.appendChild(confidence);

    const impactWrap = document.createElement('div');
    impactWrap.className = 'impact-toggle';
    const impactLabel = document.createElement('span');
    impactLabel.textContent = 'High impact';
    const impactBtn = document.createElement('button');
    impactBtn.type = 'button';
    impactBtn.textContent = 'Toggle';
    const shortlist = loadShortlist();
    if (shortlist[feedbackId(item)]) impactBtn.classList.add('selected');
    impactBtn.addEventListener('click', () => {
      const current = loadShortlist();
      const isSelected = !!current[feedbackId(item)];
      impactBtn.classList.toggle('selected', !isSelected);
      setShortlist(item, !isSelected);
    });
    impactWrap.appendChild(impactLabel);
    impactWrap.appendChild(impactBtn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(tagsWrap);
    card.appendChild(riskWrap);
    card.appendChild(impactWrap);
    card.appendChild(renderFeedback(item));
    resultsEl.appendChild(card);
  }

  lastTags = [...tagsSeen];
  updateActionPlan(lastTags);
};

const loadFeedback = () => {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveFeedback = (data) => {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(data));
};

const loadShortlist = () => {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveShortlist = (data) => {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(data));
};

const setShortlist = (item, isHighImpact) => {
  const data = loadShortlist();
  const id = feedbackId(item);
  if (isHighImpact) {
    data[id] = {
      id,
      title: item.title || '',
      publication_date: item.publication_date || '',
      agency_names: item.agency_names || [],
      html_url: item.html_url || '',
      updated_at: new Date().toISOString()
    };
  } else {
    delete data[id];
  }
  saveShortlist(data);
  updateSession({ shortlisted_items: Object.values(data) });
  renderShortlist();
  updateActionPlan(lastTags);
};

const renderShortlist = () => {
  const data = loadShortlist();
  const items = Object.values(data);
  shortlistListEl.innerHTML = '';
  if (!items.length) {
    shortlistEmptyEl.style.display = 'block';
    return;
  }
  shortlistEmptyEl.style.display = 'none';
  for (const item of items) {
    const li = document.createElement('li');
    const title = document.createElement('span');
    title.textContent = item.title || 'Untitled document';
    const open = document.createElement('a');
    open.href = item.html_url || '#';
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = 'Open';
    open.style.marginLeft = '6px';
    open.addEventListener('click', () => recordClick(open.href));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.className = 'ghost';
    remove.style.marginLeft = '8px';
    remove.addEventListener('click', () => {
      const current = loadShortlist();
      delete current[item.id];
      saveShortlist(current);
      renderShortlist();
      updateActionPlan(lastTags);
    });
    li.appendChild(title);
    li.appendChild(open);
    li.appendChild(remove);
    shortlistListEl.appendChild(li);
  }
};

const feedbackId = (item) => {
  if (item.document_number) return `doc:${item.document_number}`;
  if (item.html_url) return `url:${item.html_url}`;
  return `title:${item.title || 'unknown'}`;
};

const setFeedback = (item, value, comment) => {
  const data = loadFeedback();
  const id = feedbackId(item);
  data[id] = {
    id,
    title: item.title || '',
    publication_date: item.publication_date || '',
    agency_names: item.agency_names || [],
    html_url: item.html_url || '',
    relevance: value,
    comment: comment || '',
    updated_at: new Date().toISOString()
  };
  saveFeedback(data);
};

const renderFeedback = (item) => {
  const wrap = document.createElement('div');
  wrap.className = 'feedback';

  const buttons = document.createElement('div');
  buttons.className = 'feedback-buttons';

  const relevantBtn = document.createElement('button');
  relevantBtn.type = 'button';
  relevantBtn.textContent = 'Relevant';

  const notRelevantBtn = document.createElement('button');
  notRelevantBtn.type = 'button';
  notRelevantBtn.textContent = 'Not relevant';

  const comment = document.createElement('textarea');
  comment.placeholder = 'Optional comment';

  const data = loadFeedback();
  const id = feedbackId(item);
  if (data[id]) {
    if (data[id].relevance === 'relevant') relevantBtn.classList.add('selected');
    if (data[id].relevance === 'not_relevant') notRelevantBtn.classList.add('selected');
    comment.value = data[id].comment || '';
  }

  relevantBtn.addEventListener('click', () => {
    relevantBtn.classList.add('selected');
    notRelevantBtn.classList.remove('selected');
    setFeedback(item, 'relevant', comment.value);
  });

  notRelevantBtn.addEventListener('click', () => {
    notRelevantBtn.classList.add('selected');
    relevantBtn.classList.remove('selected');
    setFeedback(item, 'not_relevant', comment.value);
  });

  comment.addEventListener('input', () => {
    const current = data[id] ? data[id].relevance : '';
    if (current) setFeedback(item, current, comment.value);
  });

  buttons.appendChild(relevantBtn);
  buttons.appendChild(notRelevantBtn);
  wrap.appendChild(buttons);
  wrap.appendChild(comment);
  return wrap;
};

const setIntent = (intent) => {
  currentIntent = intent;
  for (const btn of intentOptions.querySelectorAll('button')) {
    btn.classList.toggle('selected', btn.dataset.intent === intent);
  }
  renderSuggestions();
  persistSettings();
};

const setUseCase = (usecase) => {
  currentUseCase = usecase;
  for (const btn of useCaseOptions.querySelectorAll('button')) {
    btn.classList.toggle('selected', btn.dataset.usecase === usecase);
  }
  selectDefaultScenario();
  persistSettings();
};

const populateAgencyFilter = (items) => {
  const agencies = new Set();
  for (const item of items) {
    for (const a of item.agency_names || []) {
      agencies.add(a);
    }
  }
  const sorted = [...agencies].sort((a, b) => a.localeCompare(b));
  agencyFilterEl.innerHTML = '<option value="">All agencies</option>';
  for (const a of sorted) {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    agencyFilterEl.appendChild(opt);
  }
  if (savedAgencyFilter && sorted.includes(savedAgencyFilter)) {
    agencyFilterEl.value = savedAgencyFilter;
  } else {
    savedAgencyFilter = '';
  }
};

const applyFilters = () => {
  const docType = docTypeEl.value;
  const agency = agencyFilterEl.value;
  const sortBy = sortByEl.value;

  let items = [...lastResults];

  if (docType) {
    items = items.filter((i) => (i.type || '') === docType);
  }

  if (agency) {
    items = items.filter((i) => (i.agency_names || []).includes(agency));
  }

  if (sortBy === 'recent') {
    items.sort((a, b) => (b.publication_date || '').localeCompare(a.publication_date || ''));
  } else {
    const q = questionEl.value.trim().toLowerCase();
    items.sort((a, b) => score(b, q) - score(a, q));
  }

  lastFiltered = items;
  renderResults(items);
  updateSession({ results: items });
};

const score = (item, query) => {
  if (!query) return 0;
  const title = (item.title || '').toLowerCase();
  let s = 0;
  for (const term of query.split(/\s+/)) {
    if (!term) continue;
    if (title.includes(term)) s += 2;
  }
  return s;
};

const fetchResults = async (query, lookback, maxResults) => {
  const params = new URLSearchParams({
    q: query,
    lookback_days: lookback,
    max_results: maxResults
  });
  const res = await fetch(`/api/search?${params.toString()}`);
  if (!res.ok) {
    return { ok: false, error: `Server error: ${res.status}` };
  }
  const data = await res.json();
  if (data.ok === false) {
    return { ok: false, error: data.error || 'Upstream error' };
  }
  return { ok: true, results: data.results || [] };
};

const doSearch = async () => {
  const q = questionEl.value.trim();
  const lookback = lookbackEl.value || '30';
  const maxResults = maxResultsEl.value || '20';

  statusEl.textContent = 'Searching...';
  resultsEl.innerHTML = '';
  searchBtn.disabled = true;
  document.body.classList.add('loading');
  clearError();

  try {
    const { keywords, derived } = extractKeywords(q);
    const searchKeywords = keywords.length ? keywords : derived;
    showKeywords(searchKeywords);
    if (!searchKeywords.length) {
      showError('Please add a few keywords or use the Situation Builder.');
      return;
    }

    const query = searchKeywords.join(' ');
    let response = await fetchResults(query, lookback, maxResults);
    if (!response.ok) {
      showError(response.error);
      return;
    }

    if (response.results.length === 0 && derived.length) {
      const fallbackQuery = derived.join(' ');
      response = await fetchResults(fallbackQuery, lookback, maxResults);
    }

    lastResults = response.results || [];
    populateAgencyFilter(lastResults);
    applyFilters();
    updateSession({
      selections: {
        intent: currentIntent,
        usecase: currentUseCase,
        scenario: getScenario() ? getScenario().label : '',
        qualifiers: builderQualifiers
      },
      extracted_keywords: searchKeywords,
      search_params: {
        lookback_days: lookback,
        max_results: maxResults,
        doc_type: docTypeEl.value,
        sort: sortByEl.value,
        agency: agencyFilterEl.value
      },
      results: lastFiltered
    });
  } catch (err) {
    showError(`Error: ${err.message}`);
  } finally {
    searchBtn.disabled = false;
    document.body.classList.remove('loading');
  }
};

const buildSummary = () => {
  const q = questionEl.value.trim() || '(no question entered)';
  const shortlist = Object.values(loadShortlist());
  const top = (shortlist.length ? shortlist : lastFiltered).slice(0, 5);
  const lines = [];
  lines.push(`Intent: ${INTENT_DATA[currentIntent].label}`);
  lines.push(`Use-case: ${USE_CASES[currentUseCase].label}`);
  lines.push(`Scenario: ${getScenario() ? getScenario().label : 'N/A'}`);
  lines.push(`Lookback days: ${lookbackEl.value}`);
  lines.push(`Question: ${q}`);
  lines.push('Top results:');
  if (top.length === 0) {
    lines.push('- (none)');
  } else {
    for (const item of top) {
      const date = item.publication_date || 'Unknown date';
      const agency = (item.agency_names || []).join(', ') || 'Unknown agency';
      const title = item.title || 'Untitled document';
      const url = item.html_url || '';
      lines.push(`- ${date} | ${agency} | ${title}${url ? ' | ' + url : ''}`);
    }
  }
  lines.push('Action Plan:');
  lines.push('Triage:');
  for (const li of triageListEl.querySelectorAll('li')) {
    lines.push(`- ${li.textContent}`);
  }
  lines.push('Who to notify:');
  for (const li of notifyListEl.querySelectorAll('li')) {
    lines.push(`- ${li.textContent}`);
  }
  lines.push('Next actions:');
  for (const li of nextListEl.querySelectorAll('li')) {
    lines.push(`- ${li.textContent}`);
  }
  return lines.join('\n');
};

const copySummary = async () => {
  const text = buildSummary();
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = 'Copy summary'; }, 1400);
  } catch (err) {
    copyBtn.textContent = 'Copy failed';
    setTimeout(() => { copyBtn.textContent = 'Copy summary'; }, 1400);
  }
};

const persistSettings = () => {
  const settings = {
    intent: currentIntent,
    usecase: currentUseCase,
    scenario: currentScenarioId,
    lookback: lookbackEl.value,
    maxResults: maxResultsEl.value,
    docType: docTypeEl.value,
    sortBy: sortByEl.value,
    agency: agencyFilterEl.value,
    triageView: triageToggleEl.checked,
    situationScenario: situationScenarioEl.value
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  updateSession({
    selections: {
      intent: currentIntent,
      usecase: currentUseCase,
      scenario: getScenario() ? getScenario().label : '',
      qualifiers: builderQualifiers
    }
  });
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const applySettings = () => {
  const settings = loadSettings();
  if (!settings) return;
  allowScenarioDefaults = false;
  if (settings.intent && INTENT_DATA[settings.intent]) currentIntent = settings.intent;
  if (settings.usecase && USE_CASES[settings.usecase]) currentUseCase = settings.usecase;
  if (settings.scenario) currentScenarioId = settings.scenario;
  if (settings.lookback) lookbackEl.value = settings.lookback;
  if (settings.maxResults) maxResultsEl.value = settings.maxResults;
  if (settings.docType) docTypeEl.value = settings.docType;
  if (settings.sortBy) sortByEl.value = settings.sortBy;
  if (settings.situationScenario) situationScenarioEl.value = settings.situationScenario;
  if (settings.triageView) {
    triageToggleEl.checked = true;
    document.body.classList.add('triage');
  }
  savedAgencyFilter = settings.agency || '';
};

const resetAll = () => {
  questionEl.value = '';
  lookbackEl.value = '30';
  maxResultsEl.value = '20';
  docTypeEl.value = '';
  sortByEl.value = 'recent';
  agencyFilterEl.value = '';
  savedAgencyFilter = '';
  triageToggleEl.checked = false;
  document.body.classList.remove('triage');
  situationScenarioEl.value = 'policy';
  document.querySelectorAll('.builder-qualifiers input[type="checkbox"]').forEach((el) => {
    el.checked = false;
  });
  builderQualifiers = [];
  statusEl.textContent = '';
  resultsEl.innerHTML = '';
  keywordDisplayEl.textContent = '';
  noResultsHelpEl.classList.add('hidden');
  lastTags = [];
  selectDefaultScenario();
  updateActionPlan([]);
  persistSettings();
};

const loadSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {
      timestamp: new Date().toISOString(),
      selections: {},
      extracted_keywords: [],
      search_params: {},
      results: [],
      clicked_urls: [],
      shortlisted_items: [],
      user_notes: ''
    };
  } catch {
    return {
      timestamp: new Date().toISOString(),
      selections: {},
      extracted_keywords: [],
      search_params: {},
      results: [],
      clicked_urls: [],
      shortlisted_items: [],
      user_notes: ''
    };
  }
};

const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const updateSession = (updates) => {
  const session = loadSession();
  const merged = { ...session, ...updates };
  merged.timestamp = new Date().toISOString();
  saveSession(merged);
  return merged;
};

const recordClick = (url) => {
  if (!url) return;
  const session = loadSession();
  const clicked = new Set(session.clicked_urls || []);
  clicked.add(url);
  updateSession({ clicked_urls: [...clicked] });
};

const showToast = (message) => {
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 1600);
};

const qualifierLabel = (q) => {
  if (q === 'resident_impact') return 'Resident impact';
  if (q === 'workflow_impact') return 'Workflow impact';
  if (q === 'vendor_involved') return 'Vendor involved';
  if (q === 'legal_risk') return 'High legal risk';
  if (q === 'time_sensitive') return 'Time-sensitive';
  return q;
};

const buildBrief = (format = 'text') => {
  const scenario = getScenario();
  const shortlist = Object.values(loadShortlist());
  const top = shortlist.length ? shortlist.slice(0, 3) : lastFiltered.slice(0, 3);
  const qualifiers = builderQualifiers.map(qualifierLabel);
  const lines = [];
  const h = (t) => (format === 'md' ? `## ${t}` : t);
  const b = (t) => (format === 'md' ? `**${t}**` : t);

  lines.push(format === 'md' ? '# 2-minute brief' : '2-minute brief');
  lines.push(`${b('Intent')}: ${INTENT_DATA[currentIntent].label}`);
  lines.push(`${b('Use-case')}: ${USE_CASES[currentUseCase].label}`);
  lines.push(`${b('Scenario')}: ${scenario ? scenario.label : 'N/A'}`);
  lines.push(`${b('Qualifiers')}: ${qualifiers.length ? qualifiers.join(', ') : 'None'}`);
  lines.push('');
  lines.push(h(shortlist.length ? 'Shortlisted items' : 'Top items'));
  if (top.length === 0) {
    lines.push('- (none)');
  } else {
    for (const item of top) {
      const date = item.publication_date || 'Unknown date';
      const agency = (item.agency_names || []).join(', ') || 'Unknown agency';
      const title = item.title || 'Untitled document';
      const url = item.html_url || '';
      const line = `${date} | ${agency} | ${title}${url ? ' | ' + url : ''}`;
      lines.push(format === 'md' ? `- ${line}` : `- ${line}`);
    }
  }
  lines.push('');
  lines.push(h('Action Plan'));
  lines.push(b('Triage'));
  for (const li of triageListEl.querySelectorAll('li')) {
    lines.push(`- ${li.textContent}`);
  }
  lines.push(b('Who to notify'));
  for (const li of notifyListEl.querySelectorAll('li')) {
    lines.push(`- ${li.textContent}`);
  }
  lines.push(b('Next actions'));
  for (const li of nextListEl.querySelectorAll('li')) {
    lines.push(`- ${li.textContent}`);
  }
  return lines.join('\n');
};

const openBriefModal = () => {
  briefTextEl.textContent = buildBrief('text');
  briefModal.classList.remove('hidden');
};

const closeBriefModal = () => {
  briefModal.classList.add('hidden');
};

const copyBrief = async () => {
  const text = briefTextEl.textContent || '';
  try {
    await navigator.clipboard.writeText(text);
    briefCopy.textContent = 'Copied';
    setTimeout(() => { briefCopy.textContent = 'Copy brief'; }, 1400);
  } catch {
    briefCopy.textContent = 'Copy failed';
    setTimeout(() => { briefCopy.textContent = 'Copy brief'; }, 1400);
  }
};

const downloadBrief = (ext) => {
  const isMd = ext === 'md';
  const text = buildBrief(isMd ? 'md' : 'text');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pa-navigator-brief.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

intentOptions.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  setIntent(btn.dataset.intent);
});

useCaseOptions.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  setUseCase(btn.dataset.usecase);
});

scenarioOptions.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  setScenario(btn.dataset.scenario);
});

buildQuestionBtn.addEventListener('click', buildQuestionFromSituation);
resourceFilterEl.addEventListener('input', (e) => renderResources(e.target.value));
triageToggleEl.addEventListener('change', (e) => {
  document.body.classList.toggle('triage', e.target.checked);
  persistSettings();
});
sessionNotesEl.addEventListener('input', () => {
  updateSession({ user_notes: sessionNotesEl.value || '' });
});

searchBtn.addEventListener('click', doSearch);
questionEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    doSearch();
  }
});

docTypeEl.addEventListener('change', applyFilters);
agencyFilterEl.addEventListener('change', () => {
  savedAgencyFilter = agencyFilterEl.value;
  applyFilters();
});
sortByEl.addEventListener('change', applyFilters);
resetBtn.addEventListener('click', resetAll);
lookbackEl.addEventListener('change', persistSettings);
maxResultsEl.addEventListener('change', persistSettings);
docTypeEl.addEventListener('change', persistSettings);
sortByEl.addEventListener('change', persistSettings);
agencyFilterEl.addEventListener('change', persistSettings);
situationScenarioEl.addEventListener('change', persistSettings);

copyBtn.addEventListener('click', copySummary);
exportFeedbackBtn.addEventListener('click', () => {
  const session = updateSession({
    selections: {
      intent: currentIntent,
      usecase: currentUseCase,
      scenario: getScenario() ? getScenario().label : '',
      qualifiers: builderQualifiers
    },
    extracted_keywords: (keywordDisplayEl.textContent || '').replace('Search keywords: ', '').split(', ').filter(Boolean),
    search_params: {
      lookback_days: lookbackEl.value,
      max_results: maxResultsEl.value,
      doc_type: docTypeEl.value,
      sort: sortByEl.value,
      agency: agencyFilterEl.value
    },
    results: lastFiltered,
    shortlisted_items: Object.values(loadShortlist()),
    user_notes: sessionNotesEl.value || ''
  });
  const payload = {
    session,
    feedback: loadFeedback()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pa-navigator-feedback.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

briefBtn.addEventListener('click', openBriefModal);
briefClose.addEventListener('click', closeBriefModal);
briefCopy.addEventListener('click', copyBrief);
briefDownloadTxt.addEventListener('click', () => downloadBrief('txt'));
briefDownloadMd.addEventListener('click', () => downloadBrief('md'));
briefModal.addEventListener('click', (e) => {
  if (e.target === briefModal) closeBriefModal();
});

applySettings();
setIntent(currentIntent);
setUseCase(currentUseCase);
if (currentScenarioId) {
  setScenario(currentScenarioId);
} else {
  selectDefaultScenario();
}
updateActionPlan([]);
renderResources();
renderShortlist();
allowScenarioDefaults = true;
const session = loadSession();
if (session.user_notes) sessionNotesEl.value = session.user_notes;
if (session.extracted_keywords && session.extracted_keywords.length) {
  showKeywords(session.extracted_keywords);
}
