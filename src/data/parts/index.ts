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
import { scenes as typeWhy } from "./type-why/scenes";
import { scenes as typeInspect } from "./type-inspect/scenes";
import { scenes as numbersIntFloat } from "./numbers-int-float/scenes";
import { scenes as strings } from "./strings/scenes";
import { scenes as typeCast } from "./type-cast/scenes";
import { scenes as boolCompare } from "./bool-compare/scenes";
import { scenes as campusLife02 } from "./campus-life-02/scenes";
import { scenes as conclusionHomework } from "./conclusion-homework/scenes";

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
  "type-why": { id: "type-why", scenes: typeWhy },
  "type-inspect": { id: "type-inspect", scenes: typeInspect },
  "numbers-int-float": { id: "numbers-int-float", scenes: numbersIntFloat },
  strings: { id: "strings", scenes: strings },
  "type-cast": { id: "type-cast", scenes: typeCast },
  "bool-compare": { id: "bool-compare", scenes: boolCompare },
  "campus-life-02": { id: "campus-life-02", scenes: campusLife02 },
  "conclusion-homework": { id: "conclusion-homework", scenes: conclusionHomework },
};

export function getPart(ref: string): ContentPart {
  const part = PARTS[ref];
  if (!part) {
    throw new Error(`Unknown content part ref: ${ref}`);
  }
  return part;
}
