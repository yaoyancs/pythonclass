import { useRef, useState } from 'react';
import type { ClassId, TeachingClass } from '../../data/classes';
import type { Student } from '../../types/roster';
import { downloadRosterTemplate, parseRosterCsv } from '../../utils/csv';
import { getClassLabel, loadRosters } from '../../utils/rosterStorage';
import { Button } from '../ui/Button';
import { TeacherPanel } from './TeacherPanel';

interface RosterManagePanelProps {
  classes: TeachingClass[];
  onReplace: (classId: ClassId, students: Student[], source?: 'local' | 'static') => void;
  onCreateClass: (name: string, note?: string) => void;
  onRenameClass: (id: ClassId, name: string, note?: string) => void;
  onDeleteClass: (id: ClassId) => void;
  onClose: () => void;
}

export function RosterManagePanel({
  classes,
  onReplace,
  onCreateClass,
  onRenameClass,
  onDeleteClass,
  onClose,
}: RosterManagePanelProps) {
  const [tick, setTick] = useState(0);
  const [newName, setNewName] = useState('');
  const [newNote, setNewNote] = useState('');
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const store = loadRosters();
  void tick;

  const handleFile = async (classId: ClassId, file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const students = parseRosterCsv(text);
    if (!students.length) {
      window.alert('未解析到有效学生，请检查 CSV（学号,姓名）。');
      return;
    }
    const current = store.classes[classId]?.students.length ?? 0;
    const label = getClassLabel(classId);
    if (current > 0 && !window.confirm(`将用 ${students.length} 人覆盖「${label}」名单，确定？`)) {
      return;
    }
    onReplace(classId, students, 'local');
    setTick((t) => t + 1);
  };

  const handleAdd = () => {
    try {
      onCreateClass(newName, newNote);
      setNewName('');
      setNewNote('');
      setTick((t) => t + 1);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '创建失败');
    }
  };

  const handleRename = (c: TeachingClass) => {
    const name = window.prompt('班级名称', c.name);
    if (name == null) return;
    const note = window.prompt('备注（如上课日，可留空）', c.note ?? '') ?? '';
    try {
      onRenameClass(c.id, name, note);
      setTick((t) => t + 1);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '重命名失败');
    }
  };

  const handleDelete = (c: TeachingClass) => {
    const ok = window.confirm(
      `确定删除「${c.name}」？\n将同时删除该班名单、全部考勤记录与学期小红花，且不可恢复。`,
    );
    if (!ok) return;
    onDeleteClass(c.id);
    setTick((t) => t + 1);
  };

  return (
    <TeacherPanel title="班级名单管理" onClose={onClose} wide initialHeight={640}>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        可自由增加或删除教学班。每个班的名单、考勤与提问/互动记录互相独立；删除班级会清空该班全部统计。
      </p>

      <div className="rounded-2xl border border-classroom-border bg-accent-muted/40 px-4 py-4 mb-5">
        <p className="text-sm text-text-secondary mb-2">新增教学班</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="班级名称，如 大数据3班"
            className="flex-1 min-w-[12rem] rounded-full border border-classroom-border bg-white px-4 py-2 text-base"
          />
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="备注（可选）"
            className="w-36 rounded-full border border-classroom-border bg-white px-4 py-2 text-base"
          />
          <Button variant="primary" size="md" type="button" onClick={handleAdd}>
            添加班级
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Button variant="ghost" size="md" type="button" onClick={() => downloadRosterTemplate()}>
          下载名单模板
        </Button>
      </div>

      {classes.length === 0 ? (
        <p className="text-text-secondary">还没有教学班，请先添加。</p>
      ) : (
        <ul className="space-y-4">
          {classes.map((c) => {
            const roster = store.classes[c.id];
            const count = roster?.students.length ?? 0;
            return (
              <li
                key={c.id}
                className="rounded-2xl border border-classroom-border bg-classroom-playground/40 px-5 py-4"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="title-kai text-xl">{c.name}</h3>
                  {c.note && (
                    <span className="text-sm text-text-secondary">{c.note}</span>
                  )}
                  <span className="text-sm text-accent ml-auto">
                    {count > 0 ? `${count} 人` : '尚未导入名单'}
                  </span>
                </div>
                {roster?.updatedAt && (
                  <p className="text-xs text-text-secondary mt-1">
                    名单更新于 {new Date(roster.updatedAt).toLocaleString('zh-CN')}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    type="button"
                    onClick={() => fileRefs.current[c.id]?.click()}
                  >
                    上传本班 CSV
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    type="button"
                    onClick={() => handleRename(c)}
                  >
                    重命名
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    type="button"
                    onClick={() => handleDelete(c)}
                  >
                    删除班级
                  </Button>
                  <input
                    ref={(el) => {
                      fileRefs.current[c.id] = el;
                    }}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      void handleFile(c.id, e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </TeacherPanel>
  );
}
