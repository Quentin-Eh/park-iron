import { useState, useEffect, useCallback } from 'react';
import type { Session } from '../types/session.ts';
import { SyncedStore } from '../data/synced-store.ts';

export function useCoaching(session: Session | null, userId: string | null) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchFeedback = useCallback(async () => {
    if (!session || !userId) return;

    // Already have feedback (from history or previous fetch)
    if (session.coachingFeedback) {
      setFeedback(session.coachingFeedback);
      return;
    }

    setLoading(true);
    setError(false);

    const result = await SyncedStore.fetchCoaching(session.id);
    if (result) {
      setFeedback(result);
      session.coachingFeedback = result;
    } else {
      setError(true);
    }
    setLoading(false);
  }, [session, userId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const retry = useCallback(() => {
    setError(false);
    fetchFeedback();
  }, [fetchFeedback]);

  return { feedback, loading, error, retry };
}
