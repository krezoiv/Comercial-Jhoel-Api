// Renders the generated (reference) part of docs/codebase-study from model.json
// + db.json. Every fact comes from the parsed source or the live schema.
const fs = require('fs');
const path = require('path');
const [ROOT, MODEL, DBJSON] = process.argv.slice(2);
const OUT = path.join(ROOT, 'docs/codebase-study');
const model = JSON.parse(fs.readFileSync(MODEL, 'utf8'));
const db = JSON.parse(fs.readFileSync(DBJSON, 'utf8').split('\n').find((l) => l.startsWith('{')));

const mkdir = (d) => fs.mkdirSync(d, { recursive: true });
const write = (f, s) => {
  mkdir(path.dirname(f));
  fs.writeFileSync(f, s);
};
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s) => (s ? '`' + String(s).replace(/`/g, "'").replace(/\|/g, '\\|') + '`' : '');
const anchor = (p) => 'f-' + p.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
const firstSentence = (s) => {
  if (!s) return '';
  const m = s.match(/^(.{20,400}?[.!?])(\s|$)/);
  return (m ? m[1] : s.slice(0, 300)).trim();
};

// ---------- classification ----------
const isApi = (p) => p.startsWith('comercial-jhoel-api/');
function moduleOf(p) {
  let m;
  if ((m = p.match(/^comercial-jhoel-api\/src\/modules\/([^/]+)\//))) return 'api:' + m[1];
  if (p.startsWith('comercial-jhoel-api/src/database/migrations/')) return 'api:_migrations';
  if (p.startsWith('comercial-jhoel-api/src/database/')) return 'api:_database';
  if (p.startsWith('comercial-jhoel-api/src/shared/')) return 'api:_shared';
  if (p.startsWith('comercial-jhoel-api/src/config/')) return 'api:_config';
  if (p.startsWith('comercial-jhoel-api/src/health/')) return 'api:_health';
  if (p.startsWith('comercial-jhoel-api/test/')) return 'api:_e2e';
  if (p.startsWith('comercial-jhoel-api/sql/')) return 'api:_sql';
  if (p.startsWith('comercial-jhoel-api/')) return 'api:_root';
  if ((m = p.match(/^comercial-jhoel-app\/src\/app\/features\/dashboard\/([^/]+)\//))) return 'app:dashboard-' + m[1];
  if ((m = p.match(/^comercial-jhoel-app\/src\/app\/features\/([^/]+)\//))) return 'app:' + m[1];
  if ((m = p.match(/^comercial-jhoel-app\/src\/app\/(core|shared)\/([^/]+)\//))) return 'app:' + m[1] + '-' + m[2];
  if ((m = p.match(/^comercial-jhoel-app\/src\/app\/layout\//))) return 'app:layout';
  if (p.startsWith('comercial-jhoel-app/src/environments/')) return 'app:_environments';
  if (p.startsWith('comercial-jhoel-app/src/styles')) return 'app:_styles';
  return 'app:_root';
}
function layerOf(p) {
  if (isApi(p)) {
    const m = p.match(/\/(domain|application|infrastructure|presentation)\//);
    if (m) return { domain: 'Dominio', application: 'Aplicación', infrastructure: 'Infraestructura', presentation: 'Presentación' }[m[1]];
    if (p.includes('/migrations/')) return 'Base de datos (migración)';
    if (p.includes('/test/') || p.endsWith('.spec.ts')) return 'Pruebas';
    if (p.includes('/shared/')) return 'Transversal (shared)';
    return 'Arranque / configuración';
  }
  if (p.includes('/core/')) return 'Core (servicios, modelos, guards)';
  if (p.includes('/shared/')) return 'Shared (UI reutilizable)';
  if (p.includes('/features/')) return 'Feature (pantalla)';
  if (p.includes('/layout/')) return 'Layout';
  return 'Arranque / configuración';
}
const KIND_RULES = [
  [/\.e2e-spec\.ts$/, 'Prueba E2E'],
  [/\.spec\.ts$/, 'Prueba unitaria'],
  [/\/migrations\/.*\.ts$/, 'Migración TypeORM'],
  [/\/seeds\/.*\.ts$/, 'Seed'],
  [/\.controller\.ts$/, 'Controlador'],
  [/\.use-cases?\.ts$/, 'Caso de uso'],
  [/\.orm-entity\.ts$/, 'Entidad ORM (TypeORM)'],
  [/\/domain\/entities\/.*\.ts$/, 'Entidad de dominio'],
  [/\.entity\.ts$/, 'Entidad'],
  [/\/domain\/repositories\/.*\.ts$/, 'Puerto de repositorio (interfaz)'],
  [/\/infrastructure\/.*repository\.ts$/, 'Repositorio (implementación)'],
  [/\.repository\.ts$/, 'Repositorio'],
  [/\.mapper\.ts$/, 'Mapper'],
  [/\.request\.dto\.ts$/, 'DTO de entrada'],
  [/\.response\.dto\.ts$/, 'DTO de respuesta'],
  [/\.query\.dto\.ts$/, 'DTO de consulta'],
  [/\.dto\.ts$/, 'DTO'],
  [/-output\.ts$/, 'DTO de salida (aplicación)'],
  [/\.module\.ts$/, 'Módulo'],
  [/\.guard\.ts$/, 'Guard'],
  [/\.strategy\.ts$/, 'Estrategia Passport'],
  [/\.interceptor\.ts$/, 'Interceptor'],
  [/\.filter\.ts$/, 'Filtro de excepciones'],
  [/\.decorator\.ts$/, 'Decorador'],
  [/\.errors?\.ts$/, 'Errores de dominio'],
  [/\.policy\.ts$/, 'Política de dominio'],
  [/\.port\.ts$/, 'Puerto (interfaz)'],
  [/\.transformer\.ts$/, 'Transformador'],
  [/\.builder\.ts$/, 'Builder'],
  [/\.component\.ts$/, 'Componente Angular'],
  [/\.directive\.ts$/, 'Directiva Angular'],
  [/\.pipe\.ts$/, 'Pipe Angular'],
  [/\.store\.ts$/, 'Store (estado)'],
  [/\.service\.ts$/, 'Servicio'],
  [/\.model\.ts$/, 'Modelo / tipos'],
  [/\.routes\.ts$/, 'Rutas'],
  [/\.config\.ts$/, 'Configuración'],
  [/\.util\.ts$|\/utils?\//, 'Utilidad'],
  [/index\.ts$/, 'Barrel (re-exportación)'],
  [/main\.ts$/, 'Punto de entrada'],
  [/environment.*\.ts$/, 'Configuración de entorno'],
  [/\.html$/, 'Plantilla HTML'],
  [/\.scss$/, 'Estilos SCSS'],
  [/\.test\.sql$/, 'Prueba SQL'],
  [/\.sql$/, 'Script SQL'],
  [/\.sh$/, 'Script shell'],
  [/\.json$/, 'Configuración JSON'],
];
const kindOf = (p) => (KIND_RULES.find(([r]) => r.test(p)) || [null, 'Código TypeScript'])[1];

// ---------- import graph ----------
const byPath = new Map(model.files.map((f) => [f.path, f]));
function resolve(from, spec) {
  if (!spec.startsWith('.')) return null;
  const base = path.normalize(path.join(path.dirname(from), spec));
  for (const c of [base + '.ts', base, path.join(base, 'index.ts')]) if (byPath.has(c)) return c;
  return null;
}
const deps = new Map();
const consumers = new Map();
const externals = new Map();
for (const f of model.files) {
  const d = new Set();
  const ext = new Set();
  for (const imp of [...f.imports.map((i) => i.spec), ...f.dynamicImports]) {
    const r = resolve(f.path, imp);
    if (r) d.add(r);
    else if (!imp.startsWith('.')) ext.add(imp.startsWith('@') ? imp.split('/').slice(0, 2).join('/') : imp.split('/')[0]);
  }
  deps.set(f.path, d);
  externals.set(f.path, ext);
  for (const x of d) {
    if (!consumers.has(x)) consumers.set(x, new Set());
    consumers.get(x).add(f.path);
  }
}
// templates: component <-> template, selector usage
const selectorToFile = new Map();
const componentTemplate = new Map();
for (const f of model.files) {
  for (const c of f.classes) {
    const comp = c.decorators.find((d) => d.startsWith('Component(') || d.startsWith('Directive(') || d.startsWith('Pipe('));
    if (!comp) continue;
    const sel = comp.match(/selector:\s*'([^']+)'/);
    if (sel) for (const s of sel[1].split(',')) selectorToFile.set(s.trim().replace(/^\[|\]$/g, ''), f.path);
    const tpl = comp.match(/templateUrl:\s*'([^']+)'/);
    if (tpl) componentTemplate.set(f.path, path.normalize(path.join(path.dirname(f.path), tpl[1])));
  }
}
const templateOwner = new Map([...componentTemplate].map(([c, t]) => [t, c]));
const templateByPath = new Map(model.templates.map((t) => [t.path, t]));
const usesComponents = new Map();
for (const [comp, tpl] of componentTemplate) {
  const t = templateByPath.get(tpl);
  if (!t) continue;
  const used = new Set(t.selectors.map((s) => selectorToFile.get(s)).filter(Boolean));
  usesComponents.set(comp, used);
  for (const u of used) {
    if (!consumers.has(u)) consumers.set(u, new Set());
    consumers.get(u).add(comp + ' (plantilla)');
  }
}

// ---------- classes index ----------
const classIndex = new Map();
for (const f of model.files) for (const c of f.classes) if (!classIndex.has(c.name)) classIndex.set(c.name, { file: f.path, cls: c });
const ifaceIndex = new Map();
for (const f of model.files) for (const i of f.interfaces) if (!ifaceIndex.has(i.name)) ifaceIndex.set(i.name, f.path);
const implementations = new Map();
for (const f of model.files)
  for (const c of f.classes)
    for (const h of c.heritage) {
      const m = h.match(/^implements (.+)$/);
      if (m) for (const n of m[1].split(',').map((x) => x.trim().replace(/<.*$/, ''))) {
        if (!implementations.has(n)) implementations.set(n, []);
        implementations.get(n).push({ file: f.path, cls: c.name });
      }
    }

// ---------- endpoints ----------
const routeOf = (dec) => {
  const m = dec.match(/^(Get|Post|Put|Patch|Delete)\((?:'([^']*)')?/);
  return m ? { verb: m[1].toUpperCase(), sub: m[2] || '' } : null;
};
const endpoints = [];
for (const f of model.files) {
  for (const c of f.classes) {
    const ctl = c.decorators.find((d) => d.startsWith('Controller('));
    if (!ctl) continue;
    const base = (ctl.match(/Controller\(\s*'([^']*)'/) || [null, ''])[1];
    const classGuards = c.decorators.filter((d) => /^(UseGuards|Roles)\(/.test(d));
    for (const m of c.methods) {
      for (const d of m.decorators) {
        const r = routeOf(d);
        if (!r) continue;
        const full = ('/api/' + [base, r.sub].filter(Boolean).join('/')).replace(/\/+/g, '/');
        const useCaseCalls = m.calls.filter((x) => /^this\.[a-zA-Z]+\.execute$/.test(x)).map((x) => x.split('.')[1]);
        const ucTypes = useCaseCalls.map((prop) => (c.ctorParams.find((p) => p.name === prop) || {}).type).filter(Boolean);
        endpoints.push({
          verb: r.verb,
          path: full,
          file: f.path,
          controller: c.name,
          method: m.name,
          line: m.line,
          guards: [...classGuards, ...m.decorators.filter((x) => /^(UseGuards|Roles|Throttle)\(/.test(x))],
          useCases: ucTypes,
        });
      }
    }
  }
}
function bestEndpoint(verb, p) {
  const ps = p.split('/').filter(Boolean);
  let best = null;
  let bestScore = -1;
  for (const e of endpoints) {
    if (e.verb !== verb) continue;
    const es = e.path.split('/').filter(Boolean);
    if (es.length !== ps.length) continue;
    let score = 0;
    let ok = true;
    for (let i = 0; i < es.length; i++) {
      const a = es[i].startsWith(':'), b = ps[i].startsWith(':');
      if (!a && !b) { if (es[i] !== ps[i]) { ok = false; break; } score += 2; }
      else if (a && b) score += 1;
    }
    if (ok && score > bestScore) { best = e; bestScore = score; }
  }
  return best;
}
const epRegex = (p) => new RegExp('^' + p.replace(/:[a-zA-Z]+/g, '[^/]+') + '$');
// frontend http calls
function resolveUrl(file, raw) {
  let s = raw.replace(/^`|`$/g, '').replace(/^'|'$/g, '');
  const f = byPath.get(file);
  const bare = f.consts.find((x) => x.name === s);
  if (bare) s = bare.init.replace(/^`|`$/g, '').replace(/^'|'$/g, '');
  for (let i = 0; i < 4; i++) {
    s = s.replace(/\$\{([A-Za-z_.]+)\}/g, (all, name) => {
      if (name === 'environment.apiUrl') return '/api';
      const c = f.consts.find((x) => x.name === name);
      if (c && /^`|^'/.test(c.init)) return c.init.replace(/^`|`$/g, '').replace(/^'|'$/g, '');
      return ':param';
    });
  }
  s = s.replace(/\$\{[^}]+\}/g, ':param');
  return s;
}
const frontCalls = [];
for (const f of model.files.filter((x) => !isApi(x.path))) {
  for (const c of f.classes)
    for (const m of c.methods)
      for (const h of m.http) {
        const url = resolveUrl(f.path, h.url);
        const p = url.split('?')[0];
        const match = bestEndpoint(h.method, p);
        frontCalls.push({ file: f.path, cls: c.name, method: m.name, line: m.line, verb: h.method, url: p, endpoint: match });
      }
}
for (const e of endpoints) e.frontend = frontCalls.filter((x) => x.endpoint === e);

// use case -> repository methods -> SQL
function classMethodsCalledOn(cls, prop) {
  return [...new Set(cls.methods.flatMap((m) => m.calls.filter((c) => c.startsWith('this.' + prop + '.')).map((c) => c.split('.')[2])))];
}
function chainForUseCase(name) {
  const uc = classIndex.get(name);
  if (!uc) return null;
  const repos = [];
  for (const p of uc.cls.ctorParams) {
    const t = (p.type || '').replace(/<.*$/, '');
    const impls = implementations.get(t) || [];
    const called = classMethodsCalledOn(uc.cls, p.name);
    if (!called.length) continue;
    const sql = new Set();
    const tables = new Set();
    for (const impl of impls) {
      const ic = classIndex.get(impl.cls);
      if (!ic) continue;
      for (const m of ic.cls.methods)
        if (called.includes(m.name)) {
          m.sqlCalls.forEach((x) => sql.add(x));
          m.tables.forEach((x) => tables.add(x));
        }
    }
    repos.push({ prop: p.name, type: t, impls, called, sql: [...sql], tables: [...tables] });
  }
  return { file: uc.file, repos };
}

// ---------- helpers for rendering ----------
const docBase = (fromDoc) => path.relative(path.dirname(fromDoc), ROOT);
const fileLink = (fromDoc, p, l) => `[${p.split('/').pop()}](${path.join(docBase(fromDoc), p)}${l ? '#L' + l : ''})`;
const moduleDocFile = (mod) => {
  const [area, name] = mod.split(':');
  return path.join(OUT, 'reference', area === 'api' ? 'backend' : 'frontend', name.replace(/^_/, '') + '.md');
};
const refLink = (fromDoc, p) => {
  const target = moduleDocFile(moduleOf(p.replace(/ \(plantilla\)$/, '')));
  return `[${p.split('/').pop()}](${path.relative(path.dirname(fromDoc), target)}#${anchor(p.replace(/ \(plantilla\)$/, ''))})`;
};
const listLinks = (fromDoc, items, max = 12) => {
  const arr = [...items];
  if (!arr.length) return '—';
  const shown = arr.slice(0, max).map((p) => refLink(fromDoc, p) + (p.endsWith(' (plantilla)') ? ' (plantilla)' : ''));
  return shown.join(', ') + (arr.length > max ? ` y ${arr.length - max} más` : '');
};
function responsibility(f) {
  const kind = kindOf(f.path);
  const doc = f.fileDoc || (f.classes[0] && f.classes[0].doc) || (f.functions[0] && f.functions[0].doc) || (f.interfaces[0] && f.interfaces[0].doc) || '';
  if (doc) return firstSentence(doc);
  const names = [...f.classes.map((c) => c.name), ...f.functions.map((x) => x.name), ...f.interfaces.map((x) => x.name), ...f.types.map((x) => x.name), ...f.consts.map((x) => x.name)];
  return `${kind}${names.length ? ': declara ' + names.slice(0, 5).map((n) => '`' + n + '`').join(', ') : ''} (sin comentario de documentación en el código).`;
}
function importance(f) {
  const n = (consumers.get(f.path) || new Set()).size;
  const k = kindOf(f.path);
  if (/Punto de entrada|^Módulo$/.test(k) && /app\.module|main\.ts/.test(f.path)) return 'Alta (arranque)';
  if (/Prueba|Migración|Seed/.test(k)) return k.startsWith('Migración') ? 'Media (historial de esquema)' : 'Soporte (pruebas)';
  if (n >= 10) return `Alta (${n} consumidores)`;
  if (n >= 3) return `Media (${n} consumidores)`;
  if (/Controlador|Caso de uso|Repositorio \(impl/.test(k)) return `Media (${k.toLowerCase()})`;
  return `Baja (${n} consumidores)`;
}
const sig = (m) => `${m.name}(${m.params.map((p) => p.name + (p.optional ? '?' : '') + (p.type ? ': ' + p.type : '')).join(', ')})${m.returns ? ': ' + m.returns : ''}`;
const methodType = (m) => {
  const mm = m.mods.filter((x) => ['private', 'protected', 'public', 'static', 'async', 'readonly', 'abstract'].includes(x));
  const vis = mm.find((x) => ['private', 'protected'].includes(x)) || 'public';
  const extra = mm.filter((x) => ['static', 'async', 'abstract'].includes(x));
  const k = { method: 'método', getter: 'getter', setter: 'setter', 'arrow-property': 'propiedad-función' }[m.kind];
  return [k, vis, ...extra].join(' ');
};
function effects(m) {
  m = { tables: [], sqlCalls: [], http: [], calls: [], ...m };
  const out = [];
  if (m.sqlCalls.length) out.push('Llama funciones SQL: ' + m.sqlCalls.map(code).join(', '));
  if (m.tables.length) out.push('Tablas en su SQL: ' + m.tables.map(code).join(', '));
  if (m.http.length) out.push('HTTP: ' + m.http.map((h) => h.method + ' ' + code(h.url)).join(', '));
  const sets = m.calls.filter((c) => /\.(set|update)$/.test(c) && c.startsWith('this.')).slice(0, 6);
  if (sets.length) out.push('Actualiza estado (signals): ' + sets.map(code).join(', '));
  const emits = m.calls.filter((c) => /\.emit$/.test(c)).slice(0, 6);
  if (emits.length) out.push('Emite eventos: ' + emits.map(code).join(', '));
  if (m.calls.some((c) => /\.query$/.test(c))) out.push('Ejecuta SQL crudo (`query`)');
  if (m.calls.some((c) => /\.(save|insert|delete|softDelete|remove)$/.test(c) && c.includes('repository'))) out.push('Escribe vía repositorio TypeORM');
  return out.length ? out.join('; ') : 'Sin efectos externos detectados (lógica en memoria o delega).';
}
// method consumers: files importing the class file that call `.name(`
const callIndex = new Map();
for (const f of model.files) {
  const names = new Set();
  for (const c of f.classes) for (const m of c.methods) for (const x of m.calls) names.add(x.split('.').pop());
  for (const fn of f.functions) for (const x of fn.calls) names.add(x.split('.').pop());
  callIndex.set(f.path, names);
}
function methodConsumers(filePath, m) {
  const users = [];
  for (const c of consumers.get(filePath) || []) {
    const p = c.replace(/ \(plantilla\)$/, '');
    if ((callIndex.get(p) || new Set()).has(m.name)) users.push(p);
  }
  // template usage for components
  const tpl = componentTemplate.get(filePath);
  if (tpl) {
    const t = templateByPath.get(tpl);
    if (t && (t.calls || []).includes(m.name)) users.push(tpl + ' (usado en la plantilla)');
  }
  // same-file usage
  const f = byPath.get(filePath);
  if (f && f.classes.some((c) => c.methods.some((x) => x !== m && x.calls.some((cc) => cc === 'this.' + m.name)))) users.push('(mismo archivo)');
  return users;
}

// ---------- per-module reference ----------
const modules = new Map();
const addToModule = (mod, entry) => {
  if (!modules.has(mod)) modules.set(mod, []);
  modules.get(mod).push(entry);
};
for (const f of model.files) addToModule(moduleOf(f.path), { type: 'ts', f });
for (const t of model.templates) addToModule(moduleOf(t.path), { type: 'html', f: t });
for (const o of model.others) addToModule(moduleOf(o.path), { type: 'other', f: o });

const MODULE_TITLES = {
  'api:_migrations': 'Migraciones TypeORM (esquema de base de datos)',
  'api:_database': 'Base de datos: data-source y seeds',
  'api:_shared': 'Código transversal del backend (shared)',
  'api:_config': 'Configuración del backend',
  'api:_health': 'Health check',
  'api:_e2e': 'Pruebas E2E del backend',
  'api:_sql': 'Scripts y pruebas SQL',
  'api:_root': 'Raíz del backend (main, AppModule)',
  'app:_root': 'Raíz del frontend (bootstrap, rutas, configuración)',
  'app:_environments': 'Entornos del frontend',
  'app:_styles': 'Estilos globales del frontend',
};
const title = (mod) => MODULE_TITLES[mod] || (mod.startsWith('api:') ? 'Módulo backend `' + mod.slice(4) + '`' : 'Frontend `' + mod.slice(4) + '`');

const stats = { files: 0, classes: 0, methods: 0, functions: 0, interfaces: 0, endpoints: endpoints.length };
for (const [mod, entries] of [...modules].sort()) {
  const docFile = moduleDocFile(mod);
  const L = [];
  L.push(`# ${title(mod)}`, '');
  L.push('> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). ' +
    'Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. ' +
    'Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../' + (mod.startsWith('api:') ? '03_BACKEND_REFERENCE.md' : '04_FRONTEND_REFERENCE.md') + ').', '');
  const tsEntries = entries.filter((e) => e.type === 'ts').sort((a, b) => a.f.path.localeCompare(b.f.path));
  const otherEntries = entries.filter((e) => e.type !== 'ts').sort((a, b) => a.f.path.localeCompare(b.f.path));

  // endpoints of this module
  const modEps = endpoints.filter((e) => moduleOf(e.file) === mod);
  if (modEps.length) {
    L.push('## Endpoints HTTP y recorrido por capas', '');
    L.push('Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.', '');
    L.push('| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |', '|---|---|---|---|---|---|');
    for (const e of modEps) {
      const chains = e.useCases.map((u) => ({ u, ch: chainForUseCase(u) }));
      const repo = chains
        .flatMap(({ ch }) => (ch ? ch.repos : []))
        .map((r) => `${code(r.type)}.${r.called.join('/')}` + (r.sql.length ? ' → ' + r.sql.map(code).join(', ') : '') + (r.tables.length ? ' [' + r.tables.slice(0, 6).join(', ') + ']' : ''))
        .join('<br>');
      L.push(`| ${code(e.verb + ' ' + e.path)} | ${fileLink(docFile, e.file, e.line)} \`${e.controller}.${e.method}\` | ${chains.map(({ u, ch }) => (ch ? refLink(docFile, ch.file).replace(/^\[[^\]]+\]/, '[' + u + ']') : code(u))).join('<br>') || '—'} | ${repo || '—'} | ${esc(e.guards.join(' ')) || '—'} | ${e.frontend.map((x) => '`' + x.cls + '.' + x.method + '`').join('<br>') || '—'} |`);
    }
    L.push('');
  }

  L.push('## Inventario de archivos', '');
  L.push('| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |', '|---|---|---|---|---|---|---|---|');
  for (const { f } of tsEntries) {
    const d = deps.get(f.path) || new Set();
    const ext = externals.get(f.path) || new Set();
    L.push(`| [${f.path.split('/').pop()}](#${anchor(f.path)}) | .ts | ${kindOf(f.path)} | ${layerOf(f.path)} | ${esc(responsibility(f))} | ${d.size} internas${ext.size ? '; ext.: ' + [...ext].slice(0, 4).join(', ') : ''} | ${(consumers.get(f.path) || new Set()).size} | ${importance(f)} |`);
  }
  for (const { f, type } of otherEntries) {
    const owner = templateOwner.get(f.path) || (f.path.endsWith('.scss') ? f.path.replace(/\.scss$/, '.ts') : null);
    const resp = type === 'html'
      ? `Plantilla de ${owner ? '`' + owner.split('/').pop() + '`' : 'un componente'}; usa ${f.selectors.length} componentes hijos${f.selectors.length ? ': ' + f.selectors.slice(0, 6).map(code).join(', ') : ''}.`
      : f.path.endsWith('.scss') ? 'Estilos del componente del mismo nombre.' : (f.head || kindOf(f.path));
    L.push(`| [${f.path.split('/').pop()}](${path.join(docBase(docFile), f.path)}) | .${f.path.split('.').pop()} | ${kindOf(f.path)} | ${layerOf(f.path)} | ${esc(resp)} | — | — | ${f.path.endsWith('.scss') ? 'Baja' : 'Media'} |`);
  }
  L.push('');

  L.push('## Detalle por archivo', '');
  for (const { f } of tsEntries) {
    stats.files++;
    L.push(`<a id="${anchor(f.path)}"></a>`, '', `### ${f.path.split('/').pop()}`, '');
    L.push(`- **Ruta:** ${fileLink(docFile, f.path)} (\`${f.path}\`, ${f.lines} líneas)`);
    L.push(`- **Tipo:** ${kindOf(f.path)} · **Capa:** ${layerOf(f.path)} · **Módulo:** ${title(mod)}`);
    L.push(`- **Responsabilidad:** ${esc(responsibility(f))}`);
    if (f.fileDoc && f.fileDoc.length > 120) L.push(`- **Descripción del autor (comentario del archivo):** ${esc(f.fileDoc)}`);
    const d = deps.get(f.path) || new Set();
    if (d.size) L.push(`- **Depende de (archivos del proyecto):** ${listLinks(docFile, d, 15)}`);
    const ext = externals.get(f.path) || new Set();
    if (ext.size) L.push(`- **Paquetes externos:** ${[...ext].map(code).join(', ')}`);
    L.push(`- **Consumidores:** ${listLinks(docFile, consumers.get(f.path) || new Set(), 15)}`);
    const tpl = componentTemplate.get(f.path);
    if (tpl) {
      const used = usesComponents.get(f.path) || new Set();
      L.push(`- **Plantilla:** ${fileLink(docFile, tpl)}${used.size ? ' · **Usa componentes:** ' + listLinks(docFile, used, 15) : ''}`);
      const t = templateByPath.get(tpl);
      if (t && t.events.length) L.push(`- **Eventos enlazados en la plantilla:** ${t.events.slice(0, 15).map(code).join(', ')}`);
    }
    if (f.tablesCreated.length || f.sqlFunctionsDefined.length || f.triggersDefined.length) {
      L.push(`- **Define en la base de datos:** ${[...new Set(f.tablesCreated)].length ? 'tablas ' + [...new Set(f.tablesCreated)].map(code).join(', ') + '; ' : ''}${[...new Set(f.sqlFunctionsDefined)].length ? 'funciones ' + [...new Set(f.sqlFunctionsDefined)].map(code).join(', ') + '; ' : ''}${f.triggersDefined.length ? 'triggers ' + [...new Set(f.triggersDefined)].map(code).join(', ') : ''}`);
    }
    if (f.interfaces.length || f.types.length || f.enums.length) {
      L.push('', '**Interfaces, tipos y enums:**', '');
      for (const i of f.interfaces) { stats.interfaces++; L.push(`- \`interface ${i.name}\` (L${i.line})${i.heritage.length ? ' ' + esc(i.heritage.join(' ')) : ''}: ${esc(firstSentence(i.doc)) || 'sin documentación'} — miembros: ${i.members.slice(0, 25).map(code).join(', ')}${i.members.length > 25 ? '…' : ''}`); }
      for (const t of f.types) L.push(`- \`type ${t.name}\` (L${t.line}) = ${code(t.def)}${t.doc ? ' — ' + esc(firstSentence(t.doc)) : ''}`);
      for (const e of f.enums) L.push(`- \`enum ${e.name}\` (L${e.line}): ${e.members.map(code).join(', ')}`);
    }
    const consts = f.consts.filter((c) => c.exported);
    if (consts.length) {
      L.push('', '**Constantes exportadas:**', '');
      for (const c of consts) L.push(`- \`${c.name}\` (L${c.line})${c.doc ? ': ' + esc(firstSentence(c.doc)) : ''}${c.init ? ' = ' + code(c.init.slice(0, 110)) : ''}`);
    }
    for (const c of f.classes) {
      stats.classes++;
      L.push('', `#### Clase \`${c.name}\` (L${c.line}–${c.endLine})`, '');
      if (c.decorators.length) L.push(`- **Decoradores:** ${c.decorators.map((x) => code('@' + x.slice(0, 160))).join(' ')}`);
      if (c.heritage.length) L.push(`- **Herencia / contratos:** ${esc(c.heritage.join(' · '))}`);
      L.push(`- **Propósito:** ${esc(c.doc) || 'Sin comentario de documentación; ver los métodos abajo.'}`);
      if (c.ctorParams.length) L.push(`- **Dependencias inyectadas (constructor):** ${c.ctorParams.map((p) => code((p.decorators.length ? '@' + p.decorators.join(' @') + ' ' : '') + p.name + ': ' + p.type)).join(', ')}`);
      const injected = c.properties.filter((p) => /^inject\(/.test(p.init));
      if (injected.length) L.push(`- **Servicios inyectados con \`inject()\`:** ${injected.map((p) => code(p.name + ' = ' + p.init)).join(', ')}`);
      const state = c.properties.filter((p) => /^(signal|computed|input|output|model|effect)\b|^this\.[a-z]+\.(asReadonly|[a-zA-Z]+)$/.test(p.init) || p.decorators.some((d) => /^(Input|Output|ViewChild|Column|PrimaryGeneratedColumn|ManyToOne|OneToMany|JoinColumn|CreateDateColumn|UpdateDateColumn|Index)\b/.test(d)));
      if (state.length) L.push(`- **Datos / estado que administra:** ${state.slice(0, 30).map((p) => code((p.decorators.length ? '@' + p.decorators[0].split('(')[0] + ' ' : '') + p.name + (p.init ? ' = ' + p.init.slice(0, 50) : p.type ? ': ' + p.type : ''))).join(', ')}${state.length > 30 ? '…' : ''}`);
      const impl = implementations.get(c.name);
      if (impl) L.push(`- **Implementado por:** ${impl.map((x) => refLink(docFile, x.file).replace(/^\[[^\]]+\]/, '[' + x.cls + ']')).join(', ')}`);
      if (!c.methods.length) continue;
      L.push('', '| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |', '|---|---|---|---|---|');
      for (const m of c.methods) L.push(`| \`${m.name}\` | ${methodType(m)} | ${m.line}–${m.endLine} | ${m.params.map((p) => code(p.name + (p.optional ? '?' : '') + (p.type ? ': ' + p.type : ''))).join(', ') || '—'} | ${code(m.returns) || '(inferido)'} |`);
      L.push('');
      for (const m of c.methods) {
        stats.methods++;
        const cons = methodConsumers(f.path, m);
        L.push(`##### \`${c.name}.${m.name}\``, '');
        L.push(`- **Firma:** ${code(sig(m).slice(0, 300))} — ${fileLink(docFile, f.path, m.line)} (L${m.line}–${m.endLine})`);
        if (m.decorators.length) L.push(`- **Decoradores:** ${m.decorators.map((x) => code('@' + x)).join(' ')}`);
        L.push(`- **Propósito / descripción:** ${esc(m.doc) || 'Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.'}`);
        if (m.params.some((p) => p.decorators.length)) L.push(`- **Origen de parámetros:** ${m.params.map((p) => code((p.decorators.length ? '@' + p.decorators.join(' @') + ' ' : '') + p.name)).join(', ')}`);
        if (m.calls.length) L.push(`- **Dependencias (llamadas en su cuerpo):** ${m.calls.slice(0, 18).map(code).join(', ')}${m.calls.length > 18 ? '…' : ''}`);
        L.push(`- **Efectos secundarios:** ${effects(m)}`);
        if (m.throws.length) L.push(`- **Errores que lanza:** ${m.throws.map(code).join(', ')}`);
        L.push(`- **Consumidores:** ${cons.length ? cons.slice(0, 10).map((p) => (p.startsWith('(') ? p : p.includes('(usado en') ? code(p.split('/').pop().replace(' (usado en la plantilla)', '')) + ' (plantilla)' : refLink(docFile, p))).join(', ') : 'no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).'}`);
        L.push('');
      }
    }
    for (const fn of f.functions) {
      stats.functions++;
      L.push(`#### Función \`${fn.name}\` (L${fn.line}–${fn.endLine})`, '');
      L.push(`- **Tipo:** función ${fn.exported ? 'exportada' : 'local del archivo'}${fn.mods.includes('async') ? ', async' : ''}`);
      L.push(`- **Firma:** ${code(sig(fn).slice(0, 300))} — ${fileLink(docFile, f.path, fn.line)}`);
      L.push(`- **Propósito / descripción:** ${esc(fn.doc) || 'Sin JSDoc en el código.'}`);
      if (fn.calls.length) L.push(`- **Dependencias:** ${fn.calls.slice(0, 15).map(code).join(', ')}`);
      L.push(`- **Efectos secundarios:** ${effects(fn)}`);
      if (fn.throws.length) L.push(`- **Errores que lanza:** ${fn.throws.map(code).join(', ')}`);
      const users = [...(consumers.get(f.path) || [])].filter((p) => (callIndex.get(p.replace(/ \(plantilla\)$/, '')) || new Set()).has(fn.name));
      L.push(`- **Consumidores:** ${users.length ? users.slice(0, 10).map((p) => refLink(docFile, p)).join(', ') : fn.exported ? 'sin llamadas detectadas desde otros archivos' : 'uso interno del archivo'}`);
      L.push('');
    }
  }
  write(docFile, L.join('\n') + '\n');
}

// ---------- indexes 03 / 04 ----------
function moduleIndex(area, file, heading, intro) {
  const L = [`# ${heading}`, '', intro, '', '| Módulo | Archivos .ts | Clases | Métodos | Endpoints | Documento |', '|---|---|---|---|---|---|'];
  for (const [mod, entries] of [...modules].sort()) {
    if (!mod.startsWith(area + ':')) continue;
    const ts = entries.filter((e) => e.type === 'ts').map((e) => e.f);
    const cls = ts.reduce((s, f) => s + f.classes.length, 0);
    const me = ts.reduce((s, f) => s + f.classes.reduce((a, c) => a + c.methods.length, 0), 0);
    const ep = endpoints.filter((e) => moduleOf(e.file) === mod).length;
    L.push(`| ${title(mod)} | ${ts.length} | ${cls} | ${me} | ${ep || '—'} | [abrir](${path.relative(OUT, moduleDocFile(mod))}) |`);
  }
  write(path.join(OUT, file), L.join('\n') + '\n');
}
moduleIndex('api', '03_BACKEND_REFERENCE.md', 'Referencia del backend (NestJS) — índice por módulo',
  'Cada enlace abre la referencia generada del módulo: endpoints con su recorrido por capas, inventario de archivos y el detalle de cada clase, método y función (firma, líneas, propósito, dependencias, efectos, errores y consumidores). Ver la explicación de la arquitectura en [02_ARCHITECTURE.md](02_ARCHITECTURE.md).');
moduleIndex('app', '04_FRONTEND_REFERENCE.md', 'Referencia del frontend (Angular) — índice por área',
  'Cada enlace abre la referencia generada del área: inventario, componentes (selector, plantilla, componentes hijos, eventos), servicios (llamadas HTTP), modelos y el detalle de cada método. Ver la explicación en [02_ARCHITECTURE.md](02_ARCHITECTURE.md).');

// ---------- endpoints catalog ----------
{
  const f = path.join(OUT, '12_API_ENDPOINTS.md');
  const L = ['# Catálogo de endpoints HTTP', '', `Generado de los decoradores \`@Controller\`/\`@Get\`/\`@Post\`/… (${endpoints.length} rutas). Prefijo global \`/api\` (\`main.ts\`). "Frontend" = métodos Angular cuya URL coincide.`, '',
    '| Método y ruta | Controlador | Guards / roles | Frontend que la llama |', '|---|---|---|---|'];
  for (const e of [...endpoints].sort((a, b) => a.path.localeCompare(b.path) || a.verb.localeCompare(b.verb)))
    L.push(`| ${code(e.verb + ' ' + e.path)} | ${refLink(f, e.file).replace(/^\[[^\]]+\]/, '[' + e.controller + '.' + e.method + ']')} | ${esc(e.guards.join(' ')) || '—'} | ${e.frontend.map((x) => refLink(f, x.file).replace(/^\[[^\]]+\]/, '[' + x.cls + '.' + x.method + ']')).join(', ') || '—'} |`);
  const orphanFront = frontCalls.filter((x) => !x.endpoint);
  L.push('', '## Llamadas del frontend sin endpoint coincidente', '', 'URL armada dinámicamente o ruta que el análisis no pudo resolver; revisar a mano.', '');
  for (const x of orphanFront) L.push(`- \`${x.verb} ${x.url}\` — ${refLink(f, x.file).replace(/^\[[^\]]+\]/, '[' + x.cls + '.' + x.method + ']')}`);
  const unused = endpoints.filter((e) => !e.frontend.length);
  L.push('', `## Endpoints sin llamada detectada desde el frontend (${unused.length})`, '', 'Pueden usarse con URL dinámica, ser solo para otros clientes/pruebas o estar sin uso. No implica que sobren.', '');
  for (const e of unused) L.push(`- \`${e.verb} ${e.path}\` — \`${e.controller}.${e.method}\``);
  write(f, L.join('\n') + '\n');
}

// ---------- dependencies doc ----------
{
  const f = path.join(OUT, '08_FILE_DEPENDENCIES.md');
  const modEdges = new Map();
  for (const [from, ds] of deps) for (const to of ds) {
    const a = moduleOf(from), b = moduleOf(to);
    if (a === b || !a.startsWith('api:') || !b.startsWith('api:') || a.startsWith('api:_') || b.startsWith('api:_')) continue;
    const k = a + '>' + b;
    modEdges.set(k, (modEdges.get(k) || 0) + 1);
  }
  const id = (m) => m.replace(/[^a-zA-Z0-9]/g, '_');
  const mm = ['graph LR'];
  for (const [k, n] of [...modEdges].sort()) {
    const [a, b] = k.split('>');
    mm.push(`  ${id(a)}["${a.slice(4)}"] -->|${n}| ${id(b)}["${b.slice(4)}"]`);
  }
  write(path.join(OUT, 'diagrams/module_dependencies.mmd'), mm.join('\n') + '\n');
  // frontend feature -> core service usage
  const feEdges = new Map();
  for (const [from, ds] of deps) for (const to of ds) {
    const a = moduleOf(from), b = moduleOf(to);
    if (!a.startsWith('app:dashboard') || !b.startsWith('app:core-services')) continue;
    if (!feEdges.has(a)) feEdges.set(a, new Set());
    feEdges.get(a).add(to.split('/').pop().replace('.ts', ''));
  }
  // cycles (Tarjan)
  let idx = 0; const stack = []; const on = new Set(); const ix = new Map(); const low = new Map(); const sccs = [];
  const strong = (v) => {
    ix.set(v, idx); low.set(v, idx); idx++; stack.push(v); on.add(v);
    for (const w of deps.get(v) || []) {
      if (!ix.has(w)) { strong(w); low.set(v, Math.min(low.get(v), low.get(w))); }
      else if (on.has(w)) low.set(v, Math.min(low.get(v), ix.get(w)));
    }
    if (low.get(v) === ix.get(v)) {
      const comp = []; let w;
      do { w = stack.pop(); on.delete(w); comp.push(w); } while (w !== v);
      if (comp.length > 1) sccs.push(comp);
    }
  };
  for (const v of deps.keys()) if (!ix.has(v)) strong(v);
  const orphans = model.files.filter((x) => ![...(consumers.get(x.path) || new Set())].some((c) => !/\.spec\.ts/.test(c)) && !/spec\.ts$|\/migrations\/|\/seeds\/|main\.ts$|environment|app\.config|data-source|\.module\.ts$|\.e2e-spec/.test(x.path));
  const L = ['# Relaciones entre archivos y dependencias', '',
    'Grafo calculado de los `import` reales (estáticos y `import()` dinámicos de las rutas) y del uso de selectores `<app-…>` en plantillas. Para ver las dependencias y consumidores de un archivo concreto, abrir su ficha en la referencia ([backend](03_BACKEND_REFERENCE.md), [frontend](04_FRONTEND_REFERENCE.md)).', '',
    '## Cómo leer un flujo entre capas', '', 'Patrón real del proyecto (ver [02_ARCHITECTURE.md](02_ARCHITECTURE.md) y los flujos de [06_BUSINESS_FLOWS.md](06_BUSINESS_FLOWS.md)):', '',
    '```mermaid', 'flowchart TD', '  A["Componente Angular (features/...)"] --> B["Servicio Angular (core/services/*.service.ts)"]', '  B -->|"HttpClient + authInterceptor (JWT)"| C["Controller NestJS (presentation/controllers)"]',
    '  C -->|"DTO validado por ValidationPipe"| D["Caso de uso (application/use-cases)"]', '  D -->|"@Inject(TOKEN)"| E["Puerto de repositorio (domain/repositories)"]', '  E -.implementa.-> F["Repositorio TypeORM (infrastructure/persistence)"]',
    '  F -->|"SQL / SELECT funcion_plpgsql(...)"| G[("PostgreSQL: tablas + funciones")]', '  G --> F --> D --> C -->|"ResponseInterceptor {success,data}"| B --> A', '```', '',
    '## Dependencias entre módulos del backend', '', 'Cantidad de imports de archivos de un módulo hacia otro (excluye `shared`, migraciones y pruebas). Archivo fuente: [diagrams/module_dependencies.mmd](diagrams/module_dependencies.mmd).', '',
    '```mermaid', ...mm, '```', '',
    '| Desde | Hacia | Imports |', '|---|---|---|', ...[...modEdges].sort().map(([k, n]) => `| ${k.split('>')[0].slice(4)} | ${k.split('>')[1].slice(4)} | ${n} |`), '',
    '## Pantallas del dashboard → servicios del core que usan', '', '| Área | Servicios |', '|---|---|',
    ...[...feEdges].sort().map(([a, s]) => `| ${a.slice(4)} | ${[...s].sort().map(code).join(', ')} |`), '',
    `## Dependencias circulares (${sccs.length} grupos)`, '',
    sccs.length ? 'Grupos de archivos que se importan mutuamente (directa o indirectamente). En TypeScript suelen ser inofensivos si son solo tipos, pero conviene conocerlos:' : 'No se detectaron ciclos de imports.', '',
    ...sccs.map((c, i) => `${i + 1}. ${c.map((p) => '`' + p + '`').join(' ↔ ')}`), '',
    `## Archivos sin consumidores detectados (${orphans.length})`, '',
    'No los importa ningún archivo de producción (solo, a lo sumo, su propia prueba) ni se usan como selector en una plantilla. Se excluyen pruebas, migraciones, seeds, módulos Nest y puntos de entrada. Pueden ser código sin uso, o usarse de una forma que el análisis estático no ve (por ejemplo, un nombre de clase registrado por cadena). **Verificar antes de concluir.**', '',
    ...orphans.map((x) => `- \`${x.path}\` (${kindOf(x.path)})`), ''];
  write(f, L.join('\n') + '\n');
}

// ---------- symbol index ----------
for (const area of ['api', 'app']) {
  const f = path.join(OUT, 'index', area === 'api' ? 'backend.md' : 'frontend.md');
  const rows = [];
  for (const x of model.files.filter((y) => (area === 'api') === isApi(y.path))) {
    for (const c of x.classes) rows.push([c.name, kindOf(x.path).startsWith('Componente') ? 'Componente' : kindOf(x.path) === 'Caso de uso' ? 'Caso de uso' : 'Clase', x.path, c.line, firstSentence(c.doc)]);
    for (const i of x.interfaces) rows.push([i.name, 'Interfaz', x.path, i.line, firstSentence(i.doc)]);
    for (const t of x.types) rows.push([t.name, 'Tipo', x.path, t.line, firstSentence(t.doc)]);
    for (const e of x.enums) rows.push([e.name, 'Enum', x.path, e.line, '']);
    for (const fn of x.functions) rows.push([fn.name, 'Función', x.path, fn.line, firstSentence(fn.doc)]);
    for (const c of x.classes) for (const m of c.methods) rows.push([c.name + '.' + m.name, 'Método', x.path, m.line, firstSentence(m.doc)]);
  }
  rows.sort((a, b) => a[0].localeCompare(b[0]));
  const L = [`# Índice de símbolos — ${area === 'api' ? 'backend' : 'frontend'}`, '', `${rows.length} entradas (clases, componentes, casos de uso, interfaces, tipos, enums, funciones y métodos), ordenadas alfabéticamente. Usar Ctrl+F. El enlace "ficha" abre la documentación del archivo; "código" abre el archivo en la línea.`, '',
    '| Símbolo | Clase de símbolo | Archivo | Ficha | Resumen |', '|---|---|---|---|---|'];
  for (const [n, k, p, l, d] of rows) L.push(`| \`${esc(n)}\` | ${k} | ${fileLink(f, p, l)} | ${refLink(f, p).replace(/^\[[^\]]+\]/, '[ficha]')} | ${esc(d).slice(0, 160)} |`);
  write(f, L.join('\n') + '\n');
}

// ---------- database reference ----------
{
  const tableUsers = new Map();
  for (const x of model.files) {
    if (x.path.includes('/migrations/') || x.path.endsWith('.spec.ts')) continue;
    for (const t of x.tablesMentioned) {
      if (!tableUsers.has(t)) tableUsers.set(t, new Set());
      tableUsers.get(t).add(x.path);
    }
  }
  const tableCreatedIn = new Map();
  const fnDefinedIn = new Map();
  for (const x of model.files.filter((y) => y.path.includes('/migrations/'))) {
    for (const t of x.tablesCreated) if (!tableCreatedIn.has(t)) tableCreatedIn.set(t, x.path);
    for (const fn of x.sqlFunctionsDefined) { if (!fnDefinedIn.has(fn)) fnDefinedIn.set(fn, []); fnDefinedIn.get(fn).push(x.path); }
  }
  const fnCallers = new Map();
  for (const x of model.files) {
    if (x.path.includes('/migrations/') || x.path.endsWith('.spec.ts')) continue;
    for (const c of x.classes) for (const m of c.methods) for (const s of m.sqlCalls) {
      if (!fnCallers.has(s)) fnCallers.set(s, new Set());
      fnCallers.get(s).add(x.path + '#' + c.name + '.' + m.name);
    }
  }
  const entityOf = new Map();
  for (const x of model.files) for (const c of x.classes) for (const d of c.decorators) {
    const m = d.match(/^Entity\(\s*(?:\{\s*name:\s*)?['"]([a-z_0-9]+)['"]/);
    if (m) entityOf.set(m[1], { file: x.path, cls: c.name });
  }
  // group table -> module (most mentions outside migrations)
  const groupOf = (t) => {
    const counts = new Map();
    for (const p of tableUsers.get(t) || []) {
      const m = moduleOf(p);
      if (!m.startsWith('api:') || m.startsWith('api:_')) continue;
      counts.set(m, (counts.get(m) || 0) + 1);
    }
    const best = [...counts].sort((a, b) => b[1] - a[1])[0];
    return best ? best[0].slice(4) : 'otros';
  };
  const groups = new Map();
  for (const t of db.tables) {
    const g = t.name === 'migrations' ? 'otros' : groupOf(t.name);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(t);
  }
  const typeId = (s) => s.replace(/\(.*\)/, '').replace(/[^a-zA-Z0-9]+/g, '_');
  const erFor = (tables) => {
    const names = new Set(tables.map((t) => t.name));
    const L = ['erDiagram'];
    const ext = new Set();
    const rels = [];
    for (const t of tables) for (const k of t.constraints || []) if (k.type === 'f' && k.ref) {
      const col = (k.def.match(/FOREIGN KEY \(([^)]+)\)/) || [null, '?'])[1].replace(/[^a-z0-9_,]/g, '');
      const ref = k.ref.replace(/"/g, '');
      if (!names.has(ref)) ext.add(ref);
      rels.push(`  ${ref} ||--o{ ${t.name} : "${col}"`);
    }
    for (const t of tables) {
      const pk = new Set();
      for (const k of t.constraints || []) if (k.type === 'p') (k.def.match(/\(([^)]+)\)/) || [null, ''])[1].split(',').forEach((c) => pk.add(c.trim().replace(/"/g, '')));
      const fk = new Set();
      for (const k of t.constraints || []) if (k.type === 'f') (k.def.match(/FOREIGN KEY \(([^)]+)\)/) || [null, ''])[1].split(',').forEach((c) => fk.add(c.trim().replace(/"/g, '')));
      L.push(`  ${t.name} {`);
      for (const c of t.columns.slice(0, 14)) L.push(`    ${typeId(c.type)} ${c.name}${pk.has(c.name) ? ' PK' : fk.has(c.name) ? ' FK' : ''}`);
      L.push('  }');
    }
    for (const e of ext) L.push(`  ${e} {`, '    uuid id PK', '  }');
    return [...L, ...[...new Set(rels)]].join('\n');
  };
  const dbDir = path.join(OUT, 'database');
  const L0 = ['# Referencia de la base de datos (PostgreSQL)', '',
    `Generada del **esquema real** de la base de desarrollo (consulta de solo lectura a \`pg_catalog\`), con ${db.tables.length} tablas, ${db.functions.length} funciones y ${db.migrations.length} migraciones aplicadas. ` +
    'Si producción tiene migraciones pendientes, puede diferir. Explicación conceptual en [02_ARCHITECTURE.md](02_ARCHITECTURE.md#7-base-de-datos-y-transacciones).', '',
    '## Tablas por dominio', '', 'Cada tabla se agrupa en el módulo del backend que más la menciona. Las fichas incluyen columnas, llaves, índices, restricciones, triggers, la entidad TypeORM (si existe), la migración que la creó y los archivos que la consultan o modifican.', '',
    '| Dominio | Tablas | Documento |', '|---|---|---|'];
  for (const [g, tables] of [...groups].sort()) {
    const gf = path.join(dbDir, g + '.md');
    L0.push(`| ${g} | ${tables.map((t) => '`' + t.name + '`').join(', ')} | [abrir](database/${g}.md) |`);
    const L = [`# Base de datos — dominio \`${g}\``, '', 'Volver a [05_DATABASE_REFERENCE.md](../05_DATABASE_REFERENCE.md). Diagrama ER: llaves primarias (PK) y foráneas (FK) reales; las tablas de otros dominios referenciadas aparecen solo con su `id`. Se muestran hasta 14 columnas por tabla en el diagrama; la lista completa está en cada ficha.', '',
      '```mermaid', erFor(tables), '```', ''];
    for (const t of tables) {
      L.push(`## \`${t.name}\``, '');
      const ent = entityOf.get(t.name);
      L.push(`- **Entidad TypeORM:** ${ent ? refLink(gf, ent.file).replace(/^\[[^\]]+\]/, '[' + ent.cls + ']') : 'ninguna (se accede con SQL crudo o solo desde funciones PL/pgSQL)'}`);
      L.push(`- **Creada en:** ${tableCreatedIn.has(t.name) ? code(tableCreatedIn.get(t.name).split('/').pop()) : 'migración no identificada por el análisis (creada con TypeORM `Table` o `createTable`)'}`);
      const users = [...(tableUsers.get(t.name) || [])];
      L.push(`- **Archivos TypeScript que la usan:** ${users.length ? users.slice(0, 14).map((p) => refLink(gf, p)).join(', ') + (users.length > 14 ? ` y ${users.length - 14} más` : '') : 'solo funciones SQL'}`);
      const writers = db.functions.filter((fn) => (fn.tablesWritten || []).includes(t.name)).map((fn) => fn.name);
      if (writers.length) L.push(`- **Funciones SQL que la escriben:** ${writers.map(code).join(', ')}`);
      L.push('', '| Columna | Tipo | Nulo | Default |', '|---|---|---|---|');
      for (const c of t.columns) L.push(`| \`${c.name}\` | ${esc(c.type)} | ${c.notnull ? 'NOT NULL' : 'sí'} | ${esc(c.default || '')} |`);
      const kinds = { p: 'PK', f: 'FK', u: 'UNIQUE', c: 'CHECK', x: 'EXCLUDE' };
      if ((t.constraints || []).length) {
        L.push('', '| Restricción | Tipo | Definición |', '|---|---|---|');
        for (const k of t.constraints) L.push(`| \`${k.name}\` | ${kinds[k.type] || k.type} | ${esc(k.def)} |`);
      }
      if ((t.indexes || []).length) {
        L.push('', '**Índices:**', '');
        for (const i of t.indexes) L.push(`- \`${i.name}\`: ${esc(i.def)}`);
      }
      if ((t.triggers || []).length) {
        L.push('', '**Triggers:**', '');
        for (const tr of t.triggers) L.push(`- \`${tr.name}\`: ${esc(tr.def)}`);
      }
      L.push('');
    }
    write(gf, L.join('\n') + '\n');
  }
  L0.push('', '## Funciones SQL (PL/pgSQL)', '', 'La lógica financiera crítica vive en funciones de PostgreSQL que se llaman con un `SELECT funcion(...)` desde los repositorios. Para cada una: argumentos, retorno, tablas que escribe, otras funciones que llama, locks consultivos (`pg_advisory_xact_lock`), códigos de error que lanza (`RAISE EXCEPTION \'CODIGO:...\'`), migración que la define y métodos TypeScript que la invocan.', '',
    '| Función | Argumentos → retorno | Escribe | Llama | Locks | Errores | Definida en | Llamada desde |', '|---|---|---|---|---|---|---|---|');
  for (const fn of db.functions) {
    const callers = [...(fnCallers.get(fn.name) || [])];
    L0.push(`| \`${fn.name}\`${fn.trigger ? ' (trigger)' : ''} | ${esc((fn.args || '').slice(0, 220))} → ${esc(fn.returns)} | ${(fn.tablesWritten || []).map(code).join(', ') || '—'} | ${(fn.calls || []).filter((c) => c !== fn.name).slice(0, 8).map(code).join(', ') || '—'} | ${(fn.locks || []).map(code).join(', ') || '—'} | ${(fn.raises || []).slice(0, 10).map(code).join(', ') || '—'} | ${(fnDefinedIn.get(fn.name) || []).map((p) => code(p.split('/').pop().replace(/\.ts$/, ''))).slice(-3).join(', ') || '—'} | ${callers.slice(0, 5).map((c) => code(c.split('#')[1])).join(', ') || '—'} |`);
  }
  L0.push('', '## Migraciones aplicadas (orden de ejecución)', '', 'Fuente: tabla `migrations`. Cada archivo está en `comercial-jhoel-api/src/database/migrations/` y su ficha en la [referencia de migraciones](reference/backend/migrations.md).', '');
  db.migrations.forEach((m, i) => L0.push(`${i + 1}. \`${m}\``));
  write(path.join(OUT, '05_DATABASE_REFERENCE.md'), L0.join('\n') + '\n');
  // global ER (FK only) as .mmd
  const rels = [];
  for (const t of db.tables) for (const k of t.constraints || []) if (k.type === 'f' && k.ref) rels.push(`  ${k.ref.replace(/"/g, '')} ||--o{ ${t.name} : "${(k.def.match(/FOREIGN KEY \(([^)]+)\)/) || [null, '?'])[1].replace(/[^a-z0-9_,]/g, '')}"`);
  write(path.join(OUT, 'diagrams/database_relationships.mmd'), ['erDiagram', ...new Set(rels)].join('\n') + '\n');
}

// ---------- inventory summary ----------
{
  const f = path.join(OUT, '00_FILE_INVENTORY.md');
  const L = ['# Inventario de archivos', '', 'Resumen del inventario completo. El detalle archivo por archivo (ruta, extensión, tipo, capa, responsabilidad, dependencias, consumidores, importancia) está al inicio de cada documento de módulo.', '',
    `- Archivos TypeScript analizados: **${model.files.length}** (clases: ${stats.classes}, métodos: ${stats.methods}, funciones: ${stats.functions}, interfaces: ${stats.interfaces}).`,
    `- Plantillas HTML: **${model.templates.length}**. Otros (SCSS, SQL, shell, JSON de configuración de pruebas): **${model.others.length}**.`,
    `- Endpoints HTTP: **${endpoints.length}** ([12_API_ENDPOINTS.md](12_API_ENDPOINTS.md)).`,
    '- Excluido: `node_modules`, `dist`, `.angular`, `coverage`, `src/assets` (imágenes/fuentes) y archivos de configuración del tooling fuera de `src` (ver [01_PROJECT_OVERVIEW.md](01_PROJECT_OVERVIEW.md)).', '',
    '**Importancia** es una heurística: cantidad de consumidores por import, más el papel del archivo (arranque, controlador, caso de uso). Sirve para priorizar el estudio, no es una métrica oficial.', '',
    '| Área | Módulo | Archivos | Documento |', '|---|---|---|---|'];
  for (const [mod, entries] of [...modules].sort()) L.push(`| ${mod.startsWith('api:') ? 'Backend' : 'Frontend'} | ${title(mod)} | ${entries.length} | [abrir](${path.relative(OUT, moduleDocFile(mod))}) |`);
  write(f, L.join('\n') + '\n');
}
fs.writeFileSync(path.join(path.dirname(MODEL), 'stats.json'), JSON.stringify({ ...stats, templates: model.templates.length, others: model.others.length, tables: db.tables.length, sqlFunctions: db.functions.length, migrations: db.migrations.length, frontCalls: frontCalls.length, matched: frontCalls.filter((x) => x.endpoint).length }, null, 1));
console.log(stats, 'frontCalls', frontCalls.length, 'matched', frontCalls.filter((x) => x.endpoint).length);
