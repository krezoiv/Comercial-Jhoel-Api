-- Read-only snapshot of the public schema as one JSON line, consumed by render.js.
-- Runs inside a READ ONLY transaction that is rolled back: it never writes.
BEGIN READ ONLY;
SELECT json_build_object(
 'tables', (SELECT json_agg(json_build_object(
     'name', c.relname,
     'comment', obj_description(c.oid),
     'columns', (SELECT json_agg(json_build_object('name', a.attname, 'type', format_type(a.atttypid, a.atttypmod), 'notnull', a.attnotnull,
                  'default', pg_get_expr(d.adbin, d.adrelid)) ORDER BY a.attnum)
                 FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
                 WHERE a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped),
     'constraints', (SELECT json_agg(json_build_object('name', k.conname, 'type', k.contype, 'def', pg_get_constraintdef(k.oid),
                  'ref', CASE WHEN k.contype='f' THEN k.confrelid::regclass::text END) ORDER BY k.contype, k.conname)
                 FROM pg_constraint k WHERE k.conrelid = c.oid),
     'indexes', (SELECT json_agg(json_build_object('name', i.relname, 'def', pg_get_indexdef(x.indexrelid)) ORDER BY i.relname)
                 FROM pg_index x JOIN pg_class i ON i.oid = x.indexrelid WHERE x.indrelid = c.oid),
     'triggers', (SELECT json_agg(json_build_object('name', t.tgname, 'def', pg_get_triggerdef(t.oid)) ORDER BY t.tgname)
                 FROM pg_trigger t WHERE t.tgrelid = c.oid AND NOT t.tgisinternal)
   ) ORDER BY c.relname)
   FROM pg_class c WHERE c.relkind = 'r' AND c.relnamespace = 'public'::regnamespace),
 'views', (SELECT json_agg(json_build_object('name', c.relname)) FROM pg_class c WHERE c.relkind IN ('v','m') AND c.relnamespace='public'::regnamespace),
 'functions', (SELECT json_agg(json_build_object('name', p.proname, 'args', pg_get_function_arguments(p.oid),
     'returns', pg_get_function_result(p.oid), 'lang', l.lanname, 'trigger', p.prorettype = 'trigger'::regtype,
     'raises', (SELECT json_agg(DISTINCT m[1]) FROM regexp_matches(p.prosrc, 'RAISE EXCEPTION ''([A-Z_]+)[:'']', 'g') m),
     'tablesWritten', (SELECT json_agg(DISTINCT m[2]) FROM regexp_matches(p.prosrc, '(INSERT INTO|UPDATE|DELETE FROM)\s+([a-z_][a-z0-9_]*)', 'g') m),
     'calls', (SELECT json_agg(DISTINCT m[1]) FROM regexp_matches(p.prosrc, '(?:PERFORM|:=|SELECT)\s+([a-z_][a-z0-9_]*)\(', 'g') m),
     'locks', (SELECT json_agg(DISTINCT m[1]) FROM regexp_matches(p.prosrc, 'pg_advisory_xact_lock\(hashtext\(''([a-z_]+)''', 'g') m),
     'guards', (SELECT json_agg(json_build_object('cond', left(regexp_replace(m[1], '\s+', ' ', 'g'), 160), 'code', m[2]))
                FROM regexp_matches(p.prosrc, 'IF\s+?(.+?)\s+?THEN\s+?RAISE EXCEPTION ''([A-Z_]+)[:'']', 'g') m)
   ) ORDER BY p.proname)
   FROM pg_proc p JOIN pg_language l ON l.oid = p.prolang
   WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f'),
 'migrations', (SELECT json_agg(name ORDER BY id) FROM migrations)
);
ROLLBACK;
