import { AI_PRESETS } from '../data/lessons/lesson01/aiResponses';
import type { AIProvider, AIResponse, CodeReviewRequest } from './AIProvider';

function getPresetResponse(req: CodeReviewRequest): AIResponse {
  const key = req.presetKey && AI_PRESETS[req.presetKey] ? req.presetKey : 'scene-19-boss';
  const entries = AI_PRESETS[key] ?? AI_PRESETS['scene-19-boss']!;
  const level = Math.min(Math.max(req.hintLevel ?? 1, 1), entries.length);
  const entry = entries[level - 1]!;

  return {
    type: entry.type,
    content: entry.content,
    hasMore: level < entries.length,
  };
}

export class DeterministicAI implements AIProvider {
  async reviewCode(req: CodeReviewRequest): Promise<AIResponse> {
    return getPresetResponse({ ...req, hintLevel: 1 });
  }

  async giveHint(req: CodeReviewRequest): Promise<AIResponse> {
    return getPresetResponse(req);
  }

  async explainError(req: CodeReviewRequest): Promise<AIResponse> {
    if (req.runError?.includes('TypeError')) {
      return {
        type: 'question',
        content: 'TypeError 常常意味着类型不匹配——input() 返回的是什么类型？',
        hasMore: true,
      };
    }
    if (req.runError?.includes('SyntaxError')) {
      return {
        type: 'question',
        content: 'SyntaxError 意味着 Python 无法解析你的代码——检查引号、括号是否配对。',
        hasMore: true,
      };
    }
    return getPresetResponse(req);
  }
}

export const deterministicAI = new DeterministicAI();
