import { Suspense } from 'react';
import GalleriesClient from './GalleriesClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading gallery…</div>}>
      <GalleriesClient>
        {/* your existing server-rendered gallery content here */}
      </GalleriesClient>
    </Suspense>
  );
}
