// Static extractor: parses every project .ts file with the TypeScript compiler
// API (syntax only, no type checker) and writes a JSON model of files, symbols,
// imports, endpoints, SQL calls and template usage. Read-only over the repo.
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
const OUT = process.argv[3];
const ts = require(path.join(ROOT, 'comercial-jhoel-api/node_modules/typescript'));

const SKIP = new Set(['node_modules', 'dist', 'build', '.angular', 'coverage', '.git', 'bin', 'obj']);
function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const roots = [
  'comercial-jhoel-api/src',
  'comercial-jhoel-api/test',
  'comercial-jhoel-api/sql',
  'comercial-jhoel-app/src',
];
const all = roots.flatMap((r) => walk(path.join(ROOT, r), []));
const rel = (f) => path.relative(ROOT, f);
const tsFiles = all.filter((f) => f.endsWith('.ts'));
const htmlFiles = all.filter((f) => f.endsWith('.html'));
const otherFiles = all.filter((f) => /\.(sql|sh|scss|json)$/.test(f) && !f.includes('/assets/'));

function jsDoc(node, sf) {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.getFullStart()) || [];
  const docs = ranges
    .map((r) => sf.text.slice(r.pos, r.end))
    .filter((t) => t.startsWith('/**'));
  if (!docs.length) return '';
  return docs[docs.length - 1]
    .replace(/^\/\*\*|\*\/$/g, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\* ?/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const line = (sf, pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
const text = (n, sf) => (n ? n.getText(sf).replace(/\s+/g, ' ') : '');
function mods(node) {
  const m = (ts.getModifiers && ts.getModifiers(node)) || node.modifiers || [];
  return m.map((x) => ts.SyntaxKind[x.kind].replace('Keyword', '').toLowerCase());
}
function decorators(node, sf) {
  const d = (ts.getDecorators && ts.getDecorators(node)) || [];
  return d.map((x) => text(x.expression, sf).slice(0, 3000));
}
function params(fn, sf) {
  return (fn.parameters || []).map((p) => ({
    name: text(p.name, sf).slice(0, 80),
    type: p.type ? text(p.type, sf).slice(0, 160) : '',
    optional: !!p.questionToken || !!p.initializer,
    decorators: decorators(p, sf),
  }));
}

// Calls made inside a body: this.x.y(), this.y(), plain f(), new X(), throw.
function bodyFacts(body, sf) {
  const calls = new Set();
  const throws = new Set();
  const sqlCalls = new Set();
  const http = [];
  const tables = new Set();
  const guards = [];
  const callAt = {};
  if (!body) return { calls: [], throws: [], sqlCalls: [], http, tables: [], guards: [], callAt };
  const visit = (n) => {
    if (ts.isCallExpression(n)) {
      const e = n.expression;
      const t = text(e, sf).replace(/\s*\.\s*/g, '.');
      if (t.length < 90) calls.add(t);
      if (t.length < 90 && !(t in callAt)) callAt[t] = line(sf, n.getStart(sf));
      if (/\.http\.(get|post|put|patch|delete)$/.test(t)) {
        const arg = n.arguments[0] ? text(n.arguments[0], sf) : '';
        http.push({ method: t.split('.').pop().toUpperCase(), url: arg.slice(0, 160) });
      }
    }
    if (ts.isNewExpression(n)) calls.add('new ' + text(n.expression, sf));
    // Real decisions: `if (cond) throw X` / `if (cond) { …; throw X }`.
    if (ts.isIfStatement(n)) {
      const t = n.thenStatement;
      const thr = ts.isThrowStatement(t) ? t : ts.isBlock(t) ? t.statements.find((x) => ts.isThrowStatement(x)) : null;
      if (thr && thr.expression) {
        guards.push({
          cond: text(n.expression, sf).slice(0, 160),
          throws: text(thr.expression, sf).slice(0, 140),
          line: line(sf, n.getStart(sf)),
        });
      }
    }
    if (ts.isThrowStatement(n) && n.expression) {
      const t = text(n.expression, sf);
      throws.add(t.slice(0, 120));
    }
    if (ts.isStringLiteralLike(n) || ts.isTemplateExpression(n)) {
      const s = n.getText(sf);
      for (const m of s.matchAll(/(?:SELECT|PERFORM|CALL)\s+(?:\*\s+FROM\s+)?([a-z_][a-z0-9_]*)\s*\(/gi)) {
        const name = m[1].toLowerCase();
        if (!['count', 'sum', 'coalesce', 'max', 'min', 'json_agg', 'to_char', 'now', 'abs', 'round', 'json_build_object', 'jsonb_build_object', 'exists', 'string_agg', 'lower', 'upper', 'avg', 'distinct', 'cast', 'array_agg', 'date_trunc'].includes(name))
          sqlCalls.add(name);
      }
      for (const m of s.matchAll(/FROM\s+([a-z_][a-z0-9_]*)\s*\(/gi)) sqlCalls.add(m[1].toLowerCase());
      for (const m of s.matchAll(/\b(?:FROM|JOIN|INTO|UPDATE)\s+"?([a-z_][a-z0-9_]+)\b"?(?!\s*\()/g)) tables.add(m[1]);
    }
    ts.forEachChild(n, visit);
  };
  visit(body);
  return { calls: [...calls].slice(0, 40), throws: [...throws].slice(0, 15), sqlCalls: [...sqlCalls], http, tables: [...tables], guards: guards.slice(0, 30), callAt };
}

function sqlTables(sfText) {
  const tables = new Set();
  for (const m of sfText.matchAll(/\b(?:FROM|JOIN|INTO|UPDATE|TABLE(?: IF NOT EXISTS)?)\s+"?([a-z_][a-z0-9_]+)"?/g)) tables.add(m[1]);
  for (const m of sfText.matchAll(/@Entity\(\s*['"]([a-z_0-9]+)['"]/g)) tables.add(m[1]);
  for (const m of sfText.matchAll(/@Entity\(\s*\{\s*name:\s*['"]([a-z_0-9]+)['"]/g)) tables.add(m[1]);
  return [...tables];
}

function parseFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
  const out = {
    path: rel(file),
    lines: src.split('\n').length,
    fileDoc: '',
    imports: [],
    dynamicImports: [],
    classes: [],
    functions: [],
    interfaces: [],
    types: [],
    enums: [],
    consts: [],
    tablesMentioned: sqlTables(src),
    sqlFunctionsDefined: [...src.matchAll(/CREATE (?:OR REPLACE )?FUNCTION\s+([a-z_][a-z0-9_]*)/gi)].map((m) => m[1].toLowerCase()),
    tablesCreated: [...src.matchAll(/CREATE TABLE(?: IF NOT EXISTS)?\s+"?([a-z_][a-z0-9_]*)/gi)].map((m) => m[1]),
    triggersDefined: [...src.matchAll(/CREATE TRIGGER\s+([a-z_][a-z0-9_]*)/gi)].map((m) => m[1]),
  };
  // file-level doc: first JSDoc in the file if it precedes the first statement
  const first = sf.statements[0];
  if (first) out.fileDoc = jsDoc(first, sf).slice(0, 600);
  for (const m of src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) out.dynamicImports.push(m[1]);

  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const spec = st.moduleSpecifier.text;
      const names = [];
      const c = st.importClause;
      if (c) {
        if (c.name) names.push(c.name.text);
        if (c.namedBindings) {
          if (ts.isNamedImports(c.namedBindings)) c.namedBindings.elements.forEach((e) => names.push(e.name.text));
          else names.push('* as ' + c.namedBindings.name.text);
        }
      }
      out.imports.push({ spec, names, typeOnly: !!(c && c.isTypeOnly) });
      continue;
    }
    if (ts.isExportDeclaration(st) && st.moduleSpecifier) {
      out.imports.push({ spec: st.moduleSpecifier.text, names: ['(re-export)'], typeOnly: false });
      continue;
    }
    const exported = mods(st).includes('export');
    if (ts.isClassDeclaration(st) && st.name) {
      const cls = {
        name: st.name.text,
        exported,
        line: line(sf, st.getStart(sf)),
        endLine: line(sf, st.getEnd()),
        doc: jsDoc(st, sf).slice(0, 900),
        decorators: decorators(st, sf),
        heritage: (st.heritageClauses || []).map((h) => text(h, sf)),
        ctorParams: [],
        properties: [],
        methods: [],
      };
      for (const m of st.members) {
        if (ts.isConstructorDeclaration(m)) {
          cls.ctorParams = params(m, sf).map((p) => ({ ...p, mods: [] }));
          (m.parameters || []).forEach((p, i) => (cls.ctorParams[i].mods = mods(p)));
        } else if (ts.isMethodDeclaration(m) || ts.isGetAccessor(m) || ts.isSetAccessor(m)) {
          const facts = bodyFacts(m.body, sf);
          cls.methods.push({
            name: text(m.name, sf),
            kind: ts.isGetAccessor(m) ? 'getter' : ts.isSetAccessor(m) ? 'setter' : 'method',
            mods: mods(m),
            decorators: decorators(m, sf),
            params: params(m, sf),
            returns: m.type ? text(m.type, sf).slice(0, 160) : '',
            line: line(sf, m.getStart(sf)),
            endLine: line(sf, m.getEnd()),
            doc: jsDoc(m, sf).slice(0, 700),
            ...facts,
          });
        } else if (ts.isPropertyDeclaration(m)) {
          const init = m.initializer ? text(m.initializer, sf) : '';
          const isFn = m.initializer && (ts.isArrowFunction(m.initializer) || ts.isFunctionExpression(m.initializer));
          const prop = {
            name: text(m.name, sf),
            mods: mods(m),
            decorators: decorators(m, sf),
            type: m.type ? text(m.type, sf).slice(0, 120) : '',
            init: init.slice(0, 140),
            line: line(sf, m.getStart(sf)),
            doc: jsDoc(m, sf).slice(0, 400),
          };
          if (isFn) {
            const facts = bodyFacts(m.initializer.body, sf);
            cls.methods.push({
              name: prop.name,
              kind: 'arrow-property',
              mods: prop.mods,
              decorators: prop.decorators,
              params: params(m.initializer, sf),
              returns: m.initializer.type ? text(m.initializer.type, sf) : '',
              line: prop.line,
              endLine: line(sf, m.getEnd()),
              doc: prop.doc,
              ...facts,
            });
          } else cls.properties.push(prop);
        }
      }
      out.classes.push(cls);
    } else if (ts.isFunctionDeclaration(st) && st.name) {
      out.functions.push({
        name: st.name.text,
        exported,
        mods: mods(st),
        params: params(st, sf),
        returns: st.type ? text(st.type, sf).slice(0, 160) : '',
        line: line(sf, st.getStart(sf)),
        endLine: line(sf, st.getEnd()),
        doc: jsDoc(st, sf).slice(0, 700),
        ...bodyFacts(st.body, sf),
      });
    } else if (ts.isInterfaceDeclaration(st)) {
      out.interfaces.push({
        name: st.name.text,
        exported,
        line: line(sf, st.getStart(sf)),
        doc: jsDoc(st, sf).slice(0, 500),
        members: st.members.map((m) => (m.name ? text(m.name, sf) : text(m, sf).slice(0, 40))).slice(0, 60),
        heritage: (st.heritageClauses || []).map((h) => text(h, sf)),
      });
    } else if (ts.isTypeAliasDeclaration(st)) {
      out.types.push({ name: st.name.text, exported, line: line(sf, st.getStart(sf)), doc: jsDoc(st, sf).slice(0, 400), def: text(st.type, sf).slice(0, 200) });
    } else if (ts.isEnumDeclaration(st)) {
      out.enums.push({ name: st.name.text, exported, line: line(sf, st.getStart(sf)), members: st.members.map((m) => text(m.name, sf)) });
    } else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        const name = text(d.name, sf);
        const init = d.initializer;
        const isFn = init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init));
        if (isFn) {
          out.functions.push({
            name,
            exported,
            mods: mods(st),
            params: params(init, sf),
            returns: init.type ? text(init.type, sf).slice(0, 160) : '',
            line: line(sf, d.getStart(sf)),
            endLine: line(sf, d.getEnd()),
            doc: jsDoc(st, sf).slice(0, 700),
            ...bodyFacts(init.body, sf),
          });
        } else {
          out.consts.push({
            name,
            exported,
            line: line(sf, d.getStart(sf)),
            doc: jsDoc(st, sf).slice(0, 400),
            init: init ? text(init, sf).slice(0, 160) : '',
          });
        }
      }
    } else if (ts.isExpressionStatement(st)) {
      // e.g. bootstrap calls in main.ts
      const t = text(st.expression, sf);
      if (/bootstrap|platformBrowser|NestFactory/.test(t)) out.functions.push({ name: '(top-level) ' + t.slice(0, 60), exported: false, mods: [], params: [], returns: '', line: line(sf, st.getStart(sf)), endLine: line(sf, st.getEnd()), doc: '', calls: [], throws: [], sqlCalls: [], http: [] });
    }
  }
  return out;
}

const files = tsFiles.map(parseFile);

// HTML templates: custom element selectors used and event bindings.
const templates = htmlFiles.map((f) => {
  const src = fs.readFileSync(f, 'utf8');
  return {
    path: rel(f),
    lines: src.split('\n').length,
    selectors: [...new Set([...src.matchAll(/<(app-[a-z0-9-]+)/g)].map((m) => m[1]))],
    events: [...new Set([...src.matchAll(/\(([a-zA-Z.]+)\)="([^"]{1,80})"/g)].map((m) => `(${m[1]})="${m[2]}"`))].slice(0, 60),
    calls: [...new Set([...src.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g)].map((m) => m[1]))],
  };
});
const others = otherFiles.map((f) => {
  const src = fs.readFileSync(f, 'utf8');
  return {
    path: rel(f),
    lines: src.split('\n').length,
    head: src.split('\n').filter((l) => /^\s*(--|#)/.test(l)).slice(0, 6).map((l) => l.replace(/^\s*(--|#)\s?/, '')).join(' ').slice(0, 400),
  };
});

fs.writeFileSync(OUT, JSON.stringify({ files, templates, others }, null, 0));
console.log('ts', files.length, 'html', templates.length, 'other', others.length);
