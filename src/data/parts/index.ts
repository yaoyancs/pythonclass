import type { ContentPart } from "../../types/scene";
import { scenes as coursePrelude } from "./course-prelude/scenes";
import { scenes as aiWhyLearn } from "./ai-why-learn/scenes";
import { scenes as languageHistory } from "./language-history/scenes";
import { scenes as pythonHistory } from "./python-history/scenes";
import { scenes as whyPython } from "./why-python/scenes";
import { scenes as pythonRuntime } from "./python-runtime/scenes";
import { scenes as executePython } from "./execute-python/scenes";
import { scenes as firstProgram } from "./first-program/scenes";
import { scenes as campusLife01 } from "./campus-life-01/scenes";
import { scenes as wrapUp } from "./wrap-up/scenes";

/** 全课知识块仓库：开课表通过 ref 引用 */
export const PARTS: Record<string, ContentPart> = {
  "course-prelude": { id: "course-prelude", scenes: coursePrelude },
  "ai-why-learn": { id: "ai-why-learn", scenes: aiWhyLearn },
  "language-history": { id: "language-history", scenes: languageHistory },
  "python-history": { id: "python-history", scenes: pythonHistory },
  "why-python": { id: "why-python", scenes: whyPython },
  "python-runtime": { id: "python-runtime", scenes: pythonRuntime },
  "execute-python": { id: "execute-python", scenes: executePython },
  "first-program": { id: "first-program", scenes: firstProgram },
  "campus-life-01": { id: "campus-life-01", scenes: campusLife01 },
  "wrap-up": { id: "wrap-up", scenes: wrapUp },
};

export function getPart(ref: string): ContentPart {
  const part = PARTS[ref];
  if (!part) {
    throw new Error(`Unknown content part ref: ${ref}`);
  }
  return part;
}
