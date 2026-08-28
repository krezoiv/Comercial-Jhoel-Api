-- Lista los usuarios, sin exponer password_hash.
SELECT
  id,
  name,
  email,
  username,
  phone,
  created_at,
  updated_at
FROM users
ORDER BY created_at DESC;
