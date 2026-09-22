import { describe, it, expect } from 'vitest';
import { lesson01 } from '../../src/data/lessons';

function headlines(partId: string): string[] {
  return lesson01.scenes.filter((s) => s.partId === partId).map((s) => s.content.headline ?? '');
}

describe('lesson01 teaching order', () => {
  it('teaches three languages before the translation stack', () => {
    expect(headlines('02')).toEqual([
      '计算机听得懂人话吗？',
      '机器语言',
      '汇编语言',
      '高级语言',
      '三种语言是一层一层的关系',
      '高级语言有很多种',
      '自然语言能代替编程语言吗？',
    ]);
    const conflict = lesson01.scenes.find((s) => s.id === 'scene-03');
    expect(conflict?.content.digestPipeline).toBeUndefined();
    expect(conflict?.content.historyDialogue?.conclusion).toContain('计算机自己的语言');
  });

  it('leaves 代码与数据 as the last execute-python beat before variables', () => {
    expect(headlines('06').at(-1)).toBe('代码与数据不是一回事');
    expect(headlines('06')).not.toContain('表达式');
  });

  it('lands the variable definition before assignment and change', () => {
    expect(headlines('07')).toEqual([
      '同一份数据要用两次',
      '变量是什么',
      'score = 92 究竟发生了什么',
      '用名字，不是用文字',
      '变量为什么叫「变」量',
      '名字要让人读懂',
    ]);
    const definition = lesson01.scenes.find((s) => s.id === 'scene-fp-16b');
    expect(definition?.content.varDefinition?.definition).toContain('程序给一份数据起的名字');
    const change = lesson01.scenes.find((s) => s.id === 'scene-fp-19');
    expect(change?.content.varModel?.followOn?.codeLines).toContain('score = score + 5');
  });
});
