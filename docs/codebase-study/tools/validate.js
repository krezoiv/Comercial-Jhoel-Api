// Validates the generated docs: links (+ anchors), documented paths, symbol
// names in hand-written chapters, and structural Mermaid syntax.
const fs = require('fs');
const path = require('path');
const [ROOT, MODEL] = process.argv.slice(2);
const model = require(MODEL);
const DOCS = path.join(ROOT, 'docs/codebase-study');
const walk = (d, acc = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    e.isDirectory() ? walk(f, acc) : acc.push(f);
  }
  return acc;
};
const mdFiles = [path.join(ROOT, 'CODEBASE_STUDY_GUIDE.md'), ...walk(DOCS).filter((f) => f.endsWith('.md'))];
const mmdFiles = walk(DOCS).filter((f) => f.endsWith('.mmd'));

const slug = (h) =>
  h.trim().toLowerCase().replace(/<[^>]+>/g, '').replace(/[`*_~]/g, (c) => (c === '_' ? '_' : ''))
    .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
const anchorCache = new Map();
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const s = fs.readFileSync(file, 'utf8');
  const set = new Set();
  for (const m of s.matchAll(/<a id="([^"]+)"><\/a>/g)) set.add(m[1]);
  const counts = new Map();
  for (const m of s.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    let sl = slug(m[1]);
    const n = counts.get(sl) || 0;
    counts.set(sl, n + 1);
    set.add(n ? `${sl}-${n}` : sl);
  }
  anchorCache.set(file, set);
  return set;
}
let links = 0, brokenFiles = [], brokenAnchors = [], codeLinks = 0;
for (const f of mdFiles) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:)/.test(target)) continue;
    links++;
    const [p, hash] = target.split('#');
    const resolved = p ? path.resolve(path.dirname(f), decodeURI(p)) : f;
    if (!fs.existsSync(resolved)) { brokenFiles.push(`${path.relative(ROOT, f)} → ${target}`); continue; }
    if (!resolved.endsWith('.md')) { codeLinks++; continue; }
    if (hash && !/^L\d+$/.test(hash) && !anchorsOf(resolved).has(decodeURI(hash))) brokenAnchors.push(`${path.relative(ROOT, f)} → ${target}`);
  }
}

// documented paths & symbols in hand-written chapters
const handWritten = [path.join(ROOT, 'CODEBASE_STUDY_GUIDE.md'), ...['01', '02', '06', '07', '09', '10', '11', '13'].map((n) => fs.readdirSync(DOCS).find((x) => x.startsWith(n + '_'))).map((x) => path.join(DOCS, x))];
const bases = ['', 'comercial-jhoel-api', 'comercial-jhoel-api/src', 'comercial-jhoel-api/src/modules', 'comercial-jhoel-app', 'comercial-jhoel-app/src', 'comercial-jhoel-app/src/app'];
const classes = new Map();
const fnNames = new Set();
for (const f of model.files) {
  for (const c of f.classes) classes.set(c.name, new Set(c.methods.map((m) => m.name)));
  for (const fn of f.functions) fnNames.add(fn.name);
  for (const i of f.interfaces) classes.set(i.name, new Set(i.members));
  for (const t of f.types) fnNames.add(t.name);
  for (const c of f.consts) fnNames.add(c.name);
}
// Framework / external names cited on purpose (not project code).
const EXTERNAL = new Set(['CLAUDE.md', 'DataSource.query', 'ConfigModule.forRoot', 'TypeOrmModule.forRootAsync', 'ThrottlerGuard', 'NestFactory.create']);
const missingPaths = new Set();
const missingSymbols = new Set();
let pathsChecked = 0, symbolsChecked = 0;
for (const f of handWritten) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/`([^`\s]+\.(?:ts|html|sql|sh|md|json|yml|mmd))`/g)) {
    let p = m[1].replace(/^\.\//, '');
    if (p.includes('*') || p.includes('<') || !p.includes('/')) continue;
    pathsChecked++;
    const ok = bases.some((b) => fs.existsSync(path.join(ROOT, b, p))) ||
      // partial paths like "auth/.../x.ts": find by suffix
      (p.includes('...') && model.files.some((x) => x.path.endsWith(p.split('.../').pop())));
    if (!ok) missingPaths.add(`${path.basename(f)}: ${p}`);
  }
  for (const m of s.matchAll(/`([A-Z][A-Za-z0-9]+)\.([a-z][A-Za-z0-9]+)`/g)) {
    if (EXTERNAL.has(`${m[1]}.${m[2]}`)) continue;
    symbolsChecked++;
    const methods = classes.get(m[1]);
    if (!methods || !methods.has(m[2])) missingSymbols.add(`${path.basename(f)}: ${m[1]}.${m[2]}`);
  }
  for (const m of s.matchAll(/`([A-Z][A-Za-z0-9]+(?:UseCase|Service|Component|Controller|Repository|Store|Guard|Error|Filter|Interceptor|Strategy|Hasher|Manager))`/g)) {
    if (EXTERNAL.has(m[1])) continue;
    symbolsChecked++;
    if (!classes.has(m[1])) missingSymbols.add(`${path.basename(f)}: ${m[1]} (clase)`);
  }
}

// mermaid structural validation
function checkMermaid(src, where) {
  const errs = [];
  const lines = src.split('\n').map((l) => l.trimEnd()).filter((l) => l.trim());
  const type = (lines[0] || '').trim().split(/\s+/)[0];
  if (!['flowchart', 'graph', 'sequenceDiagram', 'erDiagram'].includes(type)) errs.push('tipo desconocido: ' + lines[0]);
  const body = lines.slice(1);
  if (type === 'flowchart' || type === 'graph') {
    let depth = 0;
    for (const l of body) {
      const t = l.trim();
      if (/^subgraph\b/.test(t)) { depth++; continue; }
      if (t === 'end') { depth--; continue; }
      if ((t.match(/"/g) || []).length % 2) errs.push('comillas impares: ' + t);
      const noStr = t.replace(/"[^"]*"/g, '""');
      for (const [o, c] of [['[', ']'], ['(', ')'], ['{', '}']]) if (noStr.split(o).length !== noStr.split(c).length) errs.push(`corchetes ${o}${c} desbalanceados: ` + t);
      if (!/(-->|---|-\.|==>|\.->)/.test(noStr) && !/^[A-Za-z0-9_]+\s*[[({]/.test(noStr) && !/^(classDef|class|style|linkStyle|direction)\b/.test(noStr)) errs.push('línea no reconocida: ' + t);
    }
    if (depth !== 0) errs.push('subgraph/end desbalanceado');
  } else if (type === 'sequenceDiagram') {
    let depth = 0;
    for (const l of body) {
      const t = l.trim();
      if (/^(participant|actor)\s+\S+/.test(t)) continue;
      if (/^(alt|opt|loop|par|rect|critical)\b/.test(t)) { depth++; continue; }
      if (/^else\b/.test(t)) { if (!depth) errs.push('else fuera de bloque'); continue; }
      if (t === 'end') { depth--; continue; }
      if (/^Note (over|left of|right of) [^:]+:.+/.test(t)) continue;
      if (/^[A-Za-z0-9_]+\s*(->>|-->>|->|-->|-x|--x|-\))\s*[A-Za-z0-9_]+\s*:.+/.test(t)) continue;
      errs.push('línea no reconocida: ' + t);
    }
    if (depth !== 0) errs.push('alt/end desbalanceado');
  } else if (type === 'erDiagram') {
    let inEntity = false;
    for (const l of body) {
      const t = l.trim();
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
let diagrams = 0;
const mermaidErrors = [];
for (const f of mdFiles) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/```mermaid\n([\s\S]*?)```/g)) { diagrams++; mermaidErrors.push(...checkMermaid(m[1], path.relative(ROOT, f))); }
}
for (const f of mmdFiles) { diagrams++; mermaidErrors.push(...checkMermaid(fs.readFileSync(f, 'utf8'), path.relative(ROOT, f))); }

console.log(JSON.stringify({
  mdFiles: mdFiles.length, links, codeLinks, brokenFiles: brokenFiles.length, brokenAnchors: brokenAnchors.length,
  pathsChecked, missingPaths: missingPaths.size, symbolsChecked, missingSymbols: missingSymbols.size,
  diagrams, mermaidErrors: mermaidErrors.length,
}, null, 1));
const show = (t, a) => a.length && console.log('\n' + t + '\n' + [...a].slice(0, 40).join('\n'));
show('BROKEN FILE LINKS', brokenFiles);
show('BROKEN ANCHORS', brokenAnchors);
show('MISSING PATHS', [...missingPaths]);
show('MISSING SYMBOLS', [...missingSymbols]);
show('MERMAID', mermaidErrors);
