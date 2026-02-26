import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

const modules = [
  'Lead Pipeline',
  'Opportunity Tracking',
  'Customer 360',
  'Quote Center',
  'Order Status',
  'Activity Timeline',
  'Team Performance',
  'Forecast Console'
];

export default function DashboardPage({
  searchParams
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role ?? 'sales';

  return (
    <PageShell title="Dashboard" subtitle="ภาพรวมโมดูลหลักสำหรับงานขาย" backHref={`/login?role=${role}`}>
      <section className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Modules (8)</h2>
          <Link href={`/reports?role=${role}`} className="btn-primary">
            ไปหน้ารายงาน
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <article key={module} className="rounded-xl border border-border bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-800">{module}</p>
              <p className="mt-2 text-xs text-slate-500">UI Placeholder</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
