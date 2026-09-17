import type { Student } from '../types/roster';

const TEMPLATE =
  '学号,姓名\n20240001,张三\n20240002,李四\n# 每个教学班各上传一份名单，班级之间互相独立\n';

/** 简单 CSV 行拆分：支持双引号字段 */
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',' || ch === '，') {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur.trim());
  return cells;
}

function normalizeHeader(h: string): string {
  return h.replace(/^\uFEFF/, '').trim().toLowerCase();
}

function isNameHeader(h: string): boolean {
  const n = normalizeHeader(h);
  return n === '姓名' || n === 'name' || n === '学生姓名';
}

function isNoHeader(h: string): boolean {
  const n = normalizeHeader(h);
  return n === '学号' || n === 'studentno' || n === 'student_no' || n === 'id' || n === '编号';
}

export function parseRosterCsv(text: string): Student[] {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));

  if (lines.length === 0) return [];

  const first = splitCsvLine(lines[0]!);
  let start = 0;
  let nameIdx = 0;
  let noIdx = -1;

  const hasHeader = first.some((c) => isNameHeader(c) || isNoHeader(c));
  if (hasHeader) {
    nameIdx = first.findIndex(isNameHeader);
    noIdx = first.findIndex(isNoHeader);
    if (nameIdx < 0) nameIdx = noIdx === 0 ? 1 : 0;
    start = 1;
  } else if (first.length >= 2) {
    noIdx = 0;
    nameIdx = 1;
  }

  const students: Student[] = [];
  const seen = new Set<string>();

  for (let i = start; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]!);
    const name = (cells[nameIdx] ?? '').trim();
    if (!name) continue;
    const studentNo = noIdx >= 0 ? (cells[noIdx] ?? '').trim() : '';
    const id = studentNo || `name-${name}-${i}`;
    if (seen.has(id)) continue;
    seen.add(id);
    students.push({
      id,
      name,
      ...(studentNo ? { studentNo } : {}),
    });
  }

  return students;
}

export function downloadRosterTemplate(): void {
  const blob = new Blob([TEMPLATE], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '学生名单模板.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
