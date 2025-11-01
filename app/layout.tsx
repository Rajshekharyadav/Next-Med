import './globals.css';
import { AuthProvider } from './context/AuthContext';
import EnhancedHeader from '@/components/layout/EnhancedHeader';

export const metadata = {
  title: 'NextMed - Advanced Healthcare Solutions',
  description: 'NextMed provides advanced healthcare solutions with online doctor consultation, appointment scheduling, and comprehensive health information.',
  icons: {
    icon: '/images/logo nextmed.png',
    apple: '/images/logo nextmed.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <AuthProvider>
          <EnhancedHeader />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}