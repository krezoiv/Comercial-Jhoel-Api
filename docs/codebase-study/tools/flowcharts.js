// Generates docs/flowcharts from model.json + db.json. Every node and arrow
// comes from extracted evidence: decorators, constructor injection, calls,
// `if … throw` guards, PL/pgSQL `IF … RAISE` guards and the live schema.
// Hand-written diagrams (files without the "@generado" header) are kept.
const fs = require('fs');
const path = require('path');
const { load } = require('./lib');

const [ROOT, MODEL, DBJSON] = process.argv.slice(2);
const OUT = path.join(ROOT, 'docs/flowcharts');
const A = load(MODEL, DBJSON);
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };

// ---------- mermaid helpers ----------
const ENT = { '#': '#35;', '"': '#quot;', '<': '#lt;', '>': '#gt;', '&': '#amp;', ';': '#59;', '|': '#124;', '`': "'" };
const enc = (s) => String(s ?? '').replace(/\s+/g, ' ').replace(/[#"<>&;|`]/g, (c) => ENT[c]);
const short = (p) => p.replace(/^comercial-jhoel-api\/src\/modules\//, 'api/').replace(/^comercial-jhoel-api\/src\//, 'api/').replace(/^comercial-jhoel-app\/src\/app\//, 'app/');
const CLASSDEFS = [
  'classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20',
  'classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1',
  'classDef api fill:#ede7f6,stroke:#4527a0,color:#311b92',
  'classDef app fill:#e0f2f1,stroke:#00695c,color:#004d40',
  'classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037',
  'classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c',
  'classDef db fill:#eceff1,stroke:#455a64,color:#263238',
  'classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723',
  'classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c',
  'classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20',
];
class Chart {
  constructor(kind = 'flowchart TD') { this.kind = kind; this.lines = []; this.edges = []; this.cls = new Map(); this.n = 0; this.ids = new Map(); }
  id(key) { if (!this.ids.has(key)) this.ids.set(key, 'n' + ++this.n); return this.ids.get(key); }
  node(key, label, shape, klass) {
    const id = this.id(key);
    if (this.cls.has(id)) return id;
    const [o, c] = { proc: ['["', '"]'], dec: ['{"', '"}'], oval: ['(["', '"])'], db: ['[("', '")]'], sub: ['[["', '"]]'] }[shape];
    this.lines.push(`  ${id}${o}${label}${c}`);
    this.cls.set(id, klass);
    return id;
  }
  // Edges are printed after every subgraph so Mermaid never moves a node into another layer.
  edge(a, b, label) { this.edges.push(`  ${a} -->${label ? '|' + enc(label) + '|' : ''} ${b}`); }
  dotted(a, b, label) { this.edges.push(`  ${a} -.->${label ? '|' + enc(label) + '|' : ''} ${b}`); }
  sub(title, fn) { this.lines.push(`  subgraph ${'s' + ++this.n}["${enc(title)}"]`); fn(); this.lines.push('  end'); }
  text() {
    const byClass = new Map();
    for (const [id, k] of this.cls) { if (!byClass.has(k)) byClass.set(k, []); byClass.get(k).push(id); }
    return [this.kind, ...this.lines, ...this.edges, ...CLASSDEFS.map((c) => '  ' + c), ...[...byClass].map(([k, ids]) => `  class ${ids.join(',')} ${k}`)].join('\n');
  }
}
function header(meta) {
  return ['%% @generado: docs/codebase-study/tools/flowcharts.js (no editar a mano; se regenera)', ...Object.entries(meta).map(([k, v]) => `%% @${k}: ${String(v).replace(/\n/g, ' ')}`)].join('\n') + '\n';
}
// Remove previously generated diagrams (and their .md) so renamed/removed endpoints leave nothing stale.
(function cleanGenerated(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { cleanGenerated(f); if (!fs.readdirSync(f).length) fs.rmdirSync(f); continue; }
    if (f.endsWith('.mmd') && fs.readFileSync(f, 'utf8').startsWith('%% @generado')) {
      fs.unlinkSync(f);
      if (fs.existsSync(f.replace(/\.mmd$/, '.md'))) fs.unlinkSync(f.replace(/\.mmd$/, '.md'));
    }
  }
})(OUT);
const outputs = [];
function emit(rel, meta, body) {
  const file = path.join(OUT, rel);
  write(file, header(meta) + body + '\n');
  outputs.push({ rel, meta });
}

// ---------- module naming ----------
const moduleOf = (p) => (p.match(/modules\/([^/]+)\//) || [null, p.includes('/health/') ? 'health' : 'core'])[1];
const MODULE_NAMES = {
  'account-types': 'Tipos de cuenta', 'accounts-receivable': 'Cuentas por Cobrar', 'alert-settings': 'Configuración de alertas', alerts: 'Alertas',
  assets: 'Activos', auth: 'Autenticación', 'bank-deposits': 'Transaccionar (operaciones bancarias)', banks: 'Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias)',
  businesses: 'Negocios', 'cash-control': 'Control de Efectivo (Kardex, cortes, arqueos, Bodega)', catalog: 'Catálogo de teléfonos', 'catalog-banks': 'Catálogo de bancos',
  categories: 'Categorías', clients: 'Clientes', 'company-settings': 'Datos de la empresa', dashboard: 'Resumen (dashboard)', 'financial-day-review': 'Revisión de días operativos',
  'guayacan-cash-box': 'Caja Guayacán', 'ice-creams': 'Heladería', inventory: 'Inventario', 'keyboard-shortcuts': 'Atajos de teclado', 'landing-backgrounds': 'Fondos de la landing',
  likes: 'Me gusta', news: 'Noticias', 'news-subscriptions': 'Suscripciones a noticias (Web Push)', 'news-types': 'Tipos de noticia', phones: 'Teléfonos', 'presentation-types': 'Tipos de presentación',
  'product-catalog': 'Catálogo de productos', products: 'Productos', purchases: 'Compras', quotations: 'Cotizaciones', 'recharge-cash-box': 'Caja de recargas', recharges: 'Recargas electrónicas',
  reports: 'Reportería', roles: 'Roles', sales: 'Ventas', 'sales-cash-box': 'Caja de ventas', 'sales-register': 'Registro de ventas', 'site-visits': 'Visitas al sitio', suppliers: 'Proveedores',
  tickets: 'Tickets', 'transaction-banks': 'Bancos agente', 'transaction-types': 'Tipos de transacción', 'units-of-measure': 'Unidades de medida', users: 'Usuarios', health: 'Health check',
};
const isWrite = (e) => e.verb !== 'GET';
const slug = (s) => s.toLowerCase().replace(/[:]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// RAISE codes of a function whose IF condition could not be extracted literally.
const uncoveredRaises = (fn) => {
  const f = A.dbFn.get(fn);
  const covered = new Set(A.sqlGuards(fn).map((g) => g.code));
  return (f?.raises || []).filter((c) => !covered.has(c));
};
// ---------- per-endpoint decision flow ----------
function frontCallers(e) {
  const out = [];
  for (const s of e.services) {
    for (const c of A.callers.get(s.cls + '.' + s.method) || []) {
      out.push({ service: s, caller: c, ui: c.method.calls.filter((x) => /^this\.(notification|notifications|notificationService)\.(success|error|warning|info)$|\.set$|\.emit$|^this\.router\.navigate/.test(x)).slice(0, 6) });
      // one more level: a store method called by a component (e.g. SalesDraftStore.onProductSelected → adjustItem)
    }
  }
  return out;
}
function decisionFlow(e, opts = {}) {
  const ch = new Chart('flowchart TD');
  const files = new Set([e.file]);
  const decisions = [];
  const label = (cls, m, file) => `${enc(cls)}.${enc(m)}<br/><small>${enc(short(file))}</small>`;
  const start = ch.node('start', enc(opts.start || `Inicio: el usuario ejecuta ${e.verb} ${e.path}`), 'oval', 'start');
  const ef = ch.node('ef', 'GlobalExceptionFilter<br/>{ success: false, statusCode, message }', 'proc', 'err');
  const uiErr = ch.node('uierr', 'Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)', 'oval', 'err');
  ch.edge(ef, uiErr);
  const callers = frontCallers(e);
  let httpNode;
  ch.sub('Frontend (Angular)', () => {
    const svcIds = new Map();
    for (const s of e.services) {
      files.add(s.file);
      svcIds.set(s.cls + '.' + s.method, ch.node('svc' + s.cls + s.method, label(s.cls, s.method, s.file), 'proc', 'fe'));
    }
    const shown = callers.slice(0, 4);
    for (const c of shown) {
      files.add(c.caller.file);
      const cid = ch.node('cmp' + c.caller.cls + c.caller.method.name, label(c.caller.cls, c.caller.method.name, c.caller.file) + (A.usedInTemplate(c.caller.cls, c.caller.method.name) ? '<br/>(se invoca desde su plantilla)' : ''), 'proc', 'fe');
      ch.edge(start, cid, 'acción del usuario');
      ch.edge(cid, svcIds.get(c.service.cls + '.' + c.service.method));
    }
    if (!shown.length) for (const id of svcIds.values()) ch.edge(start, id);
    httpNode = ch.node('http', `HTTP ${e.verb} ${enc(e.path)}<br/>authInterceptor agrega Authorization: Bearer`, 'proc', 'fe');
    for (const id of svcIds.values()) ch.edge(id, httpNode);
    if (!svcIds.size) ch.edge(start, httpNode);
  });
  let cur = httpNode;
  const ok = ch.node('ok', `Respuesta ${e.verb === 'POST' ? '201/200' : '200'}: { success: true, data }<br/>(ResponseInterceptor)`, 'proc', 'ok');
  ch.sub('API NestJS — presentación', () => {
    if (e.throttle) {
      const d = ch.node('thr', '¿Dentro del límite de intentos?<br/>(ThrottlerGuard + @Throttle)', 'dec', 'dec');
      ch.edge(cur, d); const x = ch.node('e429', '429 Demasiadas solicitudes', 'oval', 'err'); ch.edge(d, x, 'no'); ch.edge(x, ef); cur = d; decisions.push('límite de intentos (ThrottlerGuard)');
    }
    if (e.jwt) {
      const d = ch.node('jwt', '¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)', 'dec', 'dec');
      ch.edge(cur, d, cur === httpNode ? '' : 'sí'); const x = ch.node('e401', '401 No autorizado<br/>(authInterceptor cierra sesión)', 'oval', 'err'); ch.edge(d, x, 'no'); ch.edge(x, uiErr); cur = d; decisions.push('sesión JWT válida');
    }
    if (e.roles) {
      const d = ch.node('roles', `¿Rol en @Roles(${enc(e.roles)})?<br/>(RolesGuard)`, 'dec', 'dec');
      ch.edge(cur, d, 'sí'); const x = ch.node('e403', '403 Sin permisos', 'oval', 'err'); ch.edge(d, x, 'no'); ch.edge(x, ef); cur = d; decisions.push(`rol ${e.roles}`);
    }
    for (const dto of e.dtos) {
      const d = ch.node('dto' + dto, `¿${enc(dto)} válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)`, 'dec', 'dec');
      ch.edge(cur, d, 'sí'); const x = ch.node('e400' + dto, '400 Datos inválidos', 'oval', 'err'); ch.edge(d, x, 'no'); ch.edge(x, ef); cur = d; decisions.push(`DTO ${dto}`);
    }
    const ct = ch.node('ctl', label(e.controller, e.method.name, e.file), 'proc', 'api');
    ch.edge(cur, ct, cur === httpNode ? '' : 'sí'); cur = ct;
  });
  const tablesAll = new Set();
  const sqlFns = new Set();
  for (const ucName of e.useCases) {
    const uc = A.useCaseChain(ucName);
    if (!uc) continue;
    files.add(uc.file);
    let after;
    let lastWasDecision = false;
    ch.sub('Aplicación — caso de uso', () => {
      const u = ch.node('uc' + ucName, label(ucName, 'execute', uc.file), 'proc', 'app');
      ch.edge(cur, u); cur = u;
      // Steps in source order: `if … throw` guards and calls to assert*/validate* helpers.
      const steps = [
        ...uc.guards.map((g) => ({ kind: 'guard', line: g.line, g })),
        ...uc.helpers.map((h) => ({ kind: 'helper', line: h.at || 0, h })),
      ].sort((a, b) => a.line - b.line);
      let shown = 0;
      const guardNode = (g, key) => {
        const d = ch.node(key, `¿${enc(g.cond)}?${g.line ? '<br/><small>L' + g.line + '</small>' : ''}`, 'dec', 'dec');
        ch.edge(cur, d, lastWasDecision ? 'no' : '');
        const x = ch.node(key + 'x', enc(g.throws.replace(/^new /, '')), 'oval', 'err');
        ch.edge(d, x, 'sí'); ch.edge(x, ef); cur = d; lastWasDecision = true; decisions.push(g.cond);
      };
      for (const st of steps) {
        if (shown >= 12) break;
        if (st.kind === 'guard') { guardNode(st.g, 'g' + ucName + st.line); shown++; continue; }
        const h = st.h;
        files.add(h.file);
        const hn = ch.node('h' + ucName + h.helper, `${enc(h.helper)}()${h.at ? '<br/><small>llamada en L' + h.at + '</small>' : ''}<br/><small>${enc(short(h.file))}</small>`, 'proc', 'dom');
        ch.edge(cur, hn, lastWasDecision ? 'no' : ''); cur = hn; lastWasDecision = false;
        for (const [i, g] of h.guards.slice(0, 6).entries()) { guardNode(g, 'hg' + ucName + h.helper + i); shown++; }
        if (h.guards.length > 6) { const more = ch.node('hm' + ucName + h.helper, `… y ${h.guards.length - 6} validaciones más en ${enc(h.helper)}`, 'proc', 'dec'); ch.edge(cur, more, 'no'); cur = more; lastWasDecision = false; }
      }
      const total = uc.guards.length + uc.helpers.reduce((a, h) => a + h.guards.length, 0);
      if (total > shown && shown >= 12) { const more = ch.node('gm' + ucName, `… y ${total - shown} validaciones más en el código`, 'proc', 'dec'); ch.edge(cur, more, 'no'); cur = more; lastWasDecision = false; }
      after = cur;
    });
    const mainLabel = () => (lastWasDecision ? 'no' : '');
    // Read-only collaborators (find*/get*/exists*/count*, Get*/List*/Validate* use cases): dotted "consulta".
    for (const r of uc.repos.filter((x) => x.readOnly)) {
      const q = ch.node('q' + ucName + r.type, `${r.isUseCase ? 'Caso de uso' : 'Puerto'} ${enc(r.type)}<br/><small>${enc(r.called.join(', '))}</small>`, 'proc', r.isUseCase ? 'app' : 'dom');
      ch.dotted(ch.id('uc' + ucName), q, 'consulta');
      if (r.portFile) files.add(r.portFile);
    }
    for (const r of uc.repos.filter((x) => !x.readOnly).sort((a, b) => a.at - b.at)) {
      if (r.isUseCase) {
        const n2 = ch.node('ouc' + r.type, `Otro caso de uso: ${enc(r.type)}.${enc(r.called.join('/'))}`, 'proc', 'app');
        ch.edge(after, n2, mainLabel());
        continue;
      }
      ch.sub('Dominio → Infraestructura', () => {
        const port = ch.node('port' + r.type, `Puerto ${enc(r.type)}.${enc(r.called.join(' / '))}${r.token ? '<br/>@Inject(' + enc(r.token) + ')' : ''}`, 'proc', 'dom');
        ch.edge(after, port, mainLabel());
        if (r.portFile) files.add(r.portFile);
        for (const impl of r.impls) {
          files.add(impl.file);
          const im = ch.node('impl' + impl.cls, `${enc(impl.cls)}<br/><small>${enc(short(impl.file))}</small>`, 'proc', 'infra');
          ch.edge(port, im, 'implementa');
          for (const m of impl.methods) {
            m.tables.forEach((t) => tablesAll.add(t));
            for (const fn of m.sqlCalls) {
              if (!A.dbFn.has(fn)) continue;
              sqlFns.add(fn);
              const f = A.dbFn.get(fn);
              (f.tablesWritten || []).forEach((t) => tablesAll.add(t));
              ch.sub(`PostgreSQL — función ${fn}`, () => {
                const fnode = ch.node('fn' + fn, `SELECT ${enc(fn)}(…)<br/><small>${enc(m.name)} — una transacción</small>`, 'sub', 'db');
                ch.edge(im, fnode, m.name);
                let c2 = fnode;
                const gs = A.sqlGuards(fn);
                gs.slice(0, 10).forEach((g, i) => {
                  const d = ch.node('sg' + fn + i, `¿${enc(g.cond)}?`, 'dec', 'dec');
                  ch.edge(c2, d, i ? 'no' : '');
                  const x = ch.node('sgx' + fn + i, `RAISE ${enc(g.code)}<br/>(rollback)`, 'oval', 'err');
                  ch.edge(d, x, 'sí'); ch.edge(x, ef); c2 = d; decisions.push(`SQL ${fn}: ${g.cond}`);
                });
                if (gs.length > 10) { const more = ch.node('sgm' + fn, `… y ${gs.length - 10} validaciones más (ver ${fn})`, 'proc', 'dec'); ch.edge(c2, more, 'no'); c2 = more; }
                const unc = uncoveredRaises(fn);
                if (unc.length) { const un = ch.node('sgu' + fn, `Otros RAISE de ${enc(fn)} (condición no extraída):<br/>${unc.slice(0, 8).map(enc).join(', ')}${unc.length > 8 ? ' …' : ''}`, 'proc', 'err'); ch.dotted(fnode, un, 'también puede lanzar'); ch.edge(un, ef); }
                const callees = (f.calls || []).filter((x) => x !== fn && A.dbFn.has(x) && !['now', 'count', 'max', 'gen_random_uuid', 'nextval'].includes(x));
                for (const cal of callees.slice(0, 5)) { const cn = ch.node('cal' + fn + cal, `${enc(cal)}()`, 'sub', 'db'); ch.edge(c2, cn, gs.length ? 'no · llama' : 'llama'); }
                const writes = f.tablesWritten || [];
                if (writes.length) { const tn = ch.node('tw' + fn, `Escribe:<br/>${writes.map(enc).join('<br/>')}`, 'db', 'db'); ch.edge(c2, tn, gs.length ? 'no' : ''); ch.edge(tn, ok, 'COMMIT'); }
                else ch.edge(c2, ok, gs.length ? 'no' : '');
              });
            }
            if (!m.sqlCalls.some((x) => A.dbFn.has(x))) {
              const tn = m.tables.length ? ch.node('tt' + impl.cls + m.name, `${enc(m.name)}: SQL / TypeORM sobre<br/>${m.tables.map(enc).join('<br/>')}`, 'db', 'db') : ch.node('tt' + impl.cls + m.name, `${enc(m.name)}: TypeORM Repository`, 'db', 'db');
              ch.edge(im, tn); ch.edge(tn, ok);
            }
          }
          if (!impl.methods.length) ch.edge(im, ok);
        }
        if (!r.impls.length) ch.edge(port, ok);
      });
    }
    if (!uc.repos.some((x) => !x.readOnly)) ch.edge(after, ok, mainLabel());
  }
  if (!e.useCases.length) ch.edge(cur, ok);
  const ui = ch.node('ui', 'Fin: la interfaz se actualiza' + (callers.length && callers[0].ui.length ? '<br/>' + callers[0].ui.map(enc).join('<br/>') : ''), 'oval', 'ok');
  ch.edge(ok, ui);
  return { chart: ch, files, decisions, sqlFns, tables: tablesAll, callers };
}

// ---------- sequence ----------
const seqEnc = (s) => enc(s);
function sequence(e, title) {
  const L = ['sequenceDiagram', '  autonumber', '  actor U as Usuario'];
  const callers = frontCallers(e).slice(0, 1);
  const files = new Set([e.file]);
  const c = callers[0];
  if (c) { L.push(`  participant C as ${seqEnc(c.caller.cls)}`); files.add(c.caller.file); }
  const s = e.services[0];
  if (s) { L.push(`  participant S as ${seqEnc(s.cls)}`); files.add(s.file); }
  L.push('  participant G as API (guards y ValidationPipe)', `  participant CT as ${seqEnc(e.controller)}`);
  const ucs = e.useCases.map((u) => A.useCaseChain(u)).filter(Boolean);
  ucs.forEach((u, i) => { L.push(`  participant UC${i} as ${seqEnc(u.name)}`); files.add(u.file); });
  const repos = ucs.flatMap((u) => u.repos.filter((r) => !r.isUseCase && r.impls.length));
  const implNames = [...new Set(repos.flatMap((r) => r.impls.map((i) => i.cls)))];
  implNames.forEach((n, i) => L.push(`  participant R${i} as ${seqEnc(n)}`));
  L.push('  participant DB as PostgreSQL');
  if (c) { L.push(`  U->>C: ${seqEnc(c.caller.method.name)}()`); L.push(`  C->>S: ${seqEnc(s.method)}(…)`); L.push(`  S->>G: ${e.verb} ${seqEnc(e.path)} + Bearer JWT`); }
  else if (s) { L.push(`  U->>S: ${seqEnc(s.method)}(…)`); L.push(`  S->>G: ${e.verb} ${seqEnc(e.path)}`); }
  else L.push(`  U->>G: ${e.verb} ${seqEnc(e.path)}`);
  const back = c ? 'C' : s ? 'S' : 'U';
  const gl = [e.throttle && 'límite de intentos', e.jwt && 'JWT válido y usuario activo', e.roles && `rol ${e.roles}`, e.dtos.length && `DTO ${e.dtos.join(', ')}`].filter(Boolean);
  if (gl.length) {
    L.push(`  alt falla ${seqEnc(gl.join(' / '))}`, `    G-->>${back}: 400 / 401 / 403 / 429 con success false`, '  else permitido');
  }
  L.push(`  G->>CT: ${seqEnc(e.method.name)}(dto, usuario del JWT)`);
  ucs.forEach((u, i) => {
    L.push(`  CT->>UC${i}: execute(input)`);
    const gs = [...u.guards, ...u.helpers.flatMap((h) => h.guards)];
    for (const g of gs.slice(0, 5)) L.push(`  opt ${seqEnc(g.cond)}`, `    UC${i}-->>G: ${seqEnc(g.throws.replace(/^new /, ''))}`, '  end');
    if (gs.length > 5) L.push(`  Note over UC${i}: … y ${gs.length - 5} validaciones más`);
    for (const r of u.repos) {
      if (r.isUseCase) { L.push(`  UC${i}->>UC${i}: ${seqEnc(r.type)}.${seqEnc(r.called.join('/'))}`); continue; }
      for (const impl of r.impls) {
        const ri = implNames.indexOf(impl.cls);
        files.add(impl.file);
        L.push(`  UC${i}->>R${ri}: ${seqEnc(r.called.join(' / '))}()`);
        for (const m of impl.methods) {
          const fns = m.sqlCalls.filter((x) => A.dbFn.has(x));
          for (const fn of fns) {
            const f = A.dbFn.get(fn);
            L.push(`  R${ri}->>DB: SELECT ${seqEnc(fn)}(…)`);
            const gs2 = A.sqlGuards(fn);
            if (gs2.length) L.push(`  Note over DB: valida ${gs2.length} reglas (${seqEnc(gs2.slice(0, 3).map((g) => g.code).join(', '))}${gs2.length > 3 ? ', …' : ''})`);
            if ((f.tablesWritten || []).length) L.push(`  Note over DB: escribe ${seqEnc(f.tablesWritten.join(', '))}`);
            L.push(`  alt RAISE EXCEPTION`, `    DB-->>R${ri}: error con código`, `    R${ri}-->>G: DomainError (traducido)`, '  else COMMIT', `    DB-->>R${ri}: resultado`, '  end');
          }
          if (!fns.length && m.tables.length) { L.push(`  R${ri}->>DB: SQL / TypeORM sobre ${seqEnc(m.tables.slice(0, 4).join(', '))}`); L.push(`  DB-->>R${ri}: filas`); }
        }
        L.push(`  R${ri}-->>UC${i}: datos`);
      }
    }
    L.push(`  UC${i}-->>CT: salida`);
  });
  L.push('  CT-->>G: objeto', `  G-->>${back}: success true con data`);
  if (gl.length) L.push('  end');
  if (c) L.push(`  C-->>U: actualiza la interfaz${c.ui.length ? ' (' + seqEnc(c.ui.slice(0, 3).join(', ')) + ')' : ''}`);
  return { text: L.join('\n'), files };
}

// ---------- 1) per-endpoint decision flows ----------
const PROCESS_NAMES = {
  'POST /api/auth/login': 'Inicio de sesión',
  'POST /api/users': 'Creación de usuarios (administración)',
  'POST /api/sales/items': 'Venta: agregar o ajustar un producto del recibo (reserva de stock)',
  'POST /api/sales/confirm': 'Venta: confirmar ("Guardar venta")',
  'POST /api/purchases': 'Registro de compras',
  'POST /api/bank-deposits': 'Transaccionar: depósitos, retiros, desembolsos y pagos Génesis, reintegros',
  'POST /api/bank-deposits/:id/void': 'Transaccionar: anular una operación',
  'POST /api/bank-transfers': 'Transferencias bancarias y retiro de efectivo en banco',
  'POST /api/banks/day-status/open': 'Apertura del día bancario',
  'POST /api/banks/balances': 'Guardar saldos bancarios del día',
  'POST /api/agent-reconciliations': 'Cuadre de Agentes y cierre del día',
  'POST /api/cash-control/days/open': 'Control de Efectivo: apertura del día operativo de efectivo',
  'POST /api/cash-control/cuts/:id/start': 'Control de Efectivo: iniciar corte',
  'POST /api/cash-control/cuts/:id/finish': 'Control de Efectivo: finalizar corte (arqueo del corte)',
  'POST /api/cash-control/movements': 'Control de Efectivo: entrada / salida / ajuste manual',
  'POST /api/cash-control/bank-deposits': 'Control de Efectivo: depósito de caja a cuenta bancaria',
  'POST /api/cash-control/counts': 'Arqueo de Caja (con conteo opcional de Bodega = arqueo de Bodega)',
  'POST /api/cash-control/warehouse/transfers': 'Entrega de efectivo a Bodega',
  'POST /api/cash-control/warehouse/withdrawals': 'Retiro de Bodega (a caja o a cuenta)',
  'POST /api/account-receivable-payments': 'Pago / cancelación de Cuentas por Cobrar',
  'POST /api/recharges/purchases': 'Recargas: compra de saldo',
  'POST /api/recharges/sales-closure': 'Recargas: cuadre de ventas',
};
const flowIndex = new Map();
for (const e of A.endpoints.filter(isWrite)) {
  const mod = moduleOf(e.file);
  const key = `${e.verb} ${e.path}`;
  const rel = `business-processes/${mod}/${slug(e.verb + '-' + e.path.replace(/^\/api\//, ''))}.mmd`;
  const df = decisionFlow(e, { start: PROCESS_NAMES[key] ? `Inicio: ${PROCESS_NAMES[key]}` : undefined });
  const caller = df.callers[0];
  emit(rel, {
    titulo: PROCESS_NAMES[key] || `${e.verb} ${e.path}`,
    modulo: `${MODULE_NAMES[mod] || mod} (${mod})`,
    representa: `Flujo de decisiones real de ${key}: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).`,
    inicio: caller ? `${caller.caller.cls}.${caller.caller.method.name} (${caller.caller.file})` : e.services[0] ? `${e.services[0].cls}.${e.services[0].method}` : `cliente HTTP → ${key}`,
    archivos: [...df.files].join(' ; '),
    decisiones: df.decisions.length ? df.decisions.slice(0, 14).join(' | ') : 'solo guards del framework',
    datos: [...df.sqlFns].map((f) => f + '()').concat([...df.tables]).join(', ') || 'ver repositorio',
    fin: 'Respuesta { success: true, data } y actualización de la pantalla',
    errores: 'Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción',
  }, df.chart.text());
  flowIndex.set(key, rel);
}

// ---------- 2) module maps (one per controller) ----------
const controllers = new Map();
for (const e of A.endpoints) {
  const k = e.file + '#' + e.controller;
  if (!controllers.has(k)) controllers.set(k, []);
  controllers.get(k).push(e);
}
for (const [k, eps] of controllers) {
  const [file, ctl] = k.split('#');
  const mod = moduleOf(file);
  const parts = eps.length > 24 ? [['comandos', eps.filter(isWrite)], ['consultas', eps.filter((e) => !isWrite(e))]] : [['', eps]];
  for (const [suffix, list] of parts) {
    if (!list.length) continue;
    const ch = new Chart('flowchart LR');
    const files = new Set([file]);
    const tablesUsed = new Set();
    const comps = new Map();
    ch.sub('Frontend', () => {
      for (const e of list) for (const s of e.services) {
        files.add(s.file);
        const sid = ch.node('s' + s.cls, `${enc(s.cls)}<br/><small>${enc(short(s.file))}</small>`, 'proc', 'fe');
        for (const c of A.callers.get(s.cls + '.' + s.method) || []) {
          files.add(c.file);
          const cid = ch.node('c' + c.cls, `${enc(c.cls)}<br/><small>${enc(short(c.file))}</small>`, 'proc', 'fe');
          const ek = cid + '>' + sid;
          if (!comps.has(ek)) { comps.set(ek, new Set()); }
          comps.get(ek).add(c.method.name + '→' + s.method);
        }
      }
      for (const [ek, ms] of comps) { const [a, b] = ek.split('>'); ch.edge(a, b, [...ms].slice(0, 3).join(', ') + (ms.size > 3 ? ' …' : '')); }
    });
    ch.sub(`${ctl} (${short(file)})`, () => {
      for (const e of list) ch.node('e' + e.verb + e.path, `${e.verb} ${enc(e.path)}<br/><small>${enc(e.method.name)}()${e.roles ? ' · ' + enc(e.roles) : ''}</small>`, 'proc', 'api');
    });
    for (const e of list) for (const s of e.services) ch.edge(ch.id('s' + s.cls), ch.id('e' + e.verb + e.path), s.method);
    ch.sub('Aplicación', () => {
      for (const e of list) for (const u of e.useCases) { const uc = A.useCaseChain(u); if (uc) { files.add(uc.file); ch.node('u' + u, `${enc(u)}<br/><small>${enc(short(uc.file))}</small>`, 'proc', 'app'); } }
    });
    for (const e of list) for (const u of e.useCases) if (A.useCaseChain(u)) ch.edge(ch.id('e' + e.verb + e.path), ch.id('u' + u));
    const portEdges = new Set();
    ch.sub('Dominio · Infraestructura · PostgreSQL', () => {
      for (const e of list) for (const u of e.useCases) {
        const uc = A.useCaseChain(u);
        if (!uc) continue;
        for (const r of uc.repos) {
          if (r.isUseCase) { const o = ch.node('u' + r.type, enc(r.type), 'proc', 'app'); portEdges.add(`${ch.id('u' + u)}|${o}|${r.called.join('/')}`); continue; }
          const p = ch.node('p' + r.type, enc(r.type), 'proc', 'dom');
          portEdges.add(`${ch.id('u' + u)}|${p}|${r.called.slice(0, 3).join(', ')}${r.called.length > 3 ? ' …' : ''}`);
          for (const impl of r.impls) {
            files.add(impl.file);
            const i = ch.node('i' + impl.cls, `${enc(impl.cls)}<br/><small>${enc(short(impl.file))}</small>`, 'proc', 'infra');
            portEdges.add(`${p}|${i}|implementa`);
            for (const m of impl.methods) {
              for (const fn of m.sqlCalls.filter((x) => A.dbFn.has(x))) {
                const f = ch.node('f' + fn, `${enc(fn)}()`, 'sub', 'db');
                portEdges.add(`${i}|${f}|${m.name}`);
                for (const t of A.dbFn.get(fn).tablesWritten || []) { tablesUsed.add(t); portEdges.add(`${f}|${ch.node('t' + t, enc(t), 'db', 'db')}|escribe`); }
              }
              for (const t of m.tables.slice(0, 6)) { tablesUsed.add(t); portEdges.add(`${i}|${ch.node('t' + t, enc(t), 'db', 'db')}|${m.name}`); }
            }
          }
        }
      }
    });
    for (const pe of portEdges) { const [a, b, l] = pe.split('|'); ch.edge(a, b, l); }
    const rel = `modules/${mod}/${slug(ctl)}${suffix ? '-' + suffix : ''}.mmd`;
    emit(rel, {
      titulo: `Mapa de ${ctl}${suffix ? ' (' + suffix + ')' : ''}`,
      modulo: `${MODULE_NAMES[mod] || mod} (${mod})`,
      representa: `Relación real entre archivos: componentes y servicios Angular que llaman a ${ctl}, sus ${list.length} rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.`,
      inicio: 'Componentes Angular (izquierda) o cualquier cliente HTTP',
      archivos: [...files].join(' ; '),
      decisiones: `Ver los flujos de decisiones de cada comando en business-processes/${mod}/`,
      datos: [...tablesUsed].join(', ') || 'sin tablas detectadas',
      fin: 'Las flechas terminan en las tablas de PostgreSQL',
      errores: 'Los errores siguen el patrón de 07-error-handling.mmd',
    }, ch.text());
  }
}

// ---------- 3) sequences (curated, existing endpoints only) ----------
const missingProcesses = [];
for (const [key, name] of Object.entries(PROCESS_NAMES)) {
  const [verb, p] = key.split(' ');
  const e = A.endpoints.find((x) => x.verb === verb && x.path === p);
  if (!e) { missingProcesses.push(key); continue; }
  const sq = sequence(e, name);
  emit(`sequences/${slug(name).slice(0, 70)}.mmd`, {
    titulo: `Secuencia — ${name}`,
    modulo: `${MODULE_NAMES[moduleOf(e.file)] || moduleOf(e.file)} (${moduleOf(e.file)})`,
    representa: `Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para ${key}, con las validaciones y la transacción`,
    inicio: e.services[0] ? `${e.services[0].cls}.${e.services[0].method}` : key,
    archivos: [...sq.files].join(' ; '),
    decisiones: `Bloques alt/opt = validaciones reales; flujo completo en ${flowIndex.get(key) || '—'}`,
    datos: 'PostgreSQL (ver notas "escribe")',
    fin: 'success true con data y actualización de la interfaz',
    errores: 'Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }',
  }, sq.text);
}

// ---------- 4) database ----------
{
  const db = A.db;
  const tableModules = new Map();
  const add = (t, mod, kind) => { if (!tableModules.has(t)) tableModules.set(t, new Map()); const m = tableModules.get(t); if (!m.has(mod)) m.set(mod, new Set()); m.get(mod).add(kind); };
  for (const f of A.model.files) {
    if (!A.isApi(f.path) || f.path.includes('/migrations/') || f.path.endsWith('.spec.ts') || !f.path.includes('/modules/')) continue;
    const mod = moduleOf(f.path);
    const src = fs.readFileSync(path.join(ROOT, f.path), 'utf8');
    for (const m of src.matchAll(/@Entity\(\s*(?:\{\s*name:\s*)?['"]([a-z_0-9]+)['"]/g)) add(m[1], mod, 'entidad ORM');
    for (const m of src.matchAll(/\b(?:INSERT INTO|UPDATE|DELETE FROM)\s+"?([a-z_][a-z0-9_]+)\b/g)) add(m[1], mod, 'escribe (SQL)');
    for (const t of f.tablesMentioned) add(t, mod, 'consulta');
    for (const c of f.classes) for (const m of c.methods) for (const fn of m.sqlCalls) for (const t of A.dbFn.get(fn)?.tablesWritten || []) add(t, mod, `escribe vía ${fn}()`);
  }
  const tables = new Map(db.tables.map((t) => [t.name, t]));
  const groupOf = (t) => {
    const m = tableModules.get(t);
    if (!m) return 'otros';
    return [...m].sort((a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0]))[0][0];
  };
  const groups = new Map();
  for (const t of db.tables) { const g = t.name === 'migrations' ? 'otros' : groupOf(t.name); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(t); }
  const typeId = (s) => s.replace(/\(.*\)/, '').replace(/[^a-zA-Z0-9]+/g, '_');
  for (const [g, list] of groups) {
    const names = new Set(list.map((t) => t.name));
    const L = ['erDiagram'];
    const ext = new Set();
    const rels = new Set();
    for (const t of list) {
      const pk = new Set(), fk = new Set();
      for (const k of t.constraints || []) {
        if (k.type === 'p') (k.def.match(/\(([^)]+)\)/) || [null, ''])[1].split(',').forEach((c) => pk.add(c.trim().replace(/"/g, '')));
        if (k.type === 'f' && k.ref) {
          const cols = (k.def.match(/FOREIGN KEY \(([^)]+)\)/) || [null, ''])[1].split(',').map((c) => c.trim().replace(/"/g, ''));
          cols.forEach((c) => fk.add(c));
          const ref = k.ref.replace(/"/g, '');
          if (!names.has(ref)) ext.add(ref);
          const nullable = cols.some((c) => !(t.columns.find((x) => x.name === c) || {}).notnull);
          const unique = (t.constraints || []).some((u) => (u.type === 'u' || u.type === 'p') && (u.def.match(/\(([^)]+)\)/) || [null, ''])[1].replace(/"/g, '').split(',').map((x) => x.trim()).join(',') === cols.join(','));
          rels.add(`  ${ref} ${nullable ? '|o' : '||'}--${unique ? 'o|' : 'o{'} ${t.name} : "${cols.join(',')}"`);
        }
      }
      const important = t.columns.filter((c) => pk.has(c.name) || fk.has(c.name) || /status|amount|total|balance|date|type|quantity|name|number|direction/.test(c.name)).slice(0, 12);
      L.push(`  ${t.name} {`);
      for (const c of important) L.push(`    ${typeId(c.type)} ${c.name}${pk.has(c.name) ? ' PK' : fk.has(c.name) ? ' FK' : ''}`);
      L.push('  }');
    }
    for (const e of ext) L.push(`  ${e} {`, '    uuid id PK', '  }');
    emit(`database/er-${g}.mmd`, {
      titulo: `Modelo entidad-relación — ${MODULE_NAMES[g] || g}`,
      modulo: `${MODULE_NAMES[g] || g} (${g})`,
      representa: `Tablas del dominio ${g} (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)`,
      inicio: 'Esquema real de PostgreSQL (pg_catalog)',
      archivos: 'comercial-jhoel-api/src/database/migrations (definición) ; docs/codebase-study/05_DATABASE_REFERENCE.md (todas las columnas por tabla)',
      decisiones: 'No aplica (estructura)',
      datos: list.map((t) => t.name).join(', '),
      fin: 'No aplica',
      errores: 'Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)',
    }, [...L, ...rels].join('\n'));
    // module usage
    const ch = new Chart('flowchart LR');
    for (const t of list) {
      const tn = ch.node('t' + t.name, enc(t.name), 'db', 'db');
      for (const [mod, kinds] of tableModules.get(t.name) || []) {
        const mn = ch.node('m' + mod, `${enc(MODULE_NAMES[mod] || mod)}<br/><small>api/${enc(mod)}</small>`, 'proc', 'app');
        const k = [...kinds].sort();
        ch.edge(mn, tn, k.slice(0, 2).join(' · ') + (k.length > 2 ? ' …' : ''));
      }
    }
    emit(`database/table-usage-${g}.mmd`, {
      titulo: `Qué módulos usan las tablas — ${MODULE_NAMES[g] || g}`,
      modulo: `${MODULE_NAMES[g] || g} (${g})`,
      representa: 'Módulos del backend que usan cada tabla y cómo: entidad TypeORM, consulta SQL, escritura SQL directa o escritura a través de una función PL/pgSQL',
      inicio: 'Código de comercial-jhoel-api/src/modules (sin migraciones ni pruebas)',
      archivos: 'comercial-jhoel-api/src/modules (repositorios en infrastructure/persistence de cada módulo)',
      decisiones: 'No aplica',
      datos: list.map((t) => t.name).join(', '),
      fin: 'No aplica',
      errores: 'No aplica',
    }, ch.text());
  }
}

// ---------- 4b) module dependencies (imports between backend modules) ----------
{
  const byPath = A.byPath;
  const resolveImport = (from, spec) => {
    if (!spec.startsWith('.')) return null;
    const base = path.normalize(path.join(path.dirname(from), spec));
    for (const c of [base + '.ts', path.join(base, 'index.ts')]) if (byPath.has(c)) return c;
    return null;
  };
  const edges = new Map();
  for (const f of A.model.files) {
    if (!f.path.includes('comercial-jhoel-api/src/modules/') || f.path.endsWith('.spec.ts')) continue;
    const a = moduleOf(f.path);
    for (const imp of f.imports) {
      const r = resolveImport(f.path, imp.spec);
      if (!r || !r.includes('/modules/')) continue;
      const b = moduleOf(r);
      if (a === b) continue;
      const k = a + '>' + b;
      if (!edges.has(k)) edges.set(k, { n: 0, layers: new Set() });
      edges.get(k).n++;
      edges.get(k).layers.add((r.match(/\/(domain|application|infrastructure|presentation)\//) || [null, 'módulo'])[1]);
    }
  }
  const ch = new Chart('flowchart LR');
  for (const [k, v] of [...edges].sort()) {
    const [a, b] = k.split('>');
    const na = ch.node('m' + a, `${enc(MODULE_NAMES[a] || a)}<br/><small>${enc(a)}</small>`, 'proc', 'app');
    const nb = ch.node('m' + b, `${enc(MODULE_NAMES[b] || b)}<br/><small>${enc(b)}</small>`, 'proc', 'app');
    ch.edge(na, nb, `${v.n} · ${[...v.layers].join('/')}`);
  }
  emit('06-module-dependencies.mmd', {
    titulo: '06 · Dependencias entre módulos del backend',
    modulo: 'Arquitectura general',
    representa: 'Qué módulo del backend importa archivos de otro (cantidad de imports y capa importada: domain = puertos/entidades/errores, application = casos de uso, infrastructure, presentation). Calculado de los import reales, sin pruebas ni migraciones.',
    inicio: 'Imports de comercial-jhoel-api/src/modules/**',
    archivos: 'comercial-jhoel-api/src/modules (todos los *.ts sin pruebas)',
    decisiones: 'No aplica',
    datos: 'No aplica',
    fin: 'No aplica',
    errores: 'No aplica',
  }, ch.text());
}

// ---------- 4c) single writers of balances: SQL decision flows ----------
for (const fn of ['apply_bank_account_movement', 'apply_cash_movement', 'apply_warehouse_cash_movement', 'apply_guayacan_cash_movement', 'register_bank_transfer', 'register_cash_warehouse_transfer', 'register_warehouse_withdrawal', 'register_cash_bank_deposit']) {
  const f = A.dbFn.get(fn);
  if (!f) continue;
  const ch = new Chart('flowchart TD');
  const s0 = ch.node('s', `${enc(fn)}(${enc((f.args || '').split(',').map((x) => x.trim().split(' ')[0]).join(', ').slice(0, 160))})`, 'oval', 'start');
  const err = ch.node('e', 'RAISE EXCEPTION → rollback de toda la transacción', 'oval', 'err');
  let cur = s0;
  const gs = A.sqlGuards(fn);
  gs.forEach((g, i) => {
    const d = ch.node('g' + i, `¿${enc(g.cond)}?`, 'dec', 'dec');
    ch.edge(cur, d, i ? 'no' : '');
    const x = ch.node('x' + i, enc(g.code), 'proc', 'err');
    ch.edge(d, x, 'sí'); ch.edge(x, err); cur = d;
  });
  for (const c of (f.calls || []).filter((x) => x !== fn && A.dbFn.has(x) && !['now', 'count', 'max', 'gen_random_uuid', 'nextval'].includes(x))) {
    const cn = ch.node('c' + c, `${enc(c)}()`, 'sub', 'db'); ch.edge(cur, cn, gs.length ? 'no · llama' : 'llama');
  }
  const unc = uncoveredRaises(fn);
  if (unc.length) { const un = ch.node('u', `Otros RAISE (condición no extraída del código):<br/>${unc.map(enc).join(', ')}`, 'proc', 'err'); ch.dotted(s0, un, 'también puede lanzar'); ch.edge(un, err); }
  const locks = f.locks || [];
  const w = ch.node('w', `${locks.length ? 'Bajo pg_advisory_xact_lock: ' + locks.map(enc).join(', ') + '<br/>' : ''}Escribe: ${(f.tablesWritten || []).map(enc).join(', ') || '—'}`, 'db', 'db');
  ch.edge(cur, w, gs.length ? 'no' : '');
  const ok = ch.node('ok', `RETURN ${enc(f.returns)}`, 'oval', 'ok');
  ch.edge(w, ok);
  const callers = [];
  for (const file of A.model.files) for (const c of file.classes) for (const m of c.methods) if (m.sqlCalls.includes(fn) && !file.path.includes('/migrations/')) callers.push(`${c.name}.${m.name} (${file.path})`);
  const sqlCallers = (A.db.functions || []).filter((x) => (x.calls || []).includes(fn) && x.name !== fn).map((x) => x.name + '()');
  emit(`business-processes/financial/sql-${fn.replace(/_/g, '-')}.mmd`, {
    titulo: `Función ${fn}: validaciones y escritura`,
    modulo: 'Base de datos — escritores de saldos y transferencias',
    representa: `Las reglas IF … RAISE EXCEPTION de ${fn} en el orden del código fuente de la función, y las tablas que escribe. Es la única forma en que el sistema modifica ese saldo.`,
    inicio: callers.length ? callers.slice(0, 4).join(' · ') : sqlCallers.length ? 'llamada desde ' + sqlCallers.slice(0, 6).join(', ') : 'llamada desde otras funciones',
    archivos: 'comercial-jhoel-api/src/database/migrations (última migración que define ' + fn + ')' + (callers.length ? ' ; ' + [...new Set(callers.map((c) => c.match(/\((.*)\)$/)[1]))].slice(0, 6).join(' ; ') : ''),
    decisiones: (gs.map((g) => g.code).join(', ') || 'sin reglas IF … RAISE de forma simple') + (unc.length ? ' · además lanza (condición no extraída): ' + unc.join(', ') : ''),
    datos: (f.tablesWritten || []).join(', '),
    fin: `RETURN ${f.returns} dentro de la transacción de quien la llamó`,
    errores: 'Cada RAISE revierte también lo que hizo la función que la llamó' + (sqlCallers.length ? ` (${sqlCallers.slice(0, 6).join(', ')})` : ''),
  }, ch.text());
}

// ---------- 5) companion .md for every .mmd + README ----------
const walk = (d, acc = []) => { if (!fs.existsSync(d)) return acc; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); e.isDirectory() ? walk(f, acc) : acc.push(f); } return acc; };
const mmds = walk(OUT).filter((f) => f.endsWith('.mmd')).sort();
const parseMeta = (src) => Object.fromEntries([...src.matchAll(/^%% @([a-z]+): (.*)$/gm)].map((m) => [m[1], m[2]]));
const ROOTREL = (from) => path.relative(path.dirname(from), ROOT);
const linkFile = (from, p) => {
  const clean = p.trim().replace(/\s*\(.*\)$/, '');
  return fs.existsSync(path.join(ROOT, clean)) ? `[\`${clean}\`](${path.join(ROOTREL(from), clean)})` : `\`${p.trim()}\``;
};
const catalog = [];
for (const f of mmds) {
  const src = fs.readFileSync(f, 'utf8');
  const meta = parseMeta(src);
  const body = src.split('\n').filter((l) => !l.startsWith('%%')).join('\n').trim();
  const md = f.replace(/\.mmd$/, '.md');
  const rel = path.relative(OUT, f);
  const depth = path.relative(path.dirname(md), OUT) || '.';
  const files = (meta.archivos || '').split(' ; ').filter(Boolean);
  write(md, [
    `# ${meta.titulo || path.basename(f)}`, '',
    `Módulo: **${meta.modulo || '—'}** · Fuente editable: [\`${path.basename(f)}\`](${path.basename(f)}) · [Índice de diagramas](${path.join(depth, 'README.md')})`, '',
    '```mermaid', body, '```', '',
    '## Explicación', '',
    `1. **¿Qué proceso representa?** ${meta.representa || '—'}`,
    `2. **¿Dónde comienza?** ${meta.inicio || '—'}`,
    `3. **¿Qué archivos intervienen?** ${files.length ? files.slice(0, 25).map((p) => linkFile(md, p)).join(', ') + (files.length > 25 ? ` y ${files.length - 25} más` : '') : '—'}`,
    `4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (\`Clase.metodo\`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.`,
    `5. **¿Qué decisiones toma el sistema?** ${meta.decisiones || '—'}`,
    `6. **¿Dónde se almacenan los datos?** ${meta.datos || '—'}`,
    `7. **¿Cómo termina el proceso?** ${meta.fin || '—'}`,
    `8. **¿Qué sucede cuando ocurre un error?** ${meta.errores || '—'}`,
    '', meta.generado ? '> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).' : '> Diagrama escrito a mano a partir del código; ver la sección de archivos.', '',
  ].join('\n'));
  catalog.push({ rel, md: path.relative(OUT, md), meta, generated: src.includes('@generado') });
}
const section = (title, filter, intro) => {
  const rows = catalog.filter(filter);
  if (!rows.length) return [];
  return [`## ${title}`, '', intro, '', '| Diagrama | Módulo | Descripción | Archivos fuente (principales) |', '|---|---|---|---|',
    ...rows.map((r) => `| [${(r.meta.titulo || r.rel).replace(/\|/g, '/')}](${r.md}) · [mmd](${r.rel}) | ${(r.meta.modulo || '').replace(/\|/g, '/')} | ${(r.meta.representa || '').replace(/\|/g, '/').slice(0, 220)} | ${(r.meta.archivos || '').split(' ; ').filter(Boolean).slice(0, 3).map((p) => '`' + short(p.trim()) + '`').join(', ')} |`), ''];
};
const fixedOrder = (r) => /^0\d-/.test(r.rel);
const README = [
  '# Diagramas de flujo del sistema — Comercial Jhoel', '',
  'Documentación visual construida **a partir del código fuente real**. Los diagramas de arquitectura `01`–`05` y `07`–`09`, `business-processes/financial/transaccionar-balance-effects` y `cash-custody-movements` se escribieron a mano, citando archivos y métodos verificados. Todo lo demás lo genera `docs/codebase-study/tools/flowcharts.js` desde el análisis del código y el esquema de PostgreSQL:',
  '',
  '- **Nodos**: clases, métodos, endpoints, funciones SQL y tablas que existen.',
  '- **Flechas**: llamadas, inyección por constructor o `@Inject`, relaciones `implements` y escrituras de funciones SQL.',
  '- **Rombos**: condiciones literales de los `if … throw` y de los `IF … RAISE EXCEPTION`.',
  '',
  'La estructura sigue la propuesta original, con los nombres **adaptados a los módulos reales** del backend: `modules/<modulo>/<controlador>.mmd`, `business-processes/<modulo>/<operacion>.mmd`, `sequences/<proceso>.mmd`, y además `database/` y `business-processes/financial/`.', '',
  'Cada diagrama tiene dos archivos: el `.mmd` (fuente Mermaid editable) y un `.md` con el diagrama y su explicación (qué representa, dónde comienza, archivos, decisiones, datos, fin y errores).', '',
  '## Cómo visualizarlos', '',
  '- **GitHub:** abre el `.md`; los bloques ` ```mermaid ` se dibujan solos. GitHub no dibuja los `.mmd` sueltos.',
  '- **VS Code:** instala la extensión *Markdown Preview Mermaid Support* (`bierner.markdown-mermaid`) y usa la vista previa del `.md` (`Ctrl+Shift+V`). Para editar un `.mmd` con vista en vivo sirve *Mermaid Chart* o *Mermaid Preview*.',
  '- **Sin instalar nada:** pega el contenido del `.mmd` en https://mermaid.live.',
  '- **Colores:** azul = frontend · morado = controlador/API · verde azulado = caso de uso · amarillo = dominio/puerto · lila = infraestructura · gris = PostgreSQL · amarillo claro = decisión · rojo = error · verde = inicio/fin correcto. **Formas:** óvalo = inicio/fin, rectángulo = proceso, rombo = decisión, cilindro = tabla, rectángulo doble = función SQL.', '',
  '## Orden recomendado de estudio', '',
  '1. `01-system-overview` → `02-frontend-architecture` → `03-backend-architecture` → `04-database-architecture`.',
  '2. `05-authentication-flow` → `07-error-handling` → `08-realtime-updates` → `09-external-integrations` → `06-module-dependencies`.',
  '3. Procesos financieros escritos a mano (`business-processes/financial/`): cómo se mueven los saldos.',
  '4. Secuencias (`sequences/`) de los procesos clave, en este orden: inicio de sesión, venta, compra, Transaccionar, apertura del día, saldos, Cuadre de Agentes, Control de Efectivo, CxC.',
  '5. Para cada módulo que vayas a modificar: su mapa (`modules/<modulo>/`) y luego los flujos de decisiones de sus comandos (`business-processes/<modulo>/`).',
  '6. Base de datos (`database/`): el ER del dominio y qué módulos usan cada tabla.', '',
  ...section('1. Arquitectura', fixedOrder, 'Vista general y diagramas por aspecto.'),
  ...section('2. Procesos financieros: saldos, entradas, salidas y transferencias', (r) => r.rel.startsWith('business-processes/financial/'), 'Los dos primeros se escribieron a mano a partir del SQL. Los `sql-*` se generan de las reglas `IF … RAISE` de cada función que escribe un saldo.'),
  ...section('3. Diagramas de secuencia', (r) => r.rel.startsWith('sequences/'), 'Procesos principales: Usuario → componente → servicio → API → controlador → caso de uso → repositorio → PostgreSQL.'),
  ...section('4. Mapas por módulo (relaciones entre archivos)', (r) => r.rel.startsWith('modules/'), 'Uno por controlador. Los controladores con más de 24 rutas se dividen en comandos y consultas.'),
  ...section('5. Flujos de decisiones de cada operación que escribe datos', (r) => r.rel.startsWith('business-processes/') && !r.rel.startsWith('business-processes/financial/'), 'Uno por endpoint POST, PATCH, PUT o DELETE, agrupados por módulo.'),
  ...section('6. Base de datos', (r) => r.rel.startsWith('database/'), 'ER por dominio (con cardinalidad) y uso de las tablas por módulo.'),
  '## Cobertura y límites', '',
  `- Procesos de la lista que no existen como endpoint: ${missingProcesses.length ? missingProcesses.map((x) => '`' + x + '`').join(', ') : 'ninguno'}.`,
  '- **"Arqueo de Bodega"** no es un endpoint aparte: es el campo opcional `warehouseCounted` del Arqueo de Caja (`POST /api/cash-control/counts`, `register_cash_count`).',
  '- **"Desembolsos", "Pagos de préstamos" y "Reintegros"** son tipos de transacción de Transaccionar (`transaction_types.balance_effect` `DESEMBOLSO_GENESIS`, `PAGO_GENESIS`, `REINTEGRO`) y no tienen endpoints propios. Ver `business-processes/financial/transaccionar-balance-effects`.',
  '- No existe un módulo de **"Gastos"**: las salidas de efectivo se registran como movimientos manuales de Control de Efectivo (`POST /api/cash-control/movements`) o como cargos de CxC.',
  '- Los módulos solo de frontend (landing, catálogo público) y las pantallas que solo leen datos aparecen en los mapas por módulo (secciones de consultas) y en `02-frontend-architecture`.',
  '- Límites del análisis automático: los consumidores de un método se resuelven por las propiedades inyectadas; las tablas se detectan con expresiones regulares; las condiciones SQL anidadas solo se muestran cuando se demuestran como `A THEN IF B`. Lo demás se omite (indicado como "… y N validaciones más"). Ver `docs/codebase-study/13_FINDINGS.md`.', '',
];
write(path.join(OUT, 'README.md'), README.join('\n'));
console.log({ diagrams: mmds.length, generated: catalog.filter((c) => c.generated).length, writeFlows: flowIndex.size, missingProcesses });
