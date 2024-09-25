import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jackson產業觀點',
  description: 'Jackson產業觀點',
  verification: {
    google: 'iP5orFFmfLOtuNnWzNO9cpucZkJalvFhbmiwpfIE2Jc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
