'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';

type Customer = {
  id: string;
  customerCode: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  taxId: string;
  segment: 'enterprise' | 'sme' | 'retail';
  status: 'active' | 'inactive';
};

const initialForm = {
  customerCode: '',
  companyName: '',
  contactName: '',
  phone: '',
  email: '',
  taxId: '',
  segment: 'sme',
  status: 'active'
};

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadCustomers() {
    const res = await fetch('/api/customers', { cache: 'no-store' });
    const json = await res.json();
    setCustomers(json.data ?? []);
  }

  useEffect(() => {
    loadCustomers().catch(() => setMessage('โหลดข้อมูลลูกค้าไม่สำเร็จ'));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'เกิดข้อผิดพลาด');
      }

      setForm(initialForm);
      setMessage('บันทึกลูกค้าสำเร็จ');
      await loadCustomers();
    } catch (error) {
      setMessage(`บันทึกลูกค้าไม่สำเร็จ: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell title="Customer Registry" subtitle="จัดเก็บข้อมูลลูกค้าเข้าสู่ Firestore" backHref="/dashboard?role=sales">
      <section className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card space-y-4 p-5 lg:col-span-1">
          <h2 className="text-base font-semibold">เพิ่มลูกค้าใหม่</h2>
          {[
            ['customerCode', 'Customer Code'],
            ['companyName', 'Company Name'],
            ['contactName', 'Contact Name'],
            ['phone', 'Phone'],
            ['email', 'Email'],
            ['taxId', 'Tax ID']
          ].map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block text-slate-700">{label}</span>
              <input
                required
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full rounded-xl border border-border px-3 py-2 outline-none focus:border-blue-500"
              />
            </label>
          ))}

          <label className="block text-sm">
            <span className="mb-1 block text-slate-700">Segment</span>
            <select
              value={form.segment}
              onChange={(e) => setForm((prev) => ({ ...prev, segment: e.target.value as typeof form.segment }))}
              className="w-full rounded-xl border border-border px-3 py-2"
            >
              <option value="enterprise">Enterprise</option>
              <option value="sme">SME</option>
              <option value="retail">Retail</option>
            </select>
          </label>

          <button disabled={loading} type="submit" className="btn-primary w-full disabled:opacity-60">
            {loading ? 'กำลังบันทึก...' : 'บันทึกลูกค้า'}
          </button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </form>

        <section className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Customer List</h2>
            <button className="btn-outline" onClick={() => loadCustomers()}>
              รีเฟรช
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-2 py-2">Code</th>
                  <th className="px-2 py-2">Company</th>
                  <th className="px-2 py-2">Contact</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Segment</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t border-border">
                    <td className="px-2 py-2 font-medium">{customer.customerCode}</td>
                    <td className="px-2 py-2">{customer.companyName}</td>
                    <td className="px-2 py-2">{customer.contactName}</td>
                    <td className="px-2 py-2">{customer.email}</td>
                    <td className="px-2 py-2 uppercase">{customer.segment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link className="btn-outline" href="/reports?role=sales">
              ไปหน้ารายงาน
            </Link>
          </div>
        </section>
      </section>
    </PageShell>
  );
}
