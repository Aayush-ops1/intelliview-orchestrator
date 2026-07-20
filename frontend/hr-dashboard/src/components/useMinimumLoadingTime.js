import { useEffect, useState } from 'react';

/**
 * useMinimumLoadingTime
 *
 * Keeps a loading flag true for at least `minMs`, even if the real
 * data resolves faster. Prevents the skeleton from flashing on-screen
 * for e.g. 80ms and then instantly swapping to content, which reads
 * as a glitch rather than a loading state.
 *
 * @param {boolean} isLoading - actual loading state (e.g. from a fetch)
 * @param {number} minMs - minimum time skeleton should stay visible
 * @returns {boolean} - loading state to actually render against
 */
export function useMinimumLoadingTime(isLoading, minMs = 400) {
  const [shouldShowLoading, setShouldShowLoading] = useState(isLoading);
  const [loadStartedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - loadStartedAt;
      const remaining = Math.max(0, minMs - elapsed);
      const timer = setTimeout(() => setShouldShowLoading(false), remaining);
      return () => clearTimeout(timer);
    }
    setShouldShowLoading(true);
  }, [isLoading, minMs, loadStartedAt]);

  return shouldShowLoading;
}

/*
Example usage in the dashboard container:

import { useMinimumLoadingTime } from './useMinimumLoadingTime';
import DashboardSkeleton from './DashboardSkeleton';
import StatsCards from './StatsCards';
import CandidateTable from './CandidateTable';

function Dashboard() {
  const { data, isLoading } = useDashboardData(); // your existing fetch hook
  const showSkeleton = useMinimumLoadingTime(isLoading, 400);

  if (showSkeleton) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <StatsCards data={data.stats} />
      <CandidateTable rows={data.candidates} />
    </div>
  );
}
*/
