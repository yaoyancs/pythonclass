import { describe, expect, it } from 'vitest';
import { parseRosterCsv } from '../utils/csv';

describe('parseRosterCsv', () => {
  it('parses Chinese headers', () => {
    const text = '学号,姓名\n20240001,张三\n20240002,李四\n';
    const students = parseRosterCsv(text);
    expect(students).toEqual([
      { id: '20240001', name: '张三', studentNo: '20240001' },
      { id: '20240002', name: '李四', studentNo: '20240002' },
    ]);
  });

  it('parses name-only column', () => {
    const text = '姓名\n王五\n';
    expect(parseRosterCsv(text)).toEqual([{ id: 'name-王五-1', name: '王五' }]);
  });

  it('handles BOM and Chinese comma', () => {
    const text = '\uFEFF学号，姓名\n001，赵六\n';
    expect(parseRosterCsv(text)[0]).toMatchObject({ name: '赵六', studentNo: '001' });
  });
});
