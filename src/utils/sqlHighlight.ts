const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'OFFSET',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'AS',
  'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'BETWEEN', 'LIKE', 'EXISTS',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'UNION', 'ALL',
  'HAVING', 'WITH', 'ASC', 'DESC', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'CONSTRAINT',
  'UNIQUE', 'CHECK', 'INDEX', 'VIEW', 'TRIGGER', 'PROCEDURE', 'FUNCTION',
  'RETURN', 'IF', 'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function highlightSql(sql: string): string {
  const tokens: string[] = [];
  let i = 0;
  const len = sql.length;

  while (i < len) {
    const ch = sql[i];

    // Comments -- ...
    if (ch === '-' && sql[i + 1] === '-') {
      let end = sql.indexOf('\n', i);
      if (end === -1) end = len;
      tokens.push(`<span class="dq-sql-comment">${escapeHtml(sql.slice(i, end))}</span>`);
      i = end;
      continue;
    }

    // Multi-line comments /* */
    if (ch === '/' && sql[i + 1] === '*') {
      let end = sql.indexOf('*/', i);
      if (end === -1) end = len;
      else end += 2;
      tokens.push(`<span class="dq-sql-comment">${escapeHtml(sql.slice(i, end))}</span>`);
      i = end;
      continue;
    }

    // Strings
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let end = i + 1;
      while (end < len && sql[end] !== quote) {
        if (sql[end] === '\\') end++;
        end++;
      }
      end = Math.min(end + 1, len);
      tokens.push(`<span class="dq-sql-string">${escapeHtml(sql.slice(i, end))}</span>`);
      i = end;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let end = i;
      while (end < len && /[0-9.]/.test(sql[end])) end++;
      tokens.push(`<span class="dq-sql-number">${escapeHtml(sql.slice(i, end))}</span>`);
      i = end;
      continue;
    }

    // Identifiers/keywords
    if (/[a-zA-Z_]/.test(ch)) {
      let end = i;
      while (end < len && /[a-zA-Z0-9_]/.test(sql[end])) end++;
      const word = sql.slice(i, end);
      const upper = word.toUpperCase();
      if (SQL_KEYWORDS.has(upper)) {
        tokens.push(`<span class="dq-sql-keyword">${escapeHtml(word)}</span>`);
      } else if (sql[end] === '(') {
        tokens.push(`<span class="dq-sql-function">${escapeHtml(word)}</span>`);
      } else {
        tokens.push(escapeHtml(word));
      }
      i = end;
      continue;
    }

    // Default
    tokens.push(escapeHtml(ch));
    i++;
  }

  return tokens.join('');
}
