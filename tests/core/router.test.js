import { describe, expect, it } from 'vitest';
import { isInPageAnchor, resolveRoute, routeForClick } from '../../public/js/core/router.js';

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

describe('routeForClick', () => {
  const click = (overrides) => ({
    href: '#hangul',
    target: '',
    download: false,
    button: 0,
    modified: false,
    ...overrides,
  });

  it('um clique normal num link de seção dispara a transição', () => {
    expect(routeForClick(click(), routes, 'inicio')).toBe('hangul');
  });

  it('não dispara em links externos, âncoras e target="_blank"', () => {
    expect(routeForClick(click({ href: 'https://example.com' }), routes, 'inicio')).toBeNull();
    expect(routeForClick(click({ href: '#conteudo' }), routes, 'inicio')).toBeNull();
    expect(routeForClick(click({ href: '#' }), routes, 'inicio')).toBeNull();
    expect(routeForClick(click({ target: '_blank' }), routes, 'inicio')).toBeNull();
  });

  it('não dispara com Ctrl/⌘, botão do meio, download ou na seção atual', () => {
    expect(routeForClick(click({ modified: true }), routes, 'inicio')).toBeNull();
    expect(routeForClick(click({ button: 1 }), routes, 'inicio')).toBeNull();
    expect(routeForClick(click({ download: true }), routes, 'inicio')).toBeNull();
    expect(routeForClick(click(), routes, 'hangul')).toBeNull();
  });
});
