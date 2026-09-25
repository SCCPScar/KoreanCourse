import { describe, expect, it } from 'vitest';
import { nextTabIndex } from '../../public/js/core/tabs.js';

describe('nextTabIndex', () => {
  it('as setas andam uma aba e dão a volta nas pontas', () => {
    expect(nextTabIndex('ArrowRight', 0, 5)).toBe(1);
    expect(nextTabIndex('ArrowRight', 4, 5)).toBe(0);
    expect(nextTabIndex('ArrowLeft', 0, 5)).toBe(4);
  });

  it('Home e End vão para a primeira e a última', () => {
    expect(nextTabIndex('Home', 3, 5)).toBe(0);
    expect(nextTabIndex('End', 1, 5)).toBe(4);
  });

  it('ignora outras teclas', () => {
    expect(nextTabIndex('Enter', 1, 5)).toBeNull();
  });
});
