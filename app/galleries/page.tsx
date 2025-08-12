import { Suspense } from 'react'
import GalleriesClient from './GalleriesClient'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GalleriesClient />
    </Suspense>
  )
}
