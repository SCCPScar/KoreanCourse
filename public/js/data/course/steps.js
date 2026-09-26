/**
 * Funções que criam os passos das lições (usadas pelos arquivos line-N.js).
 *
 * Formato dos passos (ver lib/lesson.js):
 *  - learn(título, texto, [[hangul, romanização, português], …])
 *  - choice({ prompt, ko?, listen?, lang, options, answer, explain? })
 *      lang = idioma das opções: 'ko' (Hangul), 'pt' ou 'rom' (romanização)
 *  - build(tradução, peças certas, peças a mais, explicação?)
 *  - read(hangul, [romanizações aceitas], tradução)
 */

export const learn = (title, text, items) => ({
  type: 'learn',
  title,
  text,
  items: items.map(([ko, rom, pt]) => ({ ko, rom, pt })),
});

export const choice = ({ prompt, ko, listen = false, lang, options, answer, explain }) => ({
  type: 'choice',
  prompt,
  ko,
  listen,
  lang,
  options,
  answer,
  explain,
});

export const build = (pt, tiles, extra, explain) => ({ type: 'build', pt, tiles, extra, explain });

export const read = (ko, answers, pt) => ({ type: 'read', ko, answers, pt });
