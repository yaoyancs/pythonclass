import type { ClassId, TeachingClass } from '../../data/classes';
import { Button } from '../ui/Button';

interface ClassSwitcherProps {
  classes: TeachingClass[];
  value: ClassId;
  onChange: (id: ClassId) => void;
  counts?: Record<string, number>;
}

export function ClassSwitcher({ classes, value, onChange, counts }: ClassSwitcherProps) {
  if (!classes.length) {
    return (
      <p className="text-sm text-highlight mb-4">尚未创建教学班，请先在「班级名单」中添加。</p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-text-secondary mr-1">当前教学班</span>
      {classes.map((c) => {
        const active = c.id === value;
        const n = counts?.[c.id];
        return (
          <Button
            key={c.id}
            type="button"
            size="md"
            variant={active ? 'primary' : 'secondary'}
            onClick={() => onChange(c.id)}
          >
            {c.name}
            {typeof n === 'number' ? `（${n}）` : ''}
          </Button>
        );
      })}
    </div>
  );
}
