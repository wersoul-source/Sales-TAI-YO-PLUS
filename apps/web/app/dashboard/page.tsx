import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

const modules = [
  { name: 'Customer Registry', href: '/customers', description: 'จัดเก็บข้อมูลลูกค้าลง Firestore' },
  { name: 'Lead Pipeline', href: '#', description: 'UI Placeholder' },
  { name: 'Opportunity Tracking', href: '#', description: 'UI Placeholder' },
  { name: 'Quote Center', href: '#', description: 'UI Placeholder' },
  { name: 'Order Status', href: '#', description: 'UI Placeholder' },
  { name: 'Activity Timeline', href: '#', description: 'UI Placeholder' },
  { name: 'Team Performance', href: '#', description: 'UI Placeholder' },
  { name: 'Forecast Console', href: '#', description: 'UI Placeholder' }
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
            <article key={module.name} className="rounded-xl border border-border bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-800">{module.name}</p>
              <p className="mt-2 text-xs text-slate-500">{module.description}</p>
              {module.href === '#' ? (
                <span className="mt-3 inline-block text-xs text-slate-400">พร้อมใช้งานในเฟสถัดไป</span>
              ) : (
                <Link href={module.href} className="mt-3 inline-block text-xs font-medium text-blue-600">
                  เปิดโมดูล
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
