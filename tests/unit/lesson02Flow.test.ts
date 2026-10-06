import { describe, it, expect } from 'vitest';
import { lesson02 } from '../../src/data/lessons';
import type { Scene } from '../../src/types/scene';

function stringScenes() {
  return lesson02.scenes.filter((scene) => scene.partId === '04');
}

function codesInOrder(scenes: Scene[]) {
  return scenes.flatMap((scene) => [
    scene.code?.initial ?? '',
    ...(scene.content.codeBeats?.beats.map((beat) => beat.code ?? '') ?? []),
    ...(scene.content.stringCut?.codes ?? []),
    scene.content.stringBoard?.nextCode ?? '',
    scene.content.stringTemplate?.formatCode ?? '',
    scene.content.stringCast?.code ?? '',
  ]);
}

describe('lesson02 string methods', () => {
  it('builds one string model before the summary sentence', () => {
    const titles = stringScenes().map((scene) => scene.content.headline ?? '');
    const start = titles.indexOf('曲阜');
    expect(titles.slice(start)).toEqual([
      '曲阜',
      '查找',
      '空白',
      '大小写',
      '替换',
      '改一格',
      '分词',
      '拼接',
      '键盘读入',
      '加号的麻烦',
      'f-string',
      '花括号里能算',
      '格式说明',
      '少了 f',
      '练一练：改写成 f-string',
      '确认单',
    ]);

    const codes = codesInOrder(stringScenes());
    const at = (pattern: RegExp) => codes.findIndex((code) => pattern.test(code));

    const known = codes.find((code) => code.includes('campus.find("师范")')) ?? '';
    expect(known.indexOf('campus[0:2]')).toBeGreaterThan(-1);
    expect(known.indexOf('campus[0:2]')).toBeLessThan(known.indexOf('campus.find("师范")'));
    const many = codes.find((code) => code.includes('campus.find("青岛")')) ?? '';
    expect(many.indexOf('"学" in campus')).toBeLessThan(many.indexOf('campus.count("学")'));
    expect(many.indexOf('campus.count("学")')).toBeLessThan(many.indexOf('campus.find("学")'));
    expect(many.indexOf('campus.find("学")')).toBeLessThan(many.indexOf('campus.find("学", 6)'));
    expect(many.indexOf('"青岛" in campus')).toBeLessThan(many.indexOf('campus.find("青岛")'));
    expect(at(/\.strip\(/)).toBeGreaterThan(at(/name == "李华"/));
    expect(at(/\.strip\(/)).toBeGreaterThan(at(/\[2:-2\]/));
    expect(at(/\.lower\(/)).toBeGreaterThan(at(/answer == "yes"/));
    expect(at(/\.upper\(/)).toBeGreaterThan(at(/\.lower\(/));
    expect(at(/intro\.replace\(/)).toBeGreaterThan(at(/\[:7\]/));
    expect(at(/intro = intro\.replace/)).toBeGreaterThan(at(/intro\.replace\(/));
    expect(at(/\.split\(/)).toBeGreaterThan(at(/intro\[0:1\]/));
    expect(at(/" "\.join\(/)).toBeGreaterThan(at(/\.split\(/));
    expect(at(/minutes \* 1\.5/)).toBeGreaterThan(at(/type\(minutes\)/));
    expect(at(/\bint\(/)).toBeGreaterThan(at(/minutes \* 1\.5/));

    const close = codesInOrder([lesson02.scenes.find((scene) => scene.id === 'scene-str-10')!]).join('\n');
    expect(close).toContain('name + "已确认"');
    expect(close).toContain('曲阜师范大学计算机学院');
    expect(close).toContain('f"骑行 {minutes} 分钟"');
    expect(close).not.toContain('喜欢 Python');
  });

  it('keeps every code editor editable', () => {
    for (const scene of lesson02.scenes) {
      if (!scene.code) continue;
      expect(scene.code.editable, scene.id).toBe(true);
    }
  });

  it('does not dump extra string methods into the code', () => {
    const code = codesInOrder(stringScenes()).join('\n');
    expect(code).not.toMatch(/\.startswith\(|\.endswith\(/);
  });

  it('predicts index assignment, an unassigned replace, and input type', () => {
    const assign = lesson02.scenes.find((scene) => scene.id === 'scene-str-08');
    expect(assign?.prediction?.options.find((option) => option.isCorrect)?.label).toBe('TypeError');
    expect(assign?.code?.initial).toContain('word[0] = "J"');
    const fork = assign?.content.codeBeats?.beats.find((beat) => beat.fork)?.fork;
    expect(fork?.keep.name).toBe('word');
    expect(fork?.created.name).toBe('new_word');
    expect(assign?.content.codeBeats?.beats.some((beat) => beat.code?.includes('"J" + word[1:]'))).toBe(
      true,
    );

    const replace = lesson02.scenes.find((scene) => scene.id === 'scene-str-replace-keep');
    const replaceCodes = codesInOrder([replace!]);
    const unassigned = replaceCodes.findIndex(
      (code) => code.includes('intro.replace("C", "Python")') && !code.includes('intro = intro.replace'),
    );
    const assigned = replaceCodes.findIndex((code) => code.includes('intro = intro.replace'));
    expect(unassigned).toBeGreaterThan(-1);
    expect(assigned).toBeGreaterThan(unassigned);

    const age = lesson02.scenes.find((scene) => scene.id === 'scene-str-09');
    expect(age?.code?.initial).not.toMatch(/\bint\(|\bfloat\(|f"/);
    expect(age?.prediction?.options.find((option) => option.isCorrect)?.label).toBe('str');
    const cast = codesInOrder([age!]);
    expect(cast.some((code) => code.includes('minutes = int(minutes)') && code.includes('minutes * price'))).toBe(
      true,
    );
    expect(cast.join('\n')).not.toMatch(/float\(|18\.5/);
    expect(age?.reveal).toBeUndefined();
  });
});
