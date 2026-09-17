import type { ContentPart } from '../../types/scene';
import { scenes as coursePrelude } from './course-prelude/scenes';
import { scenes as aiWhyLearn } from './ai-why-learn/scenes';
import { scenes as languageHistory } from './language-history/scenes';
import { scenes as whyPython } from './why-python/scenes';
import { scenes as pythonRuntime } from './python-runtime/scenes';
import { scenes as executePython } from './execute-python/scenes';

/** 全课知识块仓库：开课表通过 ref 引用 */
export const PARTS: Record<string, ContentPart> = {
  'course-prelude': { id: 'course-prelude', scenes: coursePrelude },
  'ai-why-learn': { id: 'ai-why-learn', scenes: aiWhyLearn },
  'language-history': { id: 'language-history', scenes: languageHistory },
  'why-python': { id: 'why-python', scenes: whyPython },
  'python-runtime': { id: 'python-runtime', scenes: pythonRuntime },
  'execute-python': { id: 'execute-python', scenes: executePython },
};

export function getPart(ref: string): ContentPart {
  const part = PARTS[ref];
  if (!part) {
    throw new Error(`Unknown content part ref: ${ref}`);
  }
  return part;
}
