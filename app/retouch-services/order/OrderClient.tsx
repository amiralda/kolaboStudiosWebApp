'use client';

import { useSearchParams } from 'next/navigation';

export default function OrderClient({ children }: { children?: React.ReactNode }) {
  const params = useSearchParams();
  // example: read values safely
  const category = params.get('category') || 'all';

  // TODO: use category to filter, etc.
  return <>{children}</>;
}
