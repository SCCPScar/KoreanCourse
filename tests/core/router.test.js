import { describe, expect, it } from 'vitest';
import { isInPageAnchor, resolveRoute } from '../../public/js/core/router.js';

const routes = ['inicio', 'hangul'];

describe('resolveRoute', () => {
  it('usa a rota do hash quando existe', () => {
    expect(resolveRoute('#hangul', routes, 'inicio')).toBe('hangul');
  });

  it('usa a rota padrão com hash vazio ou desconhecido', () => {
    expect(resolveRoute('', routes, 'inicio')).toBe('inicio');
    expect(resolveRoute('#nao-existe', routes, 'inicio')).toBe('inicio');
  });
});

describe('isInPageAnchor', () => {
  const fakeDoc = { getElementById: (id) => (id === 'conteudo' ? {} : null) };

  it('reconhece âncoras internas que não são rotas', () => {
    expect(isInPageAnchor('#conteudo', routes, fakeDoc)).toBe(true);
  });

  it('não confunde rotas nem hashes desconhecidos com âncoras', () => {
    expect(isInPageAnchor('#hangul', routes, fakeDoc)).toBe(false);
    expect(isInPageAnchor('#nao-existe', routes, fakeDoc)).toBe(false);
    expect(isInPageAnchor('', routes, fakeDoc)).toBe(false);
  });
});
