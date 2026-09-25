import { describe, expect, it } from 'vitest';
import { esc } from '../../public/js/core/dom.js';

describe('esc', () => {
  it('neutraliza tags de script', () => {
    expect(esc('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('escapa aspas e o e comercial', () => {
    expect(esc(`"a" & 'b'`)).toBe('&quot;a&quot; &amp; &#39;b&#39;');
  });

  it('mantém o texto coreano intacto', () => {
    expect(esc('안녕하세요')).toBe('안녕하세요');
  });

  it('converte null e undefined em texto vazio', () => {
    expect(esc(null)).toBe('');
    expect(esc(undefined)).toBe('');
  });
});
