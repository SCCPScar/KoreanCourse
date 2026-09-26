import { describe, expect, it } from 'vitest';
import { findKoreanVoice } from '../../public/js/core/speech.js';

describe('findKoreanVoice', () => {
  it('encontra vozes ko-KR e ko_KR', () => {
    const pt = { lang: 'pt-PT', name: 'Joana' };
    const ko = { lang: 'ko_KR', name: 'Yuna' };
    expect(findKoreanVoice([pt, ko])).toBe(ko);
  });

  it('retorna null quando não há voz coreana', () => {
    expect(findKoreanVoice([{ lang: 'en-US' }])).toBeNull();
    expect(findKoreanVoice([])).toBeNull();
  });
});
