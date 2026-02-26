import Link from 'next/link';

type PageShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
};

export function PageShell({ title, subtitle, children, backHref }: PageShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Sales TAI-YO Plus V2</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          </div>
          {backHref ? (
            <Link href={backHref} className="btn-outline">
              ย้อนกลับ
            </Link>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  );
}
