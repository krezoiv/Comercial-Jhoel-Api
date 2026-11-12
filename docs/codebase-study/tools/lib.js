// Shared analysis over model.json + db.json for the flowchart generator:
// endpoints, controller → use case → repository → SQL chains, frontend callers
// and real decisions (TypeScript `if … throw` and PL/pgSQL `IF … RAISE`).
const fs = require('fs');
const path = require('path');

function load(modelPath, dbPath) {
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8').split('\n').find((l) => l.startsWith('{')));
  const isApi = (p) => p.startsWith('comercial-jhoel-api/');
  const byPath = new Map(model.files.map((f) => [f.path, f]));

  const classIndex = new Map();
  for (const f of model.files) for (const c of f.classes) if (!classIndex.has(c.name)) classIndex.set(c.name, { file: f.path, cls: c });
  const fnIndex = new Map();
  for (const f of model.files) for (const fn of f.functions) if (!fnIndex.has(fn.name)) fnIndex.set(fn.name, { file: f.path, fn });
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
  const interfaceFile = new Map();
  for (const f of model.files) for (const i of f.interfaces) if (!interfaceFile.has(i.name)) interfaceFile.set(i.name, f.path);

  // ---- endpoints ----
  const endpoints = [];
  for (const f of model.files) for (const c of f.classes) {
    const ctl = c.decorators.find((d) => d.startsWith('Controller('));
    if (!ctl) continue;
    const base = (ctl.match(/Controller\(\s*'([^']*)'/) || [null, ''])[1];
    const classDecs = c.decorators.filter((d) => /^(UseGuards|Roles)\(/.test(d));
    for (const m of c.methods) for (const d of m.decorators) {
      const r = d.match(/^(Get|Post|Put|Patch|Delete)\((?:'([^']*)')?/);
      if (!r) continue;
      const decs = [...classDecs, ...m.decorators.filter((x) => /^(UseGuards|Roles|Throttle)\(/.test(x))];
      const ucProps = [...new Set(m.calls.filter((x) => /^this\.[a-zA-Z]+\.execute$/.test(x)).map((x) => x.split('.')[1]))];
      endpoints.push({
        verb: r[1].toUpperCase(),
        path: ('/api/' + [base, r[2] || ''].filter(Boolean).join('/')).replace(/\/+/g, '/').replace(/\/$/, ''),
        file: f.path,
        controller: c.name,
        method: m,
        jwt: decs.some((x) => x.includes('JwtAuthGuard')),
        roles: (decs.filter((x) => x.startsWith('Roles(')).pop() || '').replace(/^Roles\(|\)$/g, ''),
        throttle: decs.some((x) => x.startsWith('Throttle(')),
        dtos: m.params.filter((p) => p.decorators.some((d) => /^(Body|Query)\(/.test(d)) && /Dto/.test(p.type)).map((p) => p.type),
        useCases: ucProps.map((prop) => (c.ctorParams.find((p) => p.name === prop) || {}).type).filter(Boolean),
      });
    }
  }
  function bestEndpoint(verb, p) {
    const ps = p.split('/').filter(Boolean);
    let best = null, bestScore = -1;
    for (const e of endpoints) {
      if (e.verb !== verb) continue;
      const es = e.path.split('/').filter(Boolean);
      if (es.length !== ps.length) continue;
      let score = 0, ok = true;
      for (let i = 0; i < es.length; i++) {
        const a = es[i].startsWith(':'), b = ps[i].startsWith(':');
        if (!a && !b) { if (es[i] !== ps[i]) { ok = false; break; } score += 2; } else if (a && b) score += 1;
      }
      if (ok && score > bestScore) { best = e; bestScore = score; }
    }
    return best;
  }
  function resolveUrl(file, raw) {
    let s = raw.replace(/^`|`$/g, '').replace(/^'|'$/g, '');
    const f = byPath.get(file);
    const bare = f.consts.find((x) => x.name === s);
    if (bare) s = bare.init.replace(/^`|`$/g, '').replace(/^'|'$/g, '');
    for (let i = 0; i < 4; i++) s = s.replace(/\$\{([A-Za-z_.]+)\}/g, (all, name) => {
      if (name === 'environment.apiUrl') return '/api';
      const c = f.consts.find((x) => x.name === name);
      return c && /^`|^'/.test(c.init) ? c.init.replace(/^`|`$/g, '').replace(/^'|'$/g, '') : ':param';
    });
    return s.replace(/\$\{[^}]+\}/g, ':param').split('?')[0];
  }
  // frontend service methods → endpoint
  const serviceCalls = [];
  for (const f of model.files.filter((x) => !isApi(x.path)))
    for (const c of f.classes) for (const m of c.methods) for (const h of m.http) {
      const e = bestEndpoint(h.method, resolveUrl(f.path, h.url));
      if (e) serviceCalls.push({ file: f.path, cls: c.name, method: m.name, endpoint: e });
    }
  for (const e of endpoints) e.services = serviceCalls.filter((x) => x.endpoint === e);

  // who calls `Service.method` (components/stores), resolved through injected properties
  const callers = new Map();
  for (const f of model.files.filter((x) => !isApi(x.path) && !x.path.endsWith('.spec.ts'))) for (const c of f.classes) {
    const propType = new Map();
    for (const p of c.properties) { const m = p.init.match(/^inject\(([A-Za-z0-9_]+)/); if (m) propType.set(p.name, m[1]); }
    for (const p of c.ctorParams) if (p.type) propType.set(p.name, p.type.replace(/<.*$/, ''));
    for (const m of c.methods) for (const call of m.calls) {
      const mm = call.match(/^this\.([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)$/);
      if (!mm || !propType.has(mm[1])) continue;
      const key = propType.get(mm[1]) + '.' + mm[2];
      if (!callers.has(key)) callers.set(key, []);
      callers.get(key).push({ file: f.path, cls: c.name, method: m });
    }
  }
  // template usage of a component method
  const tplOf = new Map();
  for (const f of model.files) for (const c of f.classes) {
    const comp = c.decorators.find((d) => d.startsWith('Component('));
    const tpl = comp && comp.match(/templateUrl:\s*'([^']+)'/);
    if (tpl) tplOf.set(c.name, path.normalize(path.join(path.dirname(f.path), tpl[1])));
  }
  const templates = new Map(model.templates.map((t) => [t.path, t]));
  const usedInTemplate = (clsName, method) => {
    const t = templates.get(tplOf.get(clsName));
    return t ? (t.calls || []).includes(method) : false;
  };

  // ---- chains & decisions ----
  const guardsOf = (m) => m.guards || [];
  function assertGuards(m) {
    // one level into called assert*/ensure* helpers (local functions or same-class methods)
    const out = [];
    for (const call of m.calls) {
      const name = call.replace(/^this\./, '');
      if (!/^(assert|ensure|validate)[A-Z]/.test(name) || name.includes('.')) continue;
      const fn = fnIndex.get(name);
      if (fn && guardsOf(fn.fn).length) out.push({ helper: name, file: fn.file, line: fn.fn.line, at: (m.callAt || {})[call], guards: guardsOf(fn.fn) });
    }
    return out;
  }
  const dbFn = new Map((db.functions || []).map((f) => [f.name, f]));
  function sqlGuards(name) {
    const f = dbFn.get(name);
    if (!f) return [];
    const out = [];
    for (const g of f.guards || []) {
      let c = g.cond;
      if (/\bTHEN\b/.test(c)) {
        const m = c.match(/^(.*?) THEN IF (.*)$/);
        if (!m || /\bTHEN\b|--|:=|;/.test(m[1] + ' ' + m[2])) continue; // not provably a plain nested condition
        c = `(${m[1]}) y (${m[2]})`;
      }
      if (/--|:=|;/.test(c)) continue;
      out.push({ cond: c, code: g.code });
    }
    return out;
  }
  const isUseCaseType = (t) => /UseCase$/.test(t);
  function useCaseChain(name) {
    const uc = classIndex.get(name);
    if (!uc) return null;
    const exec = uc.cls.methods.find((m) => m.name === 'execute');
    const repos = [];
    for (const p of uc.cls.ctorParams) {
      const t = (p.type || '').replace(/<.*$/, '');
      const called = [...new Set(uc.cls.methods.flatMap((m) => m.calls.filter((c) => c.startsWith('this.' + p.name + '.')).map((c) => c.split('.')[2])))];
      if (!called.length) continue;
      const impls = (implementations.get(t) || []).map((i) => ({ ...i, methods: (classIndex.get(i.cls)?.cls.methods || []).filter((m) => called.includes(m.name)) }));
      const isUseCase = /UseCase$/.test(t);
      const at = Math.min(...uc.cls.methods.flatMap((m) => Object.entries(m.callAt || {}).filter(([c]) => c.startsWith('this.' + p.name + '.')).map(([, l]) => l)), Infinity);
      const readOnly = called.every((c) => /^(find|get|exists|count|list|validate|search|load|is|has)/.test(c)) || (isUseCaseType(t) && /^(Get|List|Validate|Find)/.test(t));
      repos.push({ at, readOnly, prop: p.name, type: t, token: (p.decorators.find((d) => d.startsWith('Inject(')) || '').replace(/^Inject\(|\)$/g, ''), called, impls, isUseCase, portFile: interfaceFile.get(t) || classIndex.get(t)?.file });
    }
    return { name, file: uc.file, cls: uc.cls, exec, guards: exec ? guardsOf(exec) : [], helpers: exec ? assertGuards(exec) : [], repos };
  }
  return { model, db, isApi, byPath, classIndex, fnIndex, implementations, endpoints, callers, usedInTemplate, useCaseChain, sqlGuards, dbFn };
}

module.exports = { load };
