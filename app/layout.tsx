import type {Metadata} from 'next';
import { Goldman, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const goldman = Goldman({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-goldman',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'KLOPPER',
  description: 'Sistema táctico de inteligencia de mercado cripto en tiempo real. Análisis on-chain, movimiento de ballenas, mapas de calor de liquidación y liquidez para BTC, ETH, BNB y SOL con central de comando asistida por IA.',
  keywords: ['KLOPPER', 'klopper', 'trading', 'inteligencia on-chain', 'radar de ballenas', 'mapas de calor', 'exness', 'bitcoin', 'solana', 'ethereum', 'bnb'],
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${goldman.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-[#080C10] text-white min-h-screen font-goldman antialiased">
        {children}
      </body>
    </html>
  );
}
