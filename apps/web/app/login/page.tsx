import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

const roleTheme = {
  sales: { label: 'Sales Executive', color: 'text-blue-700', ring: 'ring-blue-200', button: 'bg-blue-600 hover:bg-blue-700' },
  manager: { label: 'Sales Manager', color: 'text-emerald-700', ring: 'ring-emerald-200', button: 'bg-emerald-600 hover:bg-emerald-700' },
  admin: { label: 'Operations Admin', color: 'text-violet-700', ring: 'ring-violet-200', button: 'bg-violet-600 hover:bg-violet-700' }
} as const;

type RoleKey = keyof typeof roleTheme;

export default function LoginPage({
  searchParams
}: {
  searchParams: { role?: string };
}) {
  const role = (searchParams.role as RoleKey) || 'sales';
  const theme = roleTheme[role] ?? roleTheme.sales;

  return (
    <PageShell title="เข้าสู่ระบบ" subtitle="ยืนยันตัวตนด้วย PIN 6 หลัก" backHref="/">
      <section className={`card mx-auto max-w-lg p-6 ring-1 ${theme.ring}`}>
        <p className={`text-sm font-medium ${theme.color}`}>Role: {theme.label}</p>
        <div className="mt-6 space-y-3">
          <label htmlFor="pin" className="block text-sm font-medium text-slate-700">
            PIN (6 digits)
          </label>
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            className="w-full rounded-xl border border-border px-4 py-3 text-center text-xl tracking-[0.4em] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="text-xs text-slate-500">Phase 1: หน้านี้เป็น UI เท่านั้น ยังไม่เชื่อมต่อระบบยืนยันตัวตน</p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Link href="/" className="btn-outline">
            ยกเลิก
          </Link>
          <Link href={`/dashboard?role=${role}`} className={`inline-flex rounded-xl px-4 py-2.5 text-sm font-medium text-white ${theme.button}`}>
            เข้าสู่ Dashboard
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
