import { Suspense } from 'react';
import OrderClient from './OrderClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading retouch…</div>}>
      <OrderClient>
        {/* your existing server-rendered gallery content here */}
      </OrderClient>
    </Suspense>
  );
}
