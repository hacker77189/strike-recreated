import React from 'react'

/**
 * Lightweight regex tokenizer → VS Code "Dark+" exact colors (see .tok-* in index.css).
 * Order matters: comments and strings are matched before identifiers/keywords.
 */
const TOKEN = new RegExp(
  [
    '(\\/\\/[^\\n]*)',                                              // 1 comment
    '(`[^`]*`)',                                                    // 2 template string
    '("[^"]*"|\'[^\']*\')',                                        // 3 string
    '\\b(const|let|var|async|await|return|function|new|of|in|if|else|for|while|try|catch|throw)\\b', // 4 keyword
    '\\b(true|false|null|undefined)\\b',                            // 5 literal
    '\\b(\\d+(?:\\.\\d+)?)\\b',                                     // 6 number
    '([A-Za-z_$][\\w$]*)(?=\\s*\\()',                              // 7 function call
    '([A-Za-z_$][\\w$]*)',                                         // 8 identifier
  ].join('|'),
  'g',
)

const CLASS = [
  'tok-comment',  // 1
  'tok-string',   // 2
  'tok-string',   // 3
  'tok-keyword',  // 4
  'tok-keyword',  // 5
  'tok-number',   // 6
  'tok-function', // 7
  'tok-var',      // 8
]

export function highlight(line) {
  const out = []
  let last = 0
  let key = 0
  let m
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(line)) !== null) {
    if (m.index > last) {
      out.push(<span key={key++} className="tok-default">{line.slice(last, m.index)}</span>)
    }
    const gi = m.slice(1).findIndex((g) => g !== undefined)
    out.push(<span key={key++} className={CLASS[gi]}>{m[0]}</span>)
    last = m.index + m[0].length
  }
  if (last < line.length) {
    out.push(<span key={key++} className="tok-default">{line.slice(last)}</span>)
  }
  return out
}
