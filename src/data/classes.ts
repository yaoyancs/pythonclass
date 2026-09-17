/** 教学班 id（动态生成，兼容旧版 monday/tuesday） */
export type ClassId = string;

export interface TeachingClass {
  id: ClassId;
  name: string;
  /** 备注，如上课日 */
  note?: string;
  createdAt: string;
}

export function createClassId(): ClassId {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `class_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `class_${Date.now().toString(36)}`;
}
