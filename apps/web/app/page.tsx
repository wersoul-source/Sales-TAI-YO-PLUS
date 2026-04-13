import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

const roles = [
  { key: 'sales', title: 'Sales Executive', description: 'บริหารงานขายและติดตามลูกค้า', accent: 'bg-blue-600' },
  { key: 'manager', title: 'Sales Manager', description: 'ภาพรวมทีม ยอดขาย และ KPI', accent: 'bg-emerald-600' },
  { key: 'admin', title: 'Operations Admin', description: 'ดูแลข้อมูลระบบและรายงานกลาง', accent: 'bg-violet-600' }
];

export default function RoleSelectPage() {
  return (
    <PageShell title="เลือกบทบาท" subtitle="เริ่มต้นเข้าสู่ระบบด้วยบทบาทของคุณ">
      <section className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <Link key={role.key} href={`/login?role=${role.key}`} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className={`mb-4 h-1.5 w-12 rounded-full ${role.accent}`} />
            <h2 className="text-lg font-semibold text-slate-900">{role.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{role.description}</p>
            <p className="mt-4 text-sm font-medium text-blue-600">เลือกบทบาทนี้</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
