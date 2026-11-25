import { describe, expect, it } from 'vitest';
import { buildStarSteps, starQuiz } from '../../src/data/parts/fn-varargs/starFlow';

describe('star flow steps', () => {
  it('packs 0, 1 and 3 arguments into the real tuple text and sum', () => {
    expect(buildStarSteps('pack', { count: 0, mode: 'spread' }).at(-1)?.output).toBe('0');
    expect(buildStarSteps('pack', { count: 0, mode: 'spread' }).map((step) => step.note).join(' ')).toContain('()');
    expect(buildStarSteps('pack', { count: 1, mode: 'spread' }).map((step) => step.note).join(' ')).toContain('(10,)');
    expect(buildStarSteps('pack', { count: 3, mode: 'spread' }).at(-1)?.output).toBe('60');
  });

  it('keeps the source list while copies move, and contrasts print', () => {
    const spread = buildStarSteps('unpack', { count: 3, mode: 'spread' });
    expect(spread[2]?.chips.some((chip) => chip.id.startsWith('src'))).toBe(true);
    expect(spread.at(-1)?.output).toBe('60');
    expect(buildStarSteps('unpack', { count: 3, mode: 'whole' }).at(-1)?.output).toBe('[10, 20, 30]');
    expect(buildStarSteps('unpack', { count: 3, mode: 'echo' }).at(-1)?.output).toBe('10 20 30');
  });

  it('shows unpack then pack as five steps with both containers', () => {
    const steps = buildStarSteps('both', { count: 3, mode: 'spread' });
    expect(steps).toHaveLength(5);
    expect(steps[3]?.frames.map((frame) => frame.id)).toEqual(['nums', 'args']);
    expect(steps.at(-1)?.output).toBe('(10, 20, 30)');
  });

  it('sends a keyword past *args and collects assignment targets as lists', () => {
    expect(buildStarSteps('mixed', { count: 5, mode: 'keyword' }).at(-1)?.output).toBe('10 (20, 30) 40');
    const mid = buildStarSteps('assign', { count: 5, mode: 'mid' });
    expect(mid[1]?.frames.find((frame) => frame.id === 'b')?.kind).toBe('list');
    expect(buildStarSteps('nest', { count: 3, mode: 'spread' }).at(-1)?.output).toBe('[1, 2, 3, 4, 5, 6]');
  });

  it('grades the call quiz and the extension quiz', () => {
    expect(starQuiz().map((item) => item.answer)).toEqual(['nest', 'flat', 'err', 'dict', 'ab', 'star']);
    expect(buildStarSteps('kwargs', { count: 0, mode: 'spread' }).at(-1)?.output).toBe('{}');
    expect(buildStarSteps('kwunpack', { count: 2, mode: 'spread' }).at(-1)?.output).toBe('10 20');
    expect(buildStarSteps('bench', { count: 4, mode: 'spread' }).at(-1)?.output).toContain('60');
    expect(buildStarSteps('forward', { count: 0, mode: 'spread' }).at(-1)?.output).toBe('Python | AI!');
    expect(buildStarSteps('dictmerge', { count: 0, mode: 'bad' }).at(-1)?.error).toContain('multiple values');
  });
});
