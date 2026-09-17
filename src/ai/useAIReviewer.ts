import { useCallback, useState } from 'react';
import { deterministicAI } from './DeterministicAI';
import type { AIResponse, CodeReviewRequest } from './AIProvider';

export function useAIReviewer() {
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [loading, setLoading] = useState(false);

  const review = useCallback(async (req: CodeReviewRequest) => {
    setLoading(true);
    try {
      const res = await deterministicAI.reviewCode(req);
      setResponse(res);
      setHintLevel(1);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextHint = useCallback(async (req: CodeReviewRequest) => {
    setLoading(true);
    try {
      const next = hintLevel + 1;
      const res = await deterministicAI.giveHint({ ...req, hintLevel: next });
      setResponse(res);
      setHintLevel(next);
    } finally {
      setLoading(false);
    }
  }, [hintLevel]);

  const reset = useCallback(() => {
    setResponse(null);
    setHintLevel(0);
  }, []);

  return { response, hintLevel, loading, review, nextHint, reset };
}
