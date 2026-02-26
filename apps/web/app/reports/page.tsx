import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

const reportCards = [
  { title: 'ยอดขายรายเดือน', description: 'สรุปยอดขายตามช่วงเวลา' },
  { title: 'Conversion Rate', description: 'อัตราการเปลี่ยนจาก Lead เป็นลูกค้า' },
  { title: 'Pipeline Velocity', description: 'ความเร็วของโอกาสในแต่ละ Stage' }
];

export default function ReportsPage({
  searchParams
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role ?? 'sales';

  return (
    <PageShell title="Reports" subtitle="ศูนย์รวมรายงานสำคัญสำหรับทีมขาย" backHref={`/dashboard?role=${role}`}>
      <section className="grid gap-4 md:grid-cols-3">
        {reportCards.map((report) => (
          <article key={report.title} className="card p-5">
            <h2 className="text-base font-semibold text-slate-900">{report.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{report.description}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-blue-600">Coming in phase 2</p>
          </article>
        ))}
      </section>
      <div className="card flex items-center justify-between p-4">
        <p className="text-sm text-slate-600">ยังไม่มี Business Logic และ Data Integration ในเฟสนี้</p>
        <Link href={`/dashboard?role=${role}`} className="btn-primary">
          กลับ Dashboard
        </Link>
      </div>
    </PageShell>
  );
}
