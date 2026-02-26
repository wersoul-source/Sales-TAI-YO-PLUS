import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sales TAI-YO Plus V2',
  description: 'Frontend UI flow for Sales TAI-YO Plus V2 deployed on Google Cloud Run.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
