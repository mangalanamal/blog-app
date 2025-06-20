import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from './components/header'; // ✅ adjust path if needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BlogSphere',
  description: 'A beautiful blog platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header /> {/* ✅ This renders your header on all pages */}
          <main className="min-h-screen bg-gray-50"> {/* Add padding to avoid overlap under fixed header */}
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
