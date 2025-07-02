
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Book, FileInput, BarChart3, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Edukasi Kanker', href: '/education', icon: Book },
    { name: 'Input Data Pasien', href: '/patient-input', icon: FileInput },
    { name: 'Dashboard Analisis', href: '/dashboard', icon: BarChart3 },
    { name: 'Konsultasi', href: '/consultation', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-medical-blue to-medical-pink flex items-center justify-center">
                <span className="text-white font-bold text-sm">KC</span>
              </div>
              <span className="font-bold text-xl text-foreground">KankerCare</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Login Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t bg-background">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-medical-blue to-medical-pink flex items-center justify-center">
                  <span className="text-white font-bold text-xs">KC</span>
                </div>
                <span className="font-bold text-lg">KankerCare</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform informasi dan monitoring kanker yang aman dan terpercaya.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Navigasi</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Beranda</Link></li>
                <li><Link to="/education" className="hover:text-foreground">Edukasi</Link></li>
                <li><Link to="/patient-input" className="hover:text-foreground">Input Data</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Informasi</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-foreground">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-foreground">Syarat & Ketentuan</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Kontak</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: info@kankercare.id</li>
                <li>Telepon: (021) 1234-5678</li>
                <li>Emergency: 119</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 KankerCare. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
