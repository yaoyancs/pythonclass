import type { ContentPart } from "../../types/scene";
import { videoEvolutionByPart } from "../videoEvolution";
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
import { scenes as playlistWhy } from "./playlist-why/scenes";
import { scenes as playlistIndex } from "./playlist-index/scenes";
import { scenes as playlistEdit } from "./playlist-edit/scenes";
import { scenes as playlistWalk } from "./playlist-walk/scenes";
import { scenes as playlistManager } from "./playlist-manager/scenes";
import { scenes as playlistUpgrade } from "./playlist-upgrade/scenes";
import { scenes as tupleCard } from "./tuple-card/scenes";
import { scenes as tupleWhy } from "./tuple-why/scenes";
import { scenes as tupleDefine } from "./tuple-define/scenes";
import { scenes as tupleOps } from "./tuple-ops/scenes";
import { scenes as tupleLimit } from "./tuple-limit/scenes";
import { scenes as tupleWalk } from "./tuple-walk/scenes";
import { scenes as setWhy } from "./set-why/scenes";
import { scenes as setDefine } from "./set-define/scenes";
import { scenes as setEdit } from "./set-edit/scenes";
import { scenes as setOps } from "./set-ops/scenes";
import { scenes as setWalk } from "./set-walk/scenes";
import { scenes as dictWhy } from "./dict-why/scenes";
import { scenes as dictUse } from "./dict-use/scenes";
import { scenes as dictWalk } from "./dict-walk/scenes";
import { scenes as fnWhy } from "./fn-why/scenes";
import { scenes as fnDef } from "./fn-def/scenes";
import { scenes as fnParam } from "./fn-param/scenes";
import { scenes as fnReturn } from "./fn-return/scenes";
import { scenes as fnCall } from "./fn-call/scenes";
import { scenes as fnClose } from "./fn-close/scenes";
import { scenes as fnExt } from "./fn-ext/scenes";
import { scenes as fnVarargs } from "./fn-varargs/scenes";
import { scenes as fnUnpack } from "./fn-unpack/scenes";
import { scenes as fnFnarg } from "./fn-fnarg/scenes";
import { scenes as fnHigher } from "./fn-higher/scenes";
import { scenes as fnLambda } from "./fn-lambda/scenes";
import { scenes as fnRecur } from "./fn-recur/scenes";
import { scenes as fnWrap } from "./fn-wrap/scenes";
import { scenes as modImport } from "./mod-import/scenes";
import { scenes as fileWhy } from "./file-why/scenes";
import { scenes as fileOpen } from "./file-open/scenes";
import { scenes as fileCsv } from "./file-csv/scenes";
import { scenes as fileJson } from "./file-json/scenes";
import { scenes as fileClose } from "./file-close/scenes";
import { scenes as llmWhy } from "./llm-why/scenes";
import { scenes as llmRequest } from "./llm-request/scenes";
import { scenes as llmParse } from "./llm-parse/scenes";
import { scenes as llmCheck } from "./llm-check/scenes";
import { scenes as llmPipeline } from "./llm-pipeline/scenes";
import { scenes as llmClose } from "./llm-close/scenes";

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
  "playlist-why": { id: "playlist-why", scenes: playlistWhy },
  "playlist-index": { id: "playlist-index", scenes: playlistIndex },
  "playlist-edit": { id: "playlist-edit", scenes: playlistEdit },
  "playlist-walk": { id: "playlist-walk", scenes: playlistWalk },
  "playlist-manager": { id: "playlist-manager", scenes: playlistManager },
  "playlist-upgrade": { id: "playlist-upgrade", scenes: playlistUpgrade },
  "tuple-card": { id: "tuple-card", scenes: tupleCard },
  "tuple-why": { id: "tuple-why", scenes: tupleWhy },
  "tuple-define": { id: "tuple-define", scenes: tupleDefine },
  "tuple-ops": { id: "tuple-ops", scenes: tupleOps },
  "tuple-limit": { id: "tuple-limit", scenes: tupleLimit },
  "tuple-walk": { id: "tuple-walk", scenes: tupleWalk },
  "set-why": { id: "set-why", scenes: setWhy },
  "set-define": { id: "set-define", scenes: setDefine },
  "set-edit": { id: "set-edit", scenes: setEdit },
  "set-ops": { id: "set-ops", scenes: setOps },
  "set-walk": { id: "set-walk", scenes: setWalk },
  "dict-why": { id: "dict-why", scenes: dictWhy },
  "dict-use": { id: "dict-use", scenes: dictUse },
  "dict-walk": { id: "dict-walk", scenes: dictWalk },
  "fn-why": { id: "fn-why", scenes: [...videoEvolutionByPart["fn-why"], ...fnWhy] },
  "fn-def": { id: "fn-def", scenes: [...videoEvolutionByPart["fn-def"], ...fnDef] },
  "fn-param": { id: "fn-param", scenes: fnParam },
  "fn-return": { id: "fn-return", scenes: fnReturn },
  "fn-call": { id: "fn-call", scenes: [...videoEvolutionByPart["fn-call"], ...fnCall] },
  "fn-close": { id: "fn-close", scenes: fnClose },
  "fn-ext": { id: "fn-ext", scenes: [...videoEvolutionByPart["fn-ext"], ...fnExt] },
  "fn-varargs": { id: "fn-varargs", scenes: [...videoEvolutionByPart["fn-varargs"], ...fnVarargs] },
  "fn-unpack": { id: "fn-unpack", scenes: [...videoEvolutionByPart["fn-unpack"], ...fnUnpack] },
  "fn-fnarg": { id: "fn-fnarg", scenes: [...videoEvolutionByPart["fn-fnarg"], ...fnFnarg] },
  "fn-higher": { id: "fn-higher", scenes: [...videoEvolutionByPart["fn-higher"], ...fnHigher] },
  "fn-lambda": { id: "fn-lambda", scenes: [...videoEvolutionByPart["fn-lambda"], ...fnLambda] },
  "fn-recur": { id: "fn-recur", scenes: [...videoEvolutionByPart["fn-recur"], ...fnRecur] },
  "fn-wrap": { id: "fn-wrap", scenes: fnWrap },
  "mod-import": { id: "mod-import", scenes: modImport },
  "file-why": { id: "file-why", scenes: fileWhy },
  "file-open": { id: "file-open", scenes: fileOpen },
  "file-csv": { id: "file-csv", scenes: fileCsv },
  "file-json": { id: "file-json", scenes: fileJson },
  "file-close": { id: "file-close", scenes: fileClose },
  "llm-why": { id: "llm-why", scenes: llmWhy },
  "llm-request": { id: "llm-request", scenes: llmRequest },
  "llm-parse": { id: "llm-parse", scenes: llmParse },
  "llm-check": { id: "llm-check", scenes: llmCheck },
  "llm-pipeline": { id: "llm-pipeline", scenes: llmPipeline },
  "llm-close": { id: "llm-close", scenes: llmClose },
};

export function getPart(ref: string): ContentPart {
  const part = PARTS[ref];
  if (!part) {
    throw new Error(`Unknown content part ref: ${ref}`);
  }
  return part;
}
