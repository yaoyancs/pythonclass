import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { offering2026S } from '../../src/data/offerings/2026S';
import { buildLesson } from '../../src/data/offerings/buildLesson';

const spec = offering2026S.lectures.find((l) => l.id === 'lesson08')!;
const lesson08 = buildLesson(spec);

describe('lesson08 redpacket flow', () => {
  it('assembles 7 parts without premature def on builtin intro or tkinter dependency', () => {
    expect(lesson08.parts.map((p) => p.index)).toEqual(['01', '02', '03', '04', '05', '06', '07']);
    const firstBuiltin = lesson08.scenes.find((s) => s.id === 'fn-why-used')!;
    expect(JSON.stringify(firstBuiltin.content)).not.toContain('def');

    const builtinTable = lesson08.scenes.find((s) => s.id === 'fn-why-builtin')!;
    expect(builtinTable.content.gridTable?.rows.length).toBe(5);

    for (const scene of lesson08.scenes) {
      expect(scene.content.playlistFormApp).toBeUndefined();
      if (scene.code) {
        expect(scene.code.editable, scene.id).toBe(true);
        expect(scene.code.initial, scene.id).not.toContain('tkinter');
      }
    }
  });

  it('executes every non-interactive run scene and level-3 solution cleanly in Python 3', () => {
    for (const s of lesson08.scenes) {
      if (s.type === 'run' && s.code && !s.pairedCode && !s.code.initial.includes('input(')) {
        const out = execFileSync('python3', ['-c', s.code.initial], { encoding: 'utf8' }).trim();
        if (s.expectedOutput) {
          expect(out, s.id).toBe(s.expectedOutput.trim());
        }
      }
      if ((s.type === 'debug' || s.type === 'challenge') && s.hints?.length === 3 && s.expectedOutput) {
        const h3 = s.hints[2]!.text;
        const fullCode = s.id === 'fn-close-challenge'
          ? s.code!.initial.replace(/def send_and_grab[\s\S]*?pass/, h3)
          : h3;
        const out = execFileSync('python3', ['-c', fullCode], { encoding: 'utf8' }).trim();
        expect(out, `${s.id} hint 3`).toBe(s.expectedOutput.trim());
      }
    }
  });

  it('runs paired custom module redpacket.py + main.py together', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson08-mod-'));
    try {
      for (const id of ['mod-own', 'mod-main']) {
        const scene = lesson08.scenes.find((s) => s.id === id)!;
        expect(scene.pairedCode).toBeDefined();
        fs.writeFileSync(path.join(tmpDir, 'redpacket.py'), scene.code!.initial, 'utf8');
        fs.writeFileSync(path.join(tmpDir, 'main.py'), scene.pairedCode!.initial, 'utf8');
        const modOut = execFileSync('python3', ['redpacket.py'], { cwd: tmpDir, encoding: 'utf8' });
        const mainOut = execFileSync('python3', ['main.py'], { cwd: tmpDir, encoding: 'utf8' });
        if (id === 'mod-own') {
          expect(mainOut).toContain('手气最佳：小红（6.4 元）');
        } else {
          expect(modOut).toContain('__main__');
          expect(modOut).toContain('正在单独运行');
          expect(mainOut).toContain('redpacket 模块里的 __name__ 是: redpacket');
          expect(mainOut).not.toContain('正在单独运行');
        }
      }
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
