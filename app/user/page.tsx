import { redirect } from 'next/navigation'

export default function AdminIndex() {
  // Server-side redirect from /admin to the dashboard
  return redirect('/user/dashboard')
}
