import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'NextMed - Advanced Healthcare Solutions',
  description: 'NextMed provides advanced healthcare solutions with online doctor consultation, appointment scheduling, and comprehensive health information.',
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
          <Header />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
} 