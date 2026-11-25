import type { StarFlowContent } from '../../../types/scene';

export type StarKind = StarFlowContent['kind'];

export interface StarChip {
  id: string;
  text: string;
  x: number;
  y: number;
  copy?: boolean;
}

export interface StarFrame {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'list' | 'tuple';
  hot?: boolean;
}

export interface StarArrow {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface StarStep {
  code: string;
  line: number;
  mark: string;
  note: string;
  output: string;
  error?: string;
  chips: StarChip[];
  frames: StarFrame[];
  arrows: StarArrow[];
}

export interface StarControls {
  count: number;
  mode: 'spread' | 'whole' | 'echo' | 'keyword' | 'head' | 'mid' | 'tail';
}

const PACK_COUNTS = [0, 1, 2, 3, 5];

function vals(count: number): number[] {
  return [10, 20, 30, 40, 50, 60].slice(0, count);
}

function tupleText(items: number[]): string {
  if (items.length === 0) return '()';
  if (items.length === 1) return `(${items[0]},)`;
  return `(${items.join(', ')})`;
}

function row(items: number[], y: number, prefix: string, x0 = 70, gap = 90): StarChip[] {
  const width = Math.max(items.length - 1, 0) * gap;
  const start = x0 + (500 - width) / 2;
  return items.map((value, index) => ({
    id: `${prefix}${index}`,
    text: String(value),
    x: items.length ? start + index * gap : 320,
    y,
  }));
}

function packSteps(count: number): StarStep[] {
  const items = vals(count);
  const call = items.length ? `add(${items.join(', ')})` : 'add()';
  const code = `def add(*nums):\n    return sum(nums)\n\nprint(${call})`;
  const packed = tupleText(items);
  const total = String(items.reduce((sum, value) => sum + value, 0));
  const loose = row(items, 36, 'n');
  const box: StarFrame = { id: 'nums', label: 'nums', x: 120, y: 168, w: 400, h: 64, kind: 'tuple', hot: true };
  const inside = items.map((value, index) => ({
    id: `n${index}`,
    text: String(value),
    x: box.x + 28 + index * ((box.w - 70) / Math.max(items.length, 1)),
    y: 186,
  }));
  return [
    { code, line: 4, mark: call, note: '', output: '', chips: loose, frames: [], arrows: [] },
    { code, line: 1, mark: '*nums', note: '', output: '', chips: loose.map((chip, index) => ({ ...chip, x: 200 + index * 48, y: 108 })), frames: [], arrows: [] },
    { code, line: 1, mark: '*nums', note: items.length === 1 ? '(10,)' : packed, output: '', chips: inside, frames: [box], arrows: [] },
    { code, line: 2, mark: 'sum(nums)', note: '', output: total, chips: inside, frames: [box], arrows: [] },
  ];
}

function unpackSteps(mode: StarControls['mode']): StarStep[] {
  const items = [10, 20, 30];
  const printing = mode === 'whole' || mode === 'echo';
  const code = printing
    ? 'nums = [10, 20, 30]\n\nprint(nums)\nprint(*nums)'
    : 'def add(a, b, c):\n    return a + b + c\n\nnums = [10, 20, 30]\nprint(add(*nums))';
  const list: StarFrame = { id: 'nums', label: 'nums', x: 145, y: 16, w: 350, h: 58, kind: 'list' };
  const held = items.map((value, index) => ({ id: `src${index}`, text: String(value), x: 180 + index * 90, y: 32 }));
  const born = items.map((value, index) => ({ id: `go${index}`, text: String(value), x: 180 + index * 90, y: 32, copy: true }));
  const copies = born.map((chip, index) => ({ ...chip, x: 150 + index * 130, y: 130 }));
  const names = ['a', 'b', 'c'].map((label, index) => ({
    id: label,
    label,
    x: 150 + index * 130,
    y: 214,
    w: 90,
    h: 52,
    kind: 'tuple' as const,
  }));
  const bound = items.map((value, index) => ({ id: `go${index}`, text: String(value), x: 174 + index * 130, y: 228, copy: true }));
  if (printing) {
    const star = mode === 'echo';
    const printCode = 'nums = [10, 20, 30]\n\nprint(nums)\nprint(*nums)';
    if (!star) {
      const blob = { id: 'one', text: '[10, 20, 30]', x: 230, y: 28 };
      return [
        { code: printCode, line: 1, mark: 'nums', note: '', output: '', chips: held, frames: [list], arrows: [] },
        { code: printCode, line: 3, mark: 'print(nums)', note: '', output: '', chips: [...held, blob], frames: [list], arrows: [] },
        { code: printCode, line: 3, mark: 'print(nums)', note: '1 个参数', output: '[10, 20, 30]', chips: [...held, { ...blob, y: 150 }], frames: [list], arrows: [] },
      ];
    }
    return [
      { code: printCode, line: 1, mark: 'nums', note: '', output: '', chips: held, frames: [list], arrows: [] },
      { code: printCode, line: 4, mark: '*nums', note: '', output: '', chips: [...held, ...born], frames: [{ ...list, hot: true }], arrows: [] },
      { code: printCode, line: 4, mark: '*nums', note: '3 个参数', output: '10 20 30', chips: [...held, ...copies], frames: [list], arrows: [] },
    ];
  }
  return [
    { code, line: 4, mark: 'nums', note: '', output: '', chips: held, frames: [list], arrows: [] },
    { code, line: 5, mark: '*nums', note: '', output: '', chips: [...held, ...born], frames: [{ ...list, hot: true }], arrows: [] },
    { code, line: 5, mark: '*nums', note: '', output: '', chips: [...held, ...copies], frames: [list], arrows: [] },
    { code, line: 1, mark: 'a, b, c', note: '', output: '', chips: [...held, ...bound], frames: [list, ...names], arrows: [] },
    { code, line: 2, mark: 'return', note: '', output: '60', chips: [...held, ...bound], frames: [list, ...names], arrows: [] },
  ];
}

function compareSteps(): StarStep[] {
  const left = [10, 20, 30].map((value, index) => ({ id: `p${index}`, text: String(value), x: 36 + index * 70, y: 36 }));
  const leftBox: StarFrame = { id: 'pack', label: '(10, 20, 30)', x: 28, y: 168, w: 250, h: 56, kind: 'tuple' };
  const leftIn = [10, 20, 30].map((value, index) => ({ id: `p${index}`, text: String(value), x: 52 + index * 70, y: 184 }));
  const rightBox: StarFrame = { id: 'list', label: '[10, 20, 30]', x: 340, y: 24, w: 270, h: 56, kind: 'list' };
  const rightHeld = [10, 20, 30].map((value, index) => ({ id: `s${index}`, text: String(value), x: 372 + index * 70, y: 40 }));
  const rightBorn = rightHeld.map((chip, index) => ({ ...chip, id: `o${index}`, copy: true }));
  const rightOut = rightBorn.map((chip) => ({ ...chip, y: 176 }));
  const code = 'def f(*args):\n    return args\n\nnums = [10, 20, 30]\nprint(f(10, 20, 30))\nprint(f(*nums))';
  return [
    { code, line: 1, mark: '*args', note: '', output: '', chips: [...left, ...rightHeld], frames: [rightBox], arrows: [] },
    { code, line: 1, mark: '*args', note: '', output: '', chips: [...leftIn, ...rightHeld], frames: [leftBox, rightBox], arrows: [] },
    { code, line: 5, mark: '*nums', note: '', output: '', chips: [...leftIn, ...rightHeld, ...rightBorn], frames: [leftBox, { ...rightBox, hot: true }], arrows: [] },
    { code, line: 5, mark: '*nums', note: '', output: '', chips: [...leftIn, ...rightHeld, ...rightOut], frames: [leftBox, rightBox], arrows: [] },
  ];
}

function bothSteps(): StarStep[] {
  const code = 'def f(*args):\n    print(args)\n\nnums = [10, 20, 30]\nf(*nums)';
  const list: StarFrame = { id: 'nums', label: '调用方 nums', x: 150, y: 8, w: 340, h: 52, kind: 'list' };
  const held = [10, 20, 30].map((value, index) => ({ id: `s${index}`, text: String(value), x: 190 + index * 80, y: 22 }));
  const born = held.map((chip, index) => ({ ...chip, id: `g${index}`, copy: true }));
  const loose = born.map((chip) => ({ ...chip, y: 118 }));
  const box: StarFrame = { id: 'args', label: 'args', x: 150, y: 188, w: 340, h: 56, kind: 'tuple', hot: true };
  const inside = loose.map((chip) => ({ ...chip, y: 202 }));
  return [
    { code, line: 4, mark: 'nums', note: '', output: '', chips: held, frames: [list], arrows: [] },
    { code, line: 5, mark: '*nums', note: '', output: '', chips: [...held, ...born], frames: [{ ...list, hot: true }], arrows: [] },
    { code, line: 5, mark: '*nums', note: '', output: '', chips: [...held, ...loose], frames: [list], arrows: [] },
    { code, line: 1, mark: '*args', note: '', output: '', chips: [...held, ...inside], frames: [list, box], arrows: [] },
    { code, line: 2, mark: 'print(args)', note: '', output: '(10, 20, 30)', chips: [...held, ...inside], frames: [list, box], arrows: [] },
  ];
}

function mixedSteps(mode: StarControls['mode']): StarStep[] {
  if (mode === 'tail') {
    const ok = 'play("demo.mp4", speed=2, muted=True)';
    const bad = 'play("demo.mp4", 2, True)';
    const code = `def play(video, *, speed=1, muted=False):\n    print(video, speed, muted)\n\n${ok}`;
    return [
      { code, line: 1, mark: '*', note: '不收集数据', output: '', chips: [], frames: [{ id: 'bar', label: '*', x: 280, y: 20, w: 80, h: 36, kind: 'tuple', hot: true }], arrows: [] },
      { code, line: 4, mark: 'speed=2', note: '', output: 'demo.mp4 2 True', chips: [{ id: 'v', text: 'demo.mp4', x: 40, y: 120 }, { id: 's', text: '2', x: 240, y: 120 }, { id: 'm', text: 'True', x: 400, y: 120 }], frames: [], arrows: [] },
      { code: code.replace(ok, bad), line: 4, mark: '2, True', note: '', output: '', error: 'TypeError: play() takes 1 positional argument but 3 were given', chips: [{ id: 'v', text: 'demo.mp4', x: 40, y: 40 }, { id: 's', text: '2', x: 240, y: 40 }, { id: 'm', text: 'True', x: 400, y: 40 }], frames: [], arrows: [] },
    ];
  }
  if (mode === 'keyword') {
    const code = 'def f(a, *args, b):\n    print(a, args, b)\n\nf(10, 20, 30, b=40)';
    const a: StarFrame = { id: 'a', label: 'a', x: 24, y: 150, w: 90, h: 52, kind: 'tuple' };
    const args: StarFrame = { id: 'args', label: 'args', x: 140, y: 150, w: 220, h: 52, kind: 'tuple' };
    const b: StarFrame = { id: 'b', label: 'b  关键字', x: 400, y: 150, w: 140, h: 52, kind: 'tuple' };
    const top = [10, 20, 30].map((value, index) => ({ id: `p${index}`, text: String(value), x: 80 + index * 80, y: 24 }));
    const key = { id: 'k', text: '40', x: 460, y: 24 };
    return [
      { code, line: 4, mark: 'f(10, 20, 30, b=40)', note: '10、20、30 走位置；40 写了名字。', output: '', chips: [...top, key], frames: [], arrows: [] },
      {
        code,
        line: 1,
        mark: '*args',
        note: '位置实参先给 a，剩下的进 args。b 在星号后面，只能从关键字过来。',
        output: '',
        chips: [
          { id: 'p0', text: '10', x: 48, y: 166 },
          { id: 'p1', text: '20', x: 180, y: 166 },
          { id: 'p2', text: '30', x: 270, y: 166 },
          { id: 'k', text: '40', x: 450, y: 166 },
        ],
        frames: [a, args, b],
        arrows: [
          { id: 'a', x1: 100, y1: 60, x2: 70, y2: 146 },
          { id: 'r1', x1: 180, y1: 60, x2: 210, y2: 146 },
          { id: 'r2', x1: 260, y1: 60, x2: 280, y2: 146 },
          { id: 'b', x1: 482, y1: 60, x2: 470, y2: 146 },
        ],
      },
      { code, line: 2, mark: 'print', note: 'b 没有占用位置实参。', output: '10 (20, 30) 40', chips: [
        { id: 'p0', text: '10', x: 48, y: 166 },
        { id: 'p1', text: '20', x: 180, y: 166 },
        { id: 'p2', text: '30', x: 270, y: 166 },
        { id: 'k', text: '40', x: 450, y: 166 },
      ], frames: [a, args, b], arrows: [] },
    ];
  }
  const code = 'def f(a, b, *args):\n    print(a)\n    print(b)\n    print(args)\n\nf(10, 20, 30, 40, 50)';
  const top = [10, 20, 30, 40, 50].map((value, index) => ({ id: `p${index}`, text: String(value), x: 40 + index * 110, y: 20 }));
  const a: StarFrame = { id: 'a', label: 'a', x: 30, y: 160, w: 90, h: 52, kind: 'tuple' };
  const b: StarFrame = { id: 'b', label: 'b', x: 140, y: 160, w: 90, h: 52, kind: 'tuple' };
  const args: StarFrame = { id: 'args', label: 'args', x: 270, y: 160, w: 320, h: 52, kind: 'tuple' };
  const bound = [
    { id: 'p0', text: '10', x: 52, y: 176 },
    { id: 'p1', text: '20', x: 164, y: 176 },
    { id: 'p2', text: '30', x: 300, y: 176 },
    { id: 'p3', text: '40', x: 390, y: 176 },
    { id: 'p4', text: '50', x: 480, y: 176 },
  ];
  return [
    { code, line: 6, mark: 'f(10, 20, 30, 40, 50)', note: '五个位置实参从左到右排队。', output: '', chips: top, frames: [], arrows: [] },
    {
      code,
      line: 1,
      mark: 'a, b, *args',
      note: '先填 a、b，剩下的才进 args。',
      output: '',
      chips: bound,
      frames: [a, b, args],
      arrows: top.map((chip, index) => ({
        id: `m${index}`,
        x1: chip.x + 22,
        y1: chip.y + 36,
        x2: bound[index]!.x + 22,
        y2: bound[index]!.y - 8,
      })),
    },
    { code, line: 4, mark: 'print(args)', note: 'args 是元组 (30, 40, 50)。', output: '10\n20\n(30, 40, 50)', chips: bound, frames: [a, b, args], arrows: [] },
  ];
}

function assignSteps(mode: StarControls['mode']): StarStep[] {
  const items = [10, 20, 30, 40, 50];
  const patterns = {
    head: { code: '*a, b, c = [10, 20, 30, 40, 50]\nprint(a, b, c)', mark: '*a', lists: [0, 1, 2], singles: { b: 3, c: 4 } },
    mid: { code: 'a, *b, c = [10, 20, 30, 40, 50]\nprint(a, b, c)', mark: '*b', lists: [1, 2, 3], singles: { a: 0, c: 4 } },
    tail: { code: 'a, b, *c = [10, 20, 30, 40, 50]\nprint(a, b, c)', mark: '*c', lists: [2, 3, 4], singles: { a: 0, b: 1 } },
  } as const;
  const pattern = mode === 'head' || mode === 'tail' ? patterns[mode] : patterns.mid;
  const source: StarFrame = { id: 'src', label: '[10, 20, 30, 40, 50]', x: 70, y: 12, w: 500, h: 52, kind: 'list' };
  const top = items.map((value, index) => ({ id: `e${index}`, text: String(value), x: 100 + index * 90, y: 26 }));
  const frames: StarFrame[] = [];
  const chips: StarChip[] = [];
  let cursor = 40;
  (['a', 'b', 'c'] as const).forEach((name) => {
    const single = pattern.singles[name as keyof typeof pattern.singles];
    if (single != null) {
      frames.push({ id: name, label: name, x: cursor, y: 150, w: 80, h: 52, kind: 'tuple' });
      chips.push({ id: `e${single}`, text: String(items[single]), x: cursor + 18, y: 166 });
      cursor += 100;
      return;
    }
    frames.push({ id: name, label: `${name}  list`, x: cursor, y: 150, w: 240, h: 52, kind: 'list', hot: true });
    pattern.lists.forEach((index, offset) => {
      chips.push({ id: `e${index}`, text: String(items[index]), x: cursor + 16 + offset * 70, y: 166 });
    });
    cursor += 260;
  });
  return [
    { code: pattern.code, line: 1, mark: '[10, 20, 30, 40, 50]', note: '', output: '', chips: top, frames: [source], arrows: [] },
    { code: pattern.code, line: 1, mark: pattern.mark, note: 'list', output: '', chips, frames, arrows: [] },
  ];
}

function nestSteps(): StarStep[] {
  const code = 'a = [1, 2, 3]\nb = [4, 5, 6]\n\nprint([a, b])\nprint([*a, *b])';
  const a: StarFrame = { id: 'a', label: 'a', x: 36, y: 48, w: 150, h: 48, kind: 'list' };
  const b: StarFrame = { id: 'b', label: 'b', x: 36, y: 120, w: 150, h: 48, kind: 'list' };
  const c: StarFrame = { id: 'c', label: 'c = [a, b]', x: 220, y: 36, w: 180, h: 150, kind: 'list' };
  const d: StarFrame = { id: 'd', label: 'd = [*a, *b]', x: 420, y: 36, w: 190, h: 150, kind: 'list', hot: true };
  const left = [1, 2, 3, 4, 5, 6].map((value, index) => ({
    id: `e${index}`,
    text: String(value),
    x: 52 + (index % 3) * 42,
    y: index < 3 ? 64 : 136,
  }));
  const born = left.map((chip, index) => ({ ...chip, id: `f${index}`, copy: true }));
  const flat = born.map((chip, index) => ({
    ...chip,
    x: 436 + (index % 3) * 52,
    y: index < 3 ? 78 : 124,
  }));
  return [
    { code, line: 4, mark: '[a, b]', note: '', output: '[[1, 2, 3], [4, 5, 6]]', chips: left, frames: [a, b, c], arrows: [] },
    { code, line: 5, mark: '*a', note: '', output: '', chips: [...left, ...born], frames: [a, b, c, { ...d, hot: true }], arrows: [] },
    { code, line: 5, mark: '*a', note: '', output: '[1, 2, 3, 4, 5, 6]', chips: [...left, ...flat], frames: [a, b, c, d], arrows: [] },
  ];
}

function kwPackSteps(count: number): StarStep[] {
  const pairs = [
    ['x', 10],
    ['y', 20],
    ['z', 30],
    ['w', 40],
  ].slice(0, count) as [string, number][];
  const call = pairs.length ? `f(${pairs.map(([key, value]) => `${key}=${value}`).join(', ')})` : 'f()';
  const code = `def f(**kwargs):\n    print(kwargs)\n\n${call}`;
  const shown = `{${pairs.map(([key, value]) => `'${key}': ${value}`).join(', ')}}`;
  const loose = pairs.map(([key, value], index) => ({ id: `k${index}`, text: `${key}=${value}`, x: 80 + index * 140, y: 28 }));
  const box: StarFrame = { id: 'kw', label: 'kwargs', x: 140, y: 160, w: 360, h: 70, kind: 'list', hot: true };
  const inside = pairs.map(([key, value], index) => ({ id: `k${index}`, text: `${key}=${value}`, x: 170 + index * 80, y: 186 }));
  return [
    { code, line: 4, mark: call, note: '', output: '', chips: loose, frames: [], arrows: [] },
    { code, line: 1, mark: '**kwargs', note: count ? '' : '{}', output: '', chips: inside, frames: [box], arrows: [] },
    { code, line: 2, mark: 'print', note: '', output: count ? shown : '{}', chips: inside, frames: [box], arrows: [] },
  ];
}

function kwUnpackSteps(mode: StarControls['mode']): StarStep[] {
  if (mode === 'whole') {
    const code = 'data = {"x": 10, "y": 20}\n\nprint(*data)';
    return [
      { code, line: 1, mark: 'data', note: '', output: '', chips: [{ id: 'x', text: 'x', x: 220, y: 40 }, { id: 'y', text: 'y', x: 340, y: 40 }], frames: [{ id: 'd', label: 'data', x: 180, y: 24, w: 240, h: 64, kind: 'list' }], arrows: [] },
      { code, line: 3, mark: '*data', note: '键', output: 'x y', chips: [{ id: 'x', text: 'x', x: 180, y: 150 }, { id: 'y', text: 'y', x: 300, y: 150 }], frames: [{ id: 'd', label: 'data', x: 180, y: 24, w: 240, h: 64, kind: 'list' }], arrows: [] },
    ];
  }
  if (mode === 'bad') {
    const code = 'def f(a, b):\n    print(a, b)\n\nf(**{"a": 10}, **{"a": 20})';
    return [
      { code, line: 4, mark: '**{"a": 20}', note: '', output: '', error: "TypeError: f() got multiple values for keyword argument 'a'", chips: [{ id: 'a', text: 'a=10', x: 160, y: 40 }, { id: 'b', text: 'a=20', x: 360, y: 40 }], frames: [], arrows: [] },
    ];
  }
  const code = 'def f(a, b):\n    print(a, b)\n\ndata = {"b": 20, "a": 10}\nf(**data)';
  const dict: StarFrame = { id: 'data', label: 'data', x: 160, y: 16, w: 300, h: 64, kind: 'list' };
  const held = [{ id: 'sb', text: 'b=20', x: 190, y: 36 }, { id: 'sa', text: 'a=10', x: 340, y: 36 }];
  const born = held.map((chip) => ({ ...chip, id: chip.id.slice(1), copy: true }));
  const bound = [
    { id: 'a', text: 'a=10', x: 80, y: 180, copy: true },
    { id: 'b', text: 'b=20', x: 280, y: 180, copy: true },
  ];
  return [
    { code, line: 4, mark: 'data', note: '', output: '', chips: held, frames: [dict], arrows: [] },
    { code, line: 5, mark: '**data', note: '', output: '', chips: [...held, ...born], frames: [{ ...dict, hot: true }], arrows: [] },
    { code, line: 1, mark: 'a, b', note: '按名字', output: '10 20', chips: [...held, ...bound], frames: [dict, { id: 'a', label: 'a', x: 60, y: 164, w: 120, h: 56, kind: 'tuple' }, { id: 'b', label: 'b', x: 250, y: 164, w: 120, h: 56, kind: 'tuple' }], arrows: [] },
  ];
}

const BENCH = [
  { call: 'f(10)', out: '10 0 () 100 {}', error: '' },
  { call: 'f(10, 20)', out: '10 20 () 100 {}', error: '' },
  { call: 'f(10, 20, 30, 40)', out: '10 20 (30, 40) 100 {}', error: '' },
  { call: 'f(10, 20, 30, c=50)', out: '10 20 (30,) 50 {}', error: '' },
  { call: 'f(10, 20, 30, c=50, x=60)', out: '10 20 (30,) 50 {\'x\': 60}', error: '' },
  { call: 'f()', out: '', error: "TypeError: f() missing 1 required positional argument: 'a'" },
  { call: 'f(10, a=20)', out: '', error: "TypeError: f() got multiple values for argument 'a'" },
  { call: 'f(10, 20, b=30)', out: '', error: "TypeError: f() got multiple values for argument 'b'" },
];

function benchSteps(index: number): StarStep[] {
  const item = BENCH[Math.min(index, BENCH.length - 1)]!;
  const code = `def f(a, b=0, *args, c=100, **kwargs):\n    print(a, b, args, c, kwargs)\n\n${item.call}`;
  const slots: StarFrame[] = [
    { id: 'a', label: 'a', x: 16, y: 150, w: 90, h: 52, kind: 'tuple' },
    { id: 'b', label: 'b', x: 116, y: 150, w: 90, h: 52, kind: 'tuple' },
    { id: 'args', label: 'args', x: 216, y: 150, w: 150, h: 52, kind: 'tuple' },
    { id: 'c', label: 'c', x: 376, y: 150, w: 90, h: 52, kind: 'tuple' },
    { id: 'kw', label: 'kwargs', x: 476, y: 150, w: 140, h: 52, kind: 'list' },
  ];
  const texts = item.out ? item.out.split(' ') : [];
  const chips: StarChip[] = texts.map((text, at) => ({ id: `s${at}`, text, x: slots[Math.min(at, 4)]!.x + 8, y: 166 }));
  return [
    { code, line: 4, mark: item.call, note: '', output: '', error: item.error || undefined, chips: [], frames: [], arrows: [] },
    { code, line: item.error ? 4 : 2, mark: item.error ? item.call : 'print', note: '教学模型，不是解释器内部步骤', output: item.out, error: item.error || undefined, chips, frames: item.error ? [] : slots, arrows: [] },
  ];
}

function forwardSteps(): StarStep[] {
  const code = 'def show(*args, **kwargs):\n    print(*args, **kwargs)\n\nshow("Python", "AI", sep=" | ", end="!")';
  const args: StarFrame = { id: 'args', label: 'args', x: 24, y: 80, w: 260, h: 56, kind: 'tuple' };
  const kw: StarFrame = { id: 'kw', label: 'kwargs', x: 320, y: 80, w: 280, h: 56, kind: 'list' };
  const pos = [{ id: 'p', text: 'Python', x: 40, y: 96 }, { id: 'a', text: 'AI', x: 160, y: 96 }];
  const keys = [{ id: 's', text: 'sep= | ', x: 340, y: 96 }, { id: 'e', text: 'end=!', x: 470, y: 96 }];
  return [
    { code, line: 4, mark: 'show', note: '', output: '', chips: [...pos, ...keys].map((chip) => ({ ...chip, y: 24 })), frames: [], arrows: [] },
    { code, line: 1, mark: '*args', note: '', output: '', chips: [...pos, ...keys], frames: [args, kw], arrows: [] },
    { code, line: 2, mark: '*args', note: '', output: 'Python | AI!', chips: [...pos.map((chip) => ({ ...chip, y: 190 })), ...keys.map((chip) => ({ ...chip, y: 190 }))], frames: [], arrows: [] },
  ];
}

function iterSteps(mode: StarControls['mode']): StarStep[] {
  const cases: Record<string, { code: string; out: string; error?: string; chips: string[] }> = {
    str: { code: 'print(*"ABC")', out: 'A B C', chips: ['A', 'B', 'C'] },
    tuple: { code: 'print(*(1, 2, 3))', out: '1 2 3', chips: ['1', '2', '3'] },
    range: { code: 'print(*range(3))', out: '0 1 2', chips: ['0', '1', '2'] },
    dictstar: { code: 'print(*{"x": 10, "y": 20})', out: 'x y', chips: ['x', 'y'] },
    bad: { code: 'print(*123)', out: '', error: "TypeError: Value after * must be an iterable, not int", chips: [] },
    echo: { code: 'a = [10, 20]\nb = [30, 40]\nprint(*a, *b)', out: '10 20 30 40', chips: ['10', '20', '30', '40'] },
  };
  const item = cases[mode] ?? cases.str!;
  const loose = item.chips.map((text, index) => ({ id: `i${index}`, text, x: 80 + index * 90, y: 40 }));
  const out = item.chips.map((text, index) => ({ id: `i${index}`, text, x: 80 + index * 90, y: 160 }));
  return [
    { code: item.code, line: 1, mark: '*', note: '', output: '', chips: loose, frames: [], arrows: [] },
    { code: item.code, line: item.code.split('\n').length, mark: 'print', note: '', output: item.out, error: item.error, chips: out, frames: [], arrows: [] },
  ];
}

function dictMergeSteps(mode: StarControls['mode']): StarStep[] {
  if (mode === 'bad') {
    const code = 'def f(x):\n    print(x)\n\na = {"x": 10}\nb = {"x": 20}\nf(**a, **b)';
    return [
      { code, line: 6, mark: '**b', note: '', output: '', error: "TypeError: f() got multiple values for keyword argument 'x'", chips: [{ id: 'a', text: 'x=10', x: 160, y: 40 }, { id: 'b', text: 'x=20', x: 360, y: 40 }], frames: [], arrows: [] },
    ];
  }
  const code = 'a = {"color": "blue", "size": 16}\nb = {"size": 20, "bold": True}\n\nprint({**a, **b})';
  const left = [{ id: 'c1', text: 'color=blue', x: 30, y: 36 }, { id: 's1', text: 'size=16', x: 30, y: 90 }];
  const right = [{ id: 's2', text: 'size=20', x: 220, y: 36 }, { id: 'd', text: 'bold=True', x: 220, y: 90 }];
  const merged = [
    { id: 'c1', text: 'color=blue', x: 400, y: 36 },
    { id: 's1', text: 'size=16', x: 400, y: 100 },
    { id: 's2', text: 'size=20', x: 400, y: 100 },
    { id: 'd', text: 'bold=True', x: 400, y: 160 },
  ];
  return [
    { code, line: 1, mark: 'a', note: '', output: '', chips: [...left, ...right], frames: [{ id: 'a', label: 'a', x: 16, y: 20, w: 180, h: 120, kind: 'list' }, { id: 'b', label: 'b', x: 206, y: 20, w: 170, h: 120, kind: 'list' }], arrows: [] },
    { code, line: 4, mark: '**b', note: '后写的 size 覆盖先写的', output: "{'color': 'blue', 'size': 20, 'bold': True}", chips: merged.filter((chip) => chip.id !== 's1'), frames: [{ id: 'c', label: 'c', x: 370, y: 20, w: 240, h: 200, kind: 'list', hot: true }], arrows: [] },
  ];
}

export function packCounts(): number[] {
  return PACK_COUNTS;
}

export function buildStarSteps(kind: StarKind, controls: StarControls): StarStep[] {
  if (kind === 'pack') return packSteps(controls.count);
  if (kind === 'unpack' && ['str', 'tuple', 'range', 'dictstar', 'bad'].includes(controls.mode)) return iterSteps(controls.mode);
  if (kind === 'unpack') return unpackSteps(controls.mode);
  if (kind === 'compare') return controls.mode === 'keyword' ? bothSteps() : compareSteps();
  if (kind === 'both') return bothSteps();
  if (kind === 'kwargs') return kwPackSteps(controls.count);
  if (kind === 'kwunpack') return kwUnpackSteps(controls.mode);
  if (kind === 'mixed') return mixedSteps(controls.mode);
  if (kind === 'bench') return benchSteps(controls.count);
  if (kind === 'forward') return forwardSteps();
  if (kind === 'assign') return assignSteps(controls.mode);
  if (kind === 'nest') return nestSteps();
  if (kind === 'dictmerge') return dictMergeSteps(controls.mode);
  return [];
}

export interface StarQuizItem {
  id: string;
  code: string;
  options: { id: string; label: string }[];
  answer: string;
  why: string;
  gap: string;
  steps: StarStep[];
}

export function starExtQuiz(): StarQuizItem[] {
  return [
    {
      id: 'e1',
      code: 'a, *b = [10]\nprint(b)',
      options: [{ id: 't', label: '()' }, { id: 'l', label: '[]' }, { id: 'e', label: '报错' }],
      answer: 'l',
      why: '赋值左边的星号收成列表。没有剩余元素时是 []。',
      gap: '赋值收集得到列表。',
      steps: assignSteps('head').slice(0, 1),
    },
    {
      id: 'e2',
      code: 'c = [a, b]\nd = [*a, *b]',
      options: [{ id: 'nest', label: '两个列表' }, { id: 'flat', label: '一层元素' }, { id: 'same', label: '一样' }],
      answer: 'flat',
      why: 'd 问的是展开之后。c 仍是两个列表。',
      gap: '容器构造里的星号展开元素。',
      steps: nestSteps(),
    },
    {
      id: 'e3',
      code: '{**a, **b} 与 f(**a, **b)',
      options: [{ id: 'cover', label: '字典覆盖，调用报错' }, { id: 'both', label: '两边都覆盖' }, { id: 'err', label: '两边都报错' }],
      answer: 'cover',
      why: '字典构造允许后写的键覆盖。函数调用不能重复提供同一个关键字。',
      gap: '同一符号在调用和字典构造里规则不同。',
      steps: dictMergeSteps('spread'),
    },
  ];
}

export function starQuiz(): StarQuizItem[] {
  return [
    {
      id: 'q1',
      code: 'def f(*args):\n    print(args)\n\nf([1, 2, 3])',
      options: [{ id: 'flat', label: '(1, 2, 3)' }, { id: 'nest', label: '([1, 2, 3],)' }, { id: 'list', label: '[1, 2, 3]' }],
      answer: 'nest',
      why: '没有星号。整个列表是一个位置实参。',
      gap: '调用时没有星号，列表不会被拆开。',
      steps: [
        { code: 'f([1, 2, 3])', line: 1, mark: '[1, 2, 3]', note: '一个列表，一个位置实参。', output: '', chips: [{ id: 'box', text: '[1, 2, 3]', x: 250, y: 30 }], frames: [], arrows: [] },
        { code: 'args = ([1, 2, 3],)', line: 1, mark: 'args', note: '元组长度为 1。', output: '1', chips: [{ id: 'box', text: '[1, 2, 3]', x: 270, y: 80 }], frames: [{ id: 'args', label: 'args tuple', x: 200, y: 64, w: 240, h: 64, kind: 'tuple' }], arrows: [] },
      ],
    },
    {
      id: 'q2',
      code: 'def f(*args):\n    print(args)\n\nf(*[1, 2, 3])',
      options: [{ id: 'flat', label: '(1, 2, 3)' }, { id: 'nest', label: '([1, 2, 3],)' }, { id: 'list', label: '[1, 2, 3]' }],
      answer: 'flat',
      why: '先拆成三个位置实参，再收成元组。',
      gap: '调用处的星号和解包后的再次打包。',
      steps: bothSteps(),
    },
    {
      id: 'q3',
      code: 'def f(a, *args, b):\n    print(a, args, b)\n\nf(1, 2, 3)',
      options: [{ id: 'ok', label: '1 (2,) 3' }, { id: 'none', label: '1 (2, 3) None' }, { id: 'err', label: 'TypeError' }],
      answer: 'err',
      why: 'b 在星号后面，不能靠位置传入。',
      gap: '星号后面的形参必须写名字。',
      steps: mixedSteps('keyword').slice(0, 1),
    },
    {
      id: 'q4',
      code: 'def f(**kwargs):\n    print(kwargs)\n\nf(x=10, y=20)',
      options: [{ id: 'dict', label: "{'x': 10, 'y': 20}" }, { id: 'tuple', label: '(10, 20)' }, { id: 'err', label: 'TypeError' }],
      answer: 'dict',
      why: '**kwargs 收成字典。',
      gap: '关键字参数收成字典，不是元组。',
      steps: kwPackSteps(2),
    },
    {
      id: 'q5',
      code: 'def f(a, b):\n    print(a, b)\n\nf(**{"b": 20, "a": 10})',
      options: [{ id: 'ba', label: '20 10' }, { id: 'ab', label: '10 20' }, { id: 'err', label: 'TypeError' }],
      answer: 'ab',
      why: '按名字绑定，不按字典里的书写顺序。',
      gap: '双星号按名字配对。',
      steps: kwUnpackSteps('spread'),
    },
    {
      id: 'q6',
      code: 'nums = [10, 20]\nf(nums)',
      options: [{ id: 'star', label: 'f(*nums)' }, { id: 'kw', label: 'f(**nums)' }, { id: 'comma', label: 'f(nums,)' }],
      answer: 'star',
      why: '列表要拆成两个位置实参。',
      gap: '一个列表和一个位置实参不是一回事。',
      steps: [
        { code: 'def f(a, b):\n    print(a, b)\n\nf(*[1, 2, 3])', line: 4, mark: '*[1, 2, 3]', note: '', output: '', chips: row([1, 2, 3], 36, 'n'), frames: [], arrows: [] },
        {
          code: 'def f(a, b):\n    print(a, b)\n\nf(*[1, 2, 3])',
          line: 1,
          mark: 'a, b',
          note: '',
          output: '',
          error: 'TypeError: f() takes 2 positional arguments but 3 were given',
          chips: [
            { id: 'n0', text: '1', x: 80, y: 150 },
            { id: 'n1', text: '2', x: 220, y: 150 },
            { id: 'n2', text: '3', x: 420, y: 150 },
          ],
          frames: [
            { id: 'a', label: 'a', x: 60, y: 136, w: 90, h: 52, kind: 'tuple' },
            { id: 'b', label: 'b', x: 200, y: 136, w: 90, h: 52, kind: 'tuple' },
          ],
          arrows: [],
        },
      ],
    },
  ];
}
