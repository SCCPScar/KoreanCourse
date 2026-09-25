import { describe, expect, it } from 'vitest';
import { resolveRoute } from '../../public/js/core/router.js';

const routes = ['inicio', 'hangul'];

describe('resolveRoute', () => {
  it('usa a rota do hash quando existe', () => {
    expect(resolveRoute('#hangul', routes, 'inicio')).toBe('hangul');
  });

  it('usa a rota por omissão com hash vazio ou desconhecido', () => {
    expect(resolveRoute('', routes, 'inicio')).toBe('inicio');
    expect(resolveRoute('#nao-existe', routes, 'inicio')).toBe('inicio');
  });
});
