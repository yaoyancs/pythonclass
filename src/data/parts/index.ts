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
import { scenes as variables } from "./variables/scenes";
import { scenes as typeWhy } from "./type-why/scenes";
import { scenes as typeInspect } from "./type-inspect/scenes";
import { scenes as numbersIntFloat } from "./numbers-int-float/scenes";
import { scenes as strings } from "./strings/scenes";
import { scenes as fString } from "./f-string/scenes";
import { scenes as typeCast } from "./type-cast/scenes";
import { scenes as boolCompare } from "./bool-compare/scenes";
import { scenes as campusLife02 } from "./campus-life-02/scenes";
import { scenes as conclusionHomework } from "./conclusion-homework/scenes";
import { scenes as wasteAsk } from "./waste-ask/scenes";
import { scenes as wasteBranch } from "./waste-branch/scenes";
import { scenes as wasteDual } from "./waste-dual/scenes";
import { scenes as wasteElif } from "./waste-elif/scenes";
import { scenes as weatherBool } from "./weather-bool/scenes";
import { scenes as weatherNest } from "./weather-nest/scenes";
import { scenes as wasteTernary } from "./waste-ternary/scenes";
import { scenes as lesson03Close } from "./lesson03-close/scenes";
import { scenes as vendOpen } from "./vend-open/scenes";
import { scenes as vendBool } from "./vend-bool/scenes";
import { scenes as vendIf } from "./vend-if/scenes";
import { scenes as vendDual } from "./vend-dual/scenes";
import { scenes as vendElif } from "./vend-elif/scenes";
import { scenes as vendNest } from "./vend-nest/scenes";
import { scenes as vendTernary } from "./vend-ternary/scenes";
import { scenes as vendCave } from "./vend-cave/scenes";
import { scenes as vendClose } from "./vend-close/scenes";
import { scenes as loopWhy } from "./loop-why/scenes";
import { scenes as loopWhile } from "./loop-while/scenes";
import { scenes as loopFor } from "./loop-for/scenes";
import { scenes as loopAcc } from "./loop-acc/scenes";
import { scenes as loopJump } from "./loop-jump/scenes";
import { scenes as loopNest } from "./loop-nest/scenes";
import { scenes as loopDrill } from "./loop-drill/scenes";
import { scenes as loopWrap } from "./loop-wrap/scenes";
import { scenes as lesson04Close } from "./lesson04-close/scenes";
import { scenes as listQueue } from "./list-queue/scenes";

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
  variables: { id: "variables", scenes: variables },
  "type-why": { id: "type-why", scenes: typeWhy },
  "type-inspect": { id: "type-inspect", scenes: typeInspect },
  "numbers-int-float": { id: "numbers-int-float", scenes: numbersIntFloat },
  strings: { id: "strings", scenes: strings },
  "f-string": { id: "f-string", scenes: fString },
  "type-cast": { id: "type-cast", scenes: typeCast },
  "bool-compare": { id: "bool-compare", scenes: boolCompare },
  "campus-life-02": { id: "campus-life-02", scenes: campusLife02 },
  "conclusion-homework": { id: "conclusion-homework", scenes: conclusionHomework },
  "waste-ask": { id: "waste-ask", scenes: wasteAsk },
  "waste-branch": { id: "waste-branch", scenes: wasteBranch },
  "waste-dual": { id: "waste-dual", scenes: wasteDual },
  "waste-elif": { id: "waste-elif", scenes: wasteElif },
  "weather-bool": { id: "weather-bool", scenes: weatherBool },
  "weather-nest": { id: "weather-nest", scenes: weatherNest },
  "waste-ternary": { id: "waste-ternary", scenes: wasteTernary },
  "lesson03-close": { id: "lesson03-close", scenes: lesson03Close },
  "vend-open": { id: "vend-open", scenes: vendOpen },
  "vend-bool": { id: "vend-bool", scenes: vendBool },
  "vend-if": { id: "vend-if", scenes: vendIf },
  "vend-dual": { id: "vend-dual", scenes: vendDual },
  "vend-elif": { id: "vend-elif", scenes: vendElif },
  "vend-nest": { id: "vend-nest", scenes: vendNest },
  "vend-ternary": { id: "vend-ternary", scenes: vendTernary },
  "vend-cave": { id: "vend-cave", scenes: vendCave },
  "vend-close": { id: "vend-close", scenes: vendClose },
  "loop-why": { id: "loop-why", scenes: loopWhy },
  "loop-while": { id: "loop-while", scenes: loopWhile },
  "loop-for": { id: "loop-for", scenes: loopFor },
  "loop-acc": { id: "loop-acc", scenes: loopAcc },
  "loop-jump": { id: "loop-jump", scenes: loopJump },
  "loop-nest": { id: "loop-nest", scenes: loopNest },
  "loop-drill": { id: "loop-drill", scenes: loopDrill },
  "loop-wrap": { id: "loop-wrap", scenes: loopWrap },
  "lesson04-close": { id: "lesson04-close", scenes: lesson04Close },
  "list-queue": { id: "list-queue", scenes: listQueue },
};

export function getPart(ref: string): ContentPart {
  const part = PARTS[ref];
  if (!part) {
    throw new Error(`Unknown content part ref: ${ref}`);
  }
  return part;
}
