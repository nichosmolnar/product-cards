import * as d3 from 'd3';

// --- Constants ---

const DATA_DIR = 'data';
const SCALE = 0.8;

const CARD_CYCLE_SVGS = [
  'svg-cycle/hemp-svg-01.svg',
  'svg-cycle/hemp-svg-02.svg',
  'svg-cycle/hemp-svg-03.svg',
];

const TOTAL_CANNABINOIDS =
  'Total Cannabinoids (%) AU Raw Plant Material - Final Form';
const TOTAL_TERPENES =
  'Total Terpenes (%) AU Raw Plant Material - Final Form';

const CHART_VIEWBOX = { width: s(453), height: s(600) };

const CHART_LAYOUT = {
  terpenes: { cx: s(137.2), cy: s(188), outerRadius: s(137.2) },
  cannabinoids: { cx: s(352.3), cy: s(402), outerRadius: s(100.7) },
};

const CANNABINOID_ORDER = [
  'thca',
  'cbda',
  'cbga',
  'cbd',
  'cbg',
  'cbc',
  'thcv',
  'delta-9-thc',
  'cbn',
];

const TERPENE_ORDER = [
  'beta-caryophyllene',
  'caryophyllene-oxide',
  'alpha-humulene',
  'guaiol',
  'trans-beta-farnesene',
  'alpha-pinene',
  'beta-pinene',
  'beta-myrcene',
  'd-limonene',
  'terpinolene',
  'alpha-phellandrene',
  'fenchol',
  'eucalyptol',
  'valencene',
  'linalool',
  'terpineol',
  'alpha-bisabolol',
  'cis-beta-ocimene',
  'trans-beta-ocimene',
];

const ORDER_BY_CHART = {
  cannabinoids: CANNABINOID_ORDER,
  terpenes: TERPENE_ORDER,
};

/** Keyed by `chemical` column in chemical_effects_flavors.csv */
const CHEMICAL_META = {
  'alpha-bisabolol': {
    commonName: 'Bisabolol',
    flavor: 'floral',
    scent: 'chamomile',
    effects: ['anti-inflammatory', 'calming'],
  },
  'alpha-humulene': {
    commonName: 'Humulene',
    flavor: 'earthy',
    scent: 'hoppy',
    effects: ['anti-inflammatory', 'appetite-suppressant'],
  },
  'alpha-phellandrene': {
    commonName: 'Phellandrene',
    flavor: 'minty',
    scent: 'woody',
    effects: ['antidepressant', 'analgesic'],
  },
  'alpha-pinene': {
    commonName: 'Alpha-Pinene',
    flavor: 'piney',
    scent: 'fresh',
    effects: ['alertness', 'memory-aid'],
  },
  'beta-caryophyllene': {
    commonName: 'Caryophyllene',
    flavor: 'peppery',
    scent: 'spicy',
    effects: ['anti-inflammatory', 'analgesic'],
  },
  'beta-myrcene': {
    commonName: 'Myrcene',
    flavor: 'earthy',
    scent: 'musky',
    effects: ['sleep', 'muscle-relaxant'],
  },
  'beta-pinene': {
    commonName: 'Beta-Pinene',
    flavor: 'herbal',
    scent: 'piney',
    effects: ['alertness', 'bronchodilator'],
  },
  'caryophyllene-oxide': {
    commonName: 'Caryophyllene Oxide',
    flavor: 'woody',
    scent: 'dry',
    effects: ['anti-inflammatory', 'analgesic'],
  },
  'cis-beta-ocimene': {
    commonName: 'Cis-beta-Ocimene',
    flavor: 'sweet',
    scent: 'herbal',
    effects: ['anti-inflammatory', 'decongestant'],
  },
  'd-limonene': {
    commonName: 'Limonene',
    flavor: 'citrus',
    scent: 'lemon',
    effects: ['mood-elevating', 'anti-anxiety'],
  },
  eucalyptol: {
    commonName: 'Eucalyptol',
    flavor: 'minty',
    scent: 'cooling',
    effects: ['anti-inflammatory', 'decongestant'],
  },
  fenchol: {
    commonName: 'Fenchol',
    flavor: 'sweet',
    scent: 'herbal',
    effects: ['antioxidant', 'anti-anxiety'],
  },
  guaiol: {
    commonName: 'Guaiol',
    flavor: 'piney',
    scent: 'floral',
    effects: ['anti-inflammatory', 'antioxidant'],
  },
  linalool: {
    commonName: 'Linalool',
    flavor: 'floral',
    scent: 'lavender',
    effects: ['anxiolytic', 'sleep'],
  },
  terpineol: {
    commonName: 'Terpineol',
    flavor: 'floral',
    scent: 'lilac',
    effects: ['sleep', 'antioxidant'],
  },
  terpinolene: {
    commonName: 'Terpinolene',
    flavor: 'piney',
    scent: 'floral',
    effects: ['mood-boosting', 'sleep'],
  },
  'trans-beta-farnesene': {
    commonName: 'Farnesene',
    flavor: 'fruity',
    scent: 'green-apple',
    effects: ['anti-inflammatory', 'mood-elevating'],
  },
  'trans-beta-ocimene': {
    commonName: 'Trans-beta-Ocimene',
    flavor: 'sweet',
    scent: 'herbal',
    effects: ['anti-inflammatory', 'decongestant'],
  },
  valencene: {
    commonName: 'Valencene',
    flavor: 'citrus',
    scent: 'orange',
    effects: ['anti-inflammatory', 'antioxidant'],
  },
};

const TERPENE_CHIP_VARS = {
  'beta-caryophyllene': '--chem-t-bcary',
  'caryophyllene-oxide': '--chem-t-caryox',
  'alpha-humulene': '--chem-t-humulene',
  guaiol: '--chem-t-guaiol',
  'trans-beta-farnesene': '--chem-t-farnesene',
  'alpha-pinene': '--chem-t-apinene',
  'beta-pinene': '--chem-t-bpinene',
  'beta-myrcene': '--chem-t-myrcene',
  'd-limonene': '--chem-t-limonene',
  terpinolene: '--chem-t-terpinolene',
  'alpha-phellandrene': '--chem-t-aphellandrene',
  fenchol: '--chem-t-fenchol',
  eucalyptol: '--chem-t-eucalyptol',
  valencene: '--chem-t-valencene',
  linalool: '--chem-t-linalool',
  terpineol: '--chem-t-terpineol',
  'alpha-bisabolol': '--chem-t-bisabolol',
  'cis-beta-ocimene': '--chem-t-cisocimene',
  'trans-beta-ocimene': '--chem-t-transocimene',
};

const LABEL_X = { left: 0, right: CHART_VIEWBOX.width };
const TERPENES_LABEL_Y = s(28);
const LABEL_CHAR_WIDTH = s(9);
const LABEL_PAD_X = s(8);
const LABEL_PAD_Y = s(5);
const LABEL_TEXT_HEIGHT = s(17);
const LUMINANCE_THRESHOLD = 0.45;
// --- Utilities ---

function s(value) {
  return value * SCALE;
}

function formatPercent(value, decimals = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return (0).toFixed(decimals);
  return n.toFixed(decimals);
}

function chemicalSlug(name) {
  return String(name)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function sortIndex(name, order) {
  const index = order.indexOf(chemicalSlug(name));
  return index === -1 ? order.length : index;
}

function compareChemicalsByOrder(a, b, chartType) {
  const order = ORDER_BY_CHART[chartType] ?? [];
  const groupDelta = sortIndex(a.name, order) - sortIndex(b.name, order);
  if (groupDelta !== 0) return groupDelta;
  return a.name.localeCompare(b.name);
}

function relativeLuminance(hex) {
  const raw = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(raw.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function terpeneFillHex(slug) {
  const varName = TERPENE_CHIP_VARS[slug];
  if (!varName) return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function isDarkFill(slug) {
  const hex = terpeneFillHex(slug);
  if (!hex || !hex.startsWith('#')) return false;
  return relativeLuminance(hex) < LUMINANCE_THRESHOLD;
}

function getChemicalMeta(name) {
  return CHEMICAL_META[chemicalSlug(name)] ?? null;
}

function buildChartTooltipContent(name, value) {
  const meta = getChemicalMeta(name);
  const headline = `${name} ${formatPercent(value)}%`;

  if (!meta) return { headline, details: null };

  const details = [
    meta.flavor,
    meta.scent,
    ...(meta.effects ?? []),
  ]
    .filter(Boolean)
    .join(' · ');

  return { headline, details: details || null };
}

function renderChartTooltip(tooltip, name, value) {
  const { headline, details } = buildChartTooltipContent(name, value);
  tooltip.replaceChildren();

  const headlineEl = document.createElement('div');
  headlineEl.className = 'chart-tooltip-headline';
  headlineEl.textContent = headline;
  tooltip.appendChild(headlineEl);

  if (!details) return;

  const ruleEl = document.createElement('div');
  ruleEl.className = 'chart-tooltip-rule';
  tooltip.appendChild(ruleEl);

  const detailsEl = document.createElement('div');
  detailsEl.className = 'chart-tooltip-details';
  detailsEl.textContent = details;
  tooltip.appendChild(detailsEl);
}

// --- XLSX loading ---

function fixSheetRange(sheet) {
  let minRow = Infinity;
  let maxRow = 0;
  let minCol = Infinity;
  let maxCol = 0;

  for (const key of Object.keys(sheet)) {
    if (key[0] === '!') continue;
    const { r, c } = XLSX.utils.decode_cell(key);
    minRow = Math.min(minRow, r);
    maxRow = Math.max(maxRow, r);
    minCol = Math.min(minCol, c);
    maxCol = Math.max(maxCol, c);
  }

  if (maxRow >= minRow) {
    sheet['!ref'] = XLSX.utils.encode_range({
      s: { r: minRow, c: minCol },
      e: { r: maxRow, c: maxCol },
    });
  }
}

function normalizeTestName(name) {
  return String(name).replace(/\s+/g, ' ').trim();
}

function parseNotes(notes) {
  if (!notes || typeof notes !== 'string') return [];

  return notes
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.+?)\s+([\d.]+)\s*(%|mg)?$/i);
      if (!match) return { name: part, value: null };
      return {
        name: match[1].trim(),
        value: Number(match[2]),
        ...(match[3] ? { unit: match[3] } : {}),
      };
    });
}

function findTotalRow(rows, preferredName, prefix) {
  const normalizedPreferred = normalizeTestName(preferredName);
  const exact = rows.find(
    (row) => normalizeTestName(row['Test Name']) === normalizedPreferred
  );
  if (exact) return exact;

  return rows.find((row) =>
    normalizeTestName(row['Test Name']).startsWith(prefix)
  );
}

function extractTotal(rows, preferredName, prefix) {
  const row = findTotalRow(rows, preferredName, prefix);
  if (!row) return null;

  return {
    testName: row['Test Name'],
    result: Number(row.Result ?? row.Results),
    notes: parseNotes(row.Notes),
  };
}

function xlsxToProductJson(fileName, arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  fixSheetRange(sheet);

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const product = { fileName };

  for (const row of rows) {
    const testName = row['Test Name'];
    const result = Number(row.Result ?? row.Results);
    if (!testName || !Number.isFinite(result) || result <= 0) continue;
    product[testName] = result;
  }

  product.totalCannabinoids = extractTotal(
    rows,
    TOTAL_CANNABINOIDS,
    'Total Cannabinoids (%)'
  );
  product.totalTerpenes = extractTotal(
    rows,
    TOTAL_TERPENES,
    'Total Terpenes (%)'
  );

  return product;
}

async function loadAllData() {
  const manifestRes = await fetch(`${DATA_DIR}/manifest.json`);
  if (!manifestRes.ok) {
    throw new Error(`Failed to load manifest: ${manifestRes.status}`);
  }

  const files = await manifestRes.json();
  const dataByFile = {};

  for (const file of files) {
    const res = await fetch(`${DATA_DIR}/${file}`);
    if (!res.ok) {
      console.error(`Failed to load ${file}: ${res.status}`);
      continue;
    }

    const product = xlsxToProductJson(file, await res.arrayBuffer());
    dataByFile[file] = product;

    console.log(`--- ${file} ---`);
    console.log(product);
  }

  return dataByFile;
}

// --- Chart rendering ---

function getChartTooltip() {
  let tooltip = document.querySelector('.chart-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function setTerpeneChipActive(card, slug) {
  card.querySelectorAll('.terpene-chip').forEach((chip) => {
    chip.classList.toggle('is-active', chip.dataset.chem === slug);
  });
}

function clearTerpeneChipActive(card) {
  card.querySelectorAll('.terpene-chip.is-active').forEach((chip) => {
    chip.classList.remove('is-active');
  });
}

function renderPieChart(container, total, layout, chemicalOrder, hooks = {}) {
  if (!container) return;
  const root = d3.select(container);
  root.selectAll('*').remove();

  const data = (total?.notes ?? [])
    .filter((d) => d.value > 0)
    .map((d) => ({ name: d.name, value: d.value }))
    .sort((a, b) => compareChemicalsByOrder(a, b, chemicalOrder));

  if (!data.length) return;

  const { cx, cy, outerRadius } = layout;
  const innerRadius = 0;
  const padAngle = 0;

  const pie = d3.pie().sort(null).value((d) => d.value);

  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padAngle(padAngle);

  const hoverArc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius + s(6))
    .padAngle(padAngle);

  const g = root.append('g').attr('transform', `translate(${cx},${cy})`);
  const tooltip = getChartTooltip();

  const paths = g
    .selectAll('path')
    .data(pie(data))
    .join('path')
    .attr('data-chem', (d) => chemicalSlug(d.data.name))
    .attr('d', arc);

  const { onActivate, onReset } = hooks;

  const resetHover = () => {
    paths.classed('is-active', false).attr('d', arc);
    tooltip.hidden = true;
    onReset?.();
  };

  const activateSlice = (selection) => {
    paths.classed('is-active', false).attr('d', arc);
    selection.classed('is-active', true).attr('d', hoverArc).raise();

    const datum = selection.datum();
    if (datum) onActivate?.(chemicalSlug(datum.data.name));
  };

  const highlight = (slug) => {
    const match = paths.filter((d) => chemicalSlug(d.data.name) === slug);
    if (match.size()) activateSlice(match);
  };

  paths
    .on('pointerenter', function (event, d) {
      activateSlice(d3.select(this));

      renderChartTooltip(tooltip, d.data.name, d.data.value);
      tooltip.style.left = `${event.clientX + s(12)}px`;
      tooltip.style.top = `${event.clientY + s(12)}px`;
      tooltip.hidden = false;
    })
    .on('pointermove', (event) => {
      tooltip.style.left = `${event.clientX + s(12)}px`;
      tooltip.style.top = `${event.clientY + s(12)}px`;
    })
    .on('pointerleave', resetHover);

  g.on('pointerleave', resetHover);

  return { highlight, reset: resetHover };
}

function renderCompositionCharts(card, product) {
  const cannabinoids = renderPieChart(
    card.querySelector('.chart-cannabinoids'),
    product.totalCannabinoids,
    CHART_LAYOUT.cannabinoids,
    'cannabinoids'
  );
  const terpenes = renderPieChart(
    card.querySelector('.chart-terpenes'),
    product.totalTerpenes,
    CHART_LAYOUT.terpenes,
    'terpenes',
    {
      onActivate: (slug) => setTerpeneChipActive(card, slug),
      onReset: () => clearTerpeneChipActive(card),
    }
  );
  return { cannabinoids, terpenes };
}

// --- Card rendering ---

function diagramLabelRect(labelX, labelY, textAnchor, label) {
  const textW = label.length * LABEL_CHAR_WIDTH;
  const boxW = textW + LABEL_PAD_X * 2;
  const boxH = LABEL_TEXT_HEIGHT + LABEL_PAD_Y * 2;
  const rectX =
    textAnchor === 'start'
      ? labelX - LABEL_PAD_X
      : textAnchor === 'end'
        ? labelX - textW - LABEL_PAD_X
        : labelX - textW / 2 - LABEL_PAD_X;
  const rectY = labelY - LABEL_TEXT_HEIGHT - LABEL_PAD_Y + s(3);
  return { x: rectX, y: rectY, width: boxW, height: boxH };
}

function leaderTowardCenter(chart, labelX, labelY, textAnchor, label) {
  const rect = diagramLabelRect(labelX, labelY, textAnchor, label);
  const anchorX = rect.x + rect.width / 2;
  const { cx, cy, outerRadius } = chart;
  const ly = labelY - s(7);
  const dx = cx - anchorX;
  const dy = cy - ly;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const anchorY = cy > ly ? rect.y + rect.height : rect.y;

  return {
    x1: anchorX,
    y1: anchorY,
    x2: cx - ux * outerRadius,
    y2: cy - uy * outerRadius,
  };
}

function computeCannabinoidsLabelY() {
  const terpeneLeader = leaderTowardCenter(
    CHART_LAYOUT.terpenes,
    LABEL_X.left,
    TERPENES_LABEL_Y,
    'start',
    'Terpenes'
  );
  const targetGap = terpeneLeader.y2 - terpeneLeader.y1;
  let bestY = CHART_LAYOUT.cannabinoids.cy;
  let bestDiff = Infinity;

  for (
    let probe = CHART_LAYOUT.cannabinoids.cy;
    probe <= CHART_VIEWBOX.height + s(100);
    probe += s(0.25)
  ) {
    const leader = leaderTowardCenter(
      CHART_LAYOUT.cannabinoids,
      LABEL_X.right,
      probe,
      'end',
      'Cannabinoids'
    );
    const gap = leader.y1 - leader.y2;
    const diff = Math.abs(gap - targetGap);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestY = probe;
    }
  }

  return bestY;
}

const CANNABINOIDS_LABEL_Y = computeCannabinoidsLabelY();

function renderDiagramLeader(chart, label, labelX, labelY, textAnchor) {
  const leader = leaderTowardCenter(chart, labelX, labelY, textAnchor, label);
  return `<line x1="${leader.x1}" y1="${leader.y1}" x2="${leader.x2}" y2="${leader.y2}" class="diagram-leader"/>`;
}

function renderDiagramLabel(label, labelX, labelY, textAnchor) {
  const { x: rectX, y: rectY, width: boxW, height: boxH } = diagramLabelRect(
    labelX,
    labelY,
    textAnchor,
    label
  );

  return `<g class="diagram-label-group">
    <rect x="${rectX}" y="${rectY}" width="${boxW}" height="${boxH}" class="diagram-label-bg"/>
    <text x="${labelX}" y="${labelY}" text-anchor="${textAnchor}" class="diagram-label">${label}</text>
  </g>`;
}

function getCardCycleSvg(index) {
  return CARD_CYCLE_SVGS[(index - 1) % CARD_CYCLE_SVGS.length];
}

function fileNameToProductName(fileName) {
  return fileName
    .replace(/\.xlsx$/i, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getTerpeneDisplayName(name) {
  return getChemicalMeta(name)?.commonName ?? name;
}

function sortedTerpenes(notes) {
  return (notes ?? [])
    .filter((d) => d.value > 0)
    .slice()
    .sort((a, b) => b.value - a.value);
}

function uniqueInOrder(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    if (!value) continue;
    const key = String(value).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function formatList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function buildTerpeneDescription(terpenes) {
  const flavors = [];
  const effects = [];

  for (const terpene of terpenes.slice(0, 3)) {
    const meta = getChemicalMeta(terpene.name);
    if (!meta) continue;
    flavors.push(meta.flavor);
    effects.push(meta.effects?.[0]);
  }

  const uniqueFlavors = uniqueInOrder(flavors);
  const uniqueEffects = uniqueInOrder(effects);

  if (!uniqueFlavors.length || !uniqueEffects.length) {
    return '';
  }

  return `This strain has ${formatList(uniqueFlavors)} scents, with ${formatList(uniqueEffects)} effects from dominant terpenes.`;
}

function createChipElement({ name }) {
  const slug = chemicalSlug(name);
  const meta = getChemicalMeta(name);
  const chip = document.createElement('div');
  chip.className = 'terpene-chip';
  chip.dataset.chem = slug;
  if (isDarkFill(slug)) chip.dataset.tone = 'dark';

  const nameEl = document.createElement('span');
  nameEl.className = 'terpene-chip-name';
  nameEl.textContent = getTerpeneDisplayName(name);

  const flavorEl = document.createElement('span');
  flavorEl.className = 'terpene-chip-flavor';
  flavorEl.textContent = meta?.flavor ?? '';

  const effectEl = document.createElement('span');
  effectEl.className = 'terpene-chip-effect';
  effectEl.textContent = meta?.effects?.[0] ?? '';

  chip.append(nameEl, flavorEl, effectEl);
  return chip;
}

function createEffectsHeader() {
  const header = document.createElement('div');
  header.className = 'effects-header';
  header.setAttribute('aria-hidden', 'true');
  header.innerHTML = `
    <span class="effects-header-name">Major Terpenes</span>
    <span class="effects-header-scent">Scent</span>
    <span class="effects-header-effect">Effect</span>
  `;
  return header;
}

function updateEffectsScrollHint(listEl) {
  const wrap = listEl.closest('.effects-wrap');
  if (!wrap) return;
  const remaining = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight;
  wrap.classList.toggle('has-more', remaining > 1);
}

function bindEffectsScrollHint(listEl) {
  const update = () => updateEffectsScrollHint(listEl);
  listEl.addEventListener('scroll', update, { passive: true });
  requestAnimationFrame(update);
}

function renderTerpenesEffects(card, product, terpeneChart) {
  const terpenes = sortedTerpenes(product.totalTerpenes?.notes);
  const descriptionEl = card.querySelector('.product-description');
  if (descriptionEl) {
    descriptionEl.textContent = buildTerpeneDescription(terpenes);
  }

  const effectsEl = card.querySelector('.effects');
  if (!effectsEl) return;

  const listEl = document.createElement('div');
  listEl.className = 'effects-list';

  effectsEl.replaceChildren(createEffectsHeader(), listEl);

  if (!terpenes.length) {
    updateEffectsScrollHint(listEl);
    return;
  }

  for (const terpene of terpenes) {
    const chip = createChipElement(terpene);
    const slug = chip.dataset.chem;

    chip.addEventListener('pointerenter', () => {
      terpeneChart?.highlight(slug);
    });
    chip.addEventListener('pointerleave', () => {
      terpeneChart?.reset();
    });

    listEl.appendChild(chip);
  }

  bindEffectsScrollHint(listEl);
}

function createStrainCard(fileName, product, index) {
  const card = document.createElement('article');
  card.className = 'strain-card box';
  card.dataset.file = fileName;

  const cannabinoidsTotal = product.totalCannabinoids?.result;
  const terpenesTotal = product.totalTerpenes?.result;
  const totalsLine = [
    cannabinoidsTotal != null ? `${formatPercent(cannabinoidsTotal)}% cannabinoids` : '',
    terpenesTotal != null ? `${formatPercent(terpenesTotal)}% terpenes` : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const cycleSvg = getCardCycleSvg(index);
  const cycleSlot = ((index - 1) % CARD_CYCLE_SVGS.length) + 1;
  const svgNudgeUp = cycleSlot === 1 || cycleSlot === 2
    ? ' style="top: calc(30px * var(--scale) - 20px)"'
    : '';

  card.innerHTML = `
    <div class="card-header">
      <div class="card-meta product-totals">${totalsLine}</div>
      <span class="card-logo" role="img" aria-label="Village Flower"></span>
    </div>
    <div class="graphic">
      <div class="flower-wrap">
        <img class="svg-combined" src="${cycleSvg}" alt="" aria-hidden="true"${svgNudgeUp}>
        <svg class="chart-overlay" width="${CHART_VIEWBOX.width}" height="${CHART_VIEWBOX.height}" viewBox="0 0 ${CHART_VIEWBOX.width} ${CHART_VIEWBOX.height}" aria-hidden="true">
          <g class="diagram-leaders">
            ${renderDiagramLeader(CHART_LAYOUT.terpenes, 'Terpenes', LABEL_X.left, TERPENES_LABEL_Y, 'start')}
            ${renderDiagramLeader(CHART_LAYOUT.cannabinoids, 'Cannabinoids', LABEL_X.right, CANNABINOIDS_LABEL_Y, 'end')}
          </g>
          <g class="chart-terpenes"></g>
          <g class="chart-cannabinoids"></g>
          <g class="diagram-labels">
            <g class="label-terpenes">
              ${renderDiagramLabel('Terpenes', LABEL_X.left, TERPENES_LABEL_Y, 'start')}
            </g>
            <g class="label-cannabinoids">
              ${renderDiagramLabel('Cannabinoids', LABEL_X.right, CANNABINOIDS_LABEL_Y, 'end')}
            </g>
          </g>
        </svg>
      </div>
    </div>
    <div class="info">
      <div class="product-name">${fileNameToProductName(fileName)}</div>
      <p class="product-description"></p>
      <div class="effects-wrap">
        <div class="effects">
          <div class="effects-header" aria-hidden="true">
            <span class="effects-header-name">Major Terpenes</span>
            <span class="effects-header-scent">Scent</span>
            <span class="effects-header-effect">Effect</span>
          </div>
          <div class="effects-list"></div>
        </div>
        <div class="effects-scroll-hint" aria-hidden="true">
          <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L7 6.5L13 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  `;

  return card;
}

// --- Init ---

async function init() {
  const dataByFile = await loadAllData();
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const entries = Object.entries(dataByFile);

  entries.forEach(([fileName, product], i) => {
    const card = createStrainCard(fileName, product, i + 1);
    gallery.appendChild(card);
    const charts = renderCompositionCharts(card, product);
    renderTerpenesEffects(card, product, charts.terpenes);
  });
}

init().catch((err) => console.error('init failed:', err));
