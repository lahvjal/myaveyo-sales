import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function IncentiveRedirectPage({ params }: { params: { id: string } }) {
  // Redirect /user/incentives/:id -> /user/incentives/:id/about
  redirect(`/user/incentives/${params.id}/about`)
}
