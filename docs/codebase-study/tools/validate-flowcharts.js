// Validates docs/flowcharts: structural Mermaid syntax of every .mmd and every
// ```mermaid block, documented file paths (@archivos), Class.method names in
// labels, SQL functions and tables against the live schema, and internal links.
const fs = require('fs');
const path = require('path');
const [ROOT, MODEL, DBJSON] = process.argv.slice(2);
const OUT = path.join(ROOT, 'docs/flowcharts');
const model = JSON.parse(fs.readFileSync(MODEL, 'utf8'));
const db = JSON.parse(fs.readFileSync(DBJSON, 'utf8').split('\n').find((l) => l.startsWith('{')));
const walk = (d, acc = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); e.isDirectory() ? walk(f, acc) : acc.push(f); } return acc; };
const files = walk(OUT);

const members = new Map();
for (const f of model.files) {
  for (const c of f.classes) members.set(c.name, new Set([...c.methods.map((m) => m.name), ...c.properties.map((p) => p.name)]));
  for (const i of f.interfaces) members.set(i.name, new Set(i.members));
}
const fnNames = new Set(model.files.flatMap((f) => [...f.functions.map((x) => x.name), ...f.consts.map((x) => x.name)]));
const sqlFns = new Set((db.functions || []).map((f) => f.name));
const tables = new Set([...db.tables.map((t) => t.name), ...(db.views || []).map((v) => v.name), ...(db.functions || []).flatMap((f) => f.locks || [])]);
const EXTERNAL = new Set(['NestFactory.create', 'ConfigModule.forRoot', 'ThrottlerModule.forRoot', 'TypeOrmModule.forRootAsync', 'SwPush.requestSubscription', 'webpush.setVapidDetails', 'webpush.sendNotification', 'Number.isInteger', 'JSON.stringify', 'Math.trunc', 'this.local.next', 'this.channel']);

const decode = (s) => s.replace(/#quot;/g, '"').replace(/#lt;/g, '<').replace(/#gt;/g, '>').replace(/#amp;/g, '&').replace(/#59;/g, ';').replace(/#124;/g, '|').replace(/#35;/g, '#').replace(/#58;/g, ':').replace(/<[^>]+>/g, ' ');

function checkMermaid(src, where) {
  const errs = [];
  const lines = src.split('\n').map((l) => l.trimEnd()).filter((l) => l.trim() && !l.trim().startsWith('%%'));
  const type = (lines[0] || '').trim().split(/\s+/)[0];
  if (!['flowchart', 'graph', 'sequenceDiagram', 'erDiagram'].includes(type)) return [`${where}: tipo desconocido "${lines[0]}"`];
  const body = lines.slice(1).map((l) => l.trim());
  if (type === 'flowchart' || type === 'graph') {
    let depth = 0;
    const defined = new Set();
    const used = new Set();
    for (const t of body) {
      if (/^subgraph\b/.test(t)) {
        depth++;
        if (!/^subgraph [A-Za-z0-9_]+(\["[^"]*"\])?$/.test(t)) errs.push('subgraph mal formado: ' + t);
        continue;
      }
      if (t === 'end') { depth--; continue; }
      if (/^(classDef|class|style|linkStyle|direction)\b/.test(t)) {
        if (/^class /.test(t) && !/^class [A-Za-z0-9_,]+ [A-Za-z0-9_]+$/.test(t)) errs.push('class mal formado: ' + t);
        continue;
      }
      if ((t.match(/"/g) || []).length % 2) { errs.push('comillas impares: ' + t); continue; }
      const noStr = t.replace(/"[^"]*"/g, '""');
      for (const [o, c] of [['[', ']'], ['(', ')'], ['{', '}']]) if (noStr.split(o).length !== noStr.split(c).length) errs.push(`${o}${c} desbalanceados: ${t}`);
      if (/^[A-Za-z0-9_]+(\(\[|\[\(|\[\[|\[|\{|\()""(\]\)|\)\]|\]\]|\]|\}|\))(:::[a-z]+)?$/.test(noStr)) { defined.add(noStr.match(/^[A-Za-z0-9_]+/)[0]); continue; }
      // edges: chains like A --> B -->|x| C, also with inline node definitions
      const stripped = noStr.replace(/(\(\[|\[\(|\[\[|\[|\{|\()""(\]\)|\)\]|\]\]|\]|\}|\))/g, '');
      const parts = stripped.split(/\s*(?:-->|-\.->|==>|---)(?:\|""\||\|[^|]*\|)?\s*/);
      if (parts.length < 2 || parts.some((p) => !/^[A-Za-z0-9_]+$/.test(p))) { errs.push('línea no reconocida: ' + t); continue; }
      parts.forEach((p) => used.add(p));
      for (const m of noStr.matchAll(/([A-Za-z0-9_]+)(\(\[|\[\(|\[\[|\[|\{|\()""/g)) defined.add(m[1]);
    }
    if (depth !== 0) errs.push('subgraph/end desbalanceado');
    for (const u of used) if (!defined.has(u) && !/^n\d+$/.test(u) === false) errs.push('nodo usado sin definir: ' + u);
  } else if (type === 'sequenceDiagram') {
    let depth = 0;
    const parts = new Set();
    for (const t of body) {
      if (t === 'autonumber') continue;
      let m;
      if ((m = t.match(/^(participant|actor)\s+([A-Za-z0-9_]+)(\s+as\s+.+)?$/))) { parts.add(m[2]); continue; }
      if (/^(alt|opt|loop|par|rect|critical)\b/.test(t)) { depth++; continue; }
      if (/^else\b/.test(t)) { if (!depth) errs.push('else fuera de bloque'); continue; }
      if (t === 'end') { depth--; continue; }
      if ((m = t.match(/^Note (over|left of|right of) ([A-Za-z0-9_, ]+):.+/))) { m[2].split(',').forEach((p) => { if (!parts.has(p.trim())) errs.push('Note sobre participante desconocido: ' + p); }); continue; }
      if ((m = t.match(/^([A-Za-z0-9_]+)\s*(->>|-->>|->|-->|-x|--x|-\))\s*([A-Za-z0-9_]+)\s*:(.+)$/))) {
        if (!parts.has(m[1]) || !parts.has(m[3])) errs.push('mensaje con participante desconocido: ' + t);
        if (/;/.test(m[4].replace(/#[a-z0-9]+;/gi, ''))) errs.push('punto y coma en mensaje: ' + t);
        continue;
      }
      errs.push('línea no reconocida: ' + t);
    }
    if (depth !== 0) errs.push('alt/opt/end desbalanceado');
  } else {
    let inEntity = false;
    for (const t of body) {
      if (/^[A-Za-z0-9_-]+\s*\{$/.test(t)) { if (inEntity) errs.push('entidad anidada'); inEntity = true; continue; }
      if (t === '}') { inEntity = false; continue; }
      if (inEntity) { if (!/^[A-Za-z0-9_]+\s+[A-Za-z0-9_]+(\s+(PK|FK|UK))?$/.test(t)) errs.push('atributo inválido: ' + t); continue; }
      if (/^[A-Za-z0-9_-]+\s+(\|\||\|o|\}o|\}\|)(--|\.\.)(\|\||o\||o\{|\|\{)\s+[A-Za-z0-9_-]+\s*:\s*"[^"]*"$/.test(t)) continue;
      errs.push('línea no reconocida: ' + t);
    }
    if (inEntity) errs.push('entidad sin cerrar');
  }
  return errs.map((e) => `${where}: ${e}`);
}

const report = { mermaid: [], paths: [], symbols: [], sqlFns: [], tables: [], links: [] };
let diagrams = 0, pathsChecked = 0, symbolsChecked = 0, linksChecked = 0;
for (const f of files) {
  const rel = path.relative(ROOT, f);
  const src = fs.readFileSync(f, 'utf8');
  const blocks = f.endsWith('.mmd') ? [src] : [...src.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1]);
  for (const b of blocks) {
    diagrams++;
    report.mermaid.push(...checkMermaid(b, rel));
    const labels = [...b.matchAll(/"([^"]*)"/g)].map((m) => decode(m[1])).concat([...b.matchAll(/:\s(.+)$/gm)].map((m) => decode(m[1])));
    for (const l of labels) {
      for (const m of l.matchAll(/\b([A-Z][A-Za-z0-9]+)\.([a-zA-Z][A-Za-z0-9]*)\b/g)) {
        const k = `${m[1]}.${m[2]}`;
        if (EXTERNAL.has(k) || /^(Q|L)\d/.test(m[2])) continue;
        if (!members.has(m[1])) continue; // not a project class name (e.g. prose)
        symbolsChecked++;
        if (!members.get(m[1]).has(m[2])) report.symbols.push(`${rel}: ${k}`);
      }
      for (const m of l.matchAll(/\b([a-z][a-z0-9_]+)\(\)/g)) {
        if (!m[1].includes('_')) continue;
        if (!sqlFns.has(m[1])) report.sqlFns.push(`${rel}: ${m[1]}()`);
      }
    }
    for (const m of b.matchAll(/\[\("([^"]*)"\)\]/g)) {
      for (const tok of decode(m[1]).split(/[\s,]+/)) {
        if (/^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(tok) && !sqlFns.has(tok) && !tables.has(tok) && !/^(cash_custody|cash_control|warehouse_cash)_main$/.test(tok)) report.tables.push(`${rel}: ${tok}`);
      }
    }
  }
  if (f.endsWith('.mmd')) {
    const a = (src.match(/^%% @archivos: (.*)$/m) || [null, ''])[1];
    for (const p of a.split(' ; ').map((x) => x.trim()).filter(Boolean)) {
      const clean = p.replace(/\s*\(.*\)$/, '').replace(/\s.*$/, '');
      pathsChecked++;
      if (!fs.existsSync(path.join(ROOT, clean))) report.paths.push(`${rel}: ${p}`);
    }
  }
  if (f.endsWith('.md')) {
    for (const m of src.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:)/.test(m[1])) continue;
      linksChecked++;
      const target = path.resolve(path.dirname(f), decodeURI(m[1].split('#')[0]));
      if (!fs.existsSync(target)) report.links.push(`${rel} → ${m[1]}`);
    }
  }
}
console.log(JSON.stringify({ files: files.length, diagrams, pathsChecked, symbolsChecked, linksChecked, mermaidErrors: report.mermaid.length, missingPaths: report.paths.length, unknownSymbols: report.symbols.length, unknownSqlFunctions: report.sqlFns.length, unknownTables: report.tables.length, brokenLinks: report.links.length }, null, 1));
for (const [k, v] of Object.entries(report)) if (v.length) console.log(`\n${k.toUpperCase()}\n` + [...new Set(v)].slice(0, 30).join('\n'));
process.exitCode = Object.values(report).some((v) => v.length) ? 1 : 0;
