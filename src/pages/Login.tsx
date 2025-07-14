
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData, sanitizeInput, RateLimiter } from '@/lib/validation';
import { authStorage, sanitizeFormData } from '@/lib/security';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Rate limiters
  const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
  const registerLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

  const handleInputChange = (
    field: string, 
    value: string | boolean, 
    formType: 'login' | 'register'
  ) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    
    if (formType === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: sanitizedValue }));
    } else {
      setRegisterForm(prev => ({ ...prev, [field]: sanitizedValue }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    if (!loginLimiter.isAllowed('login')) {
      const remaining = Math.ceil(loginLimiter.getRemainingTime('login') / 1000 / 60);
      toast({
        title: "Terlalu banyak percobaan",
        description: `Coba lagi dalam ${remaining} menit`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Sanitize and validate input
      const sanitizedData = sanitizeFormData(loginForm);
      const validationResult = loginSchema.safeParse(sanitizedData);

      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // For real authentication, this would connect to Supabase
      // Simulated login for now
      setTimeout(() => {
        setIsLoading(false);
        
        // Store authentication state securely
        authStorage.setAuthToken('mock_token_' + Date.now());
        authStorage.setUserData({
          email: validationResult.data.email,
          loginTime: new Date().toISOString()
        });

        toast({
          title: "Login Berhasil",
          description: "Selamat datang kembali di KankerCare",
        });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    if (!registerLimiter.isAllowed('register')) {
      const remaining = Math.ceil(registerLimiter.getRemainingTime('register') / 1000 / 60);
      toast({
        title: "Terlalu banyak percobaan",
        description: `Coba lagi dalam ${remaining} menit`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Sanitize and validate input
      const sanitizedData = sanitizeFormData(registerForm);
      const validationResult = registerSchema.safeParse(sanitizedData);

      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // For real authentication, this would connect to Supabase
      // Simulated registration for now
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Registrasi Berhasil",
          description: "Akun Anda telah berhasil dibuat. Silakan login.",
        });
        
        // Reset form
        setRegisterForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/10 via-background to-medical-pink/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo dan Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-medical-blue to-medical-pink flex items-center justify-center">
              <span className="text-white font-bold">KC</span>
            </div>
            <span className="font-bold text-2xl text-foreground">KankerCare</span>
          </Link>
          <p className="text-muted-foreground">Platform informasi dan monitoring kanker</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
            <CardDescription>
              Akses dashboard dan riwayat kesehatan Anda
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>

              {/* Tab Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="email"
                         type="email"
                         placeholder="nama@email.com"
                         className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                         value={loginForm.email}
                         onChange={(e) => handleInputChange('email', e.target.value, 'login')}
                         required
                       />
                     </div>
                     {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         placeholder="Masukkan password"
                         className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                         value={loginForm.password}
                         onChange={(e) => handleInputChange('password', e.target.value, 'login')}
                         required
                       />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </Button>
                     </div>
                     {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                   </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginForm.rememberMe}
                        onCheckedChange={(checked) => 
                          setLoginForm({...loginForm, rememberMe: checked as boolean})
                        }
                      />
                      <Label htmlFor="remember" className="text-sm">Ingat saya</Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Lupa password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Masuk"}
                  </Button>
                </form>
              </TabsContent>

              {/* Tab Register */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="fullName"
                         type="text"
                         placeholder="Nama lengkap Anda"
                         className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                         value={registerForm.fullName}
                         onChange={(e) => handleInputChange('fullName', e.target.value, 'register')}
                         required
                       />
                     </div>
                     {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="registerEmail"
                         type="email"
                         placeholder="nama@email.com"
                         className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                         value={registerForm.email}
                         onChange={(e) => handleInputChange('email', e.target.value, 'register')}
                         required
                       />
                     </div>
                     {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="phone"
                         type="tel"
                         placeholder="08xxxxxxxxxx"
                         className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                         value={registerForm.phone}
                         onChange={(e) => handleInputChange('phone', e.target.value, 'register')}
                         required
                       />
                     </div>
                     {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="registerPassword"
                         type={showPassword ? "text" : "password"}
                         placeholder="Minimal 8 karakter"
                         className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                         value={registerForm.password}
                         onChange={(e) => handleInputChange('password', e.target.value, 'register')}
                         required
                         minLength={8}
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </Button>
                     </div>
                     {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="confirmPassword"
                         type={showPassword ? "text" : "password"}
                         placeholder="Ulangi password"
                         className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                         value={registerForm.confirmPassword}
                         onChange={(e) => handleInputChange('confirmPassword', e.target.value, 'register')}
                         required
                       />
                     </div>
                     {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                   </div>

                   <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                       <Checkbox
                         id="terms"
                         checked={registerForm.agreeTerms}
                         onCheckedChange={(checked) => 
                           handleInputChange('agreeTerms', checked as boolean, 'register')
                         }
                       />
                       <Label htmlFor="terms" className="text-sm">
                         Saya setuju dengan{' '}
                         <Link to="/terms" className="text-primary hover:underline">
                           syarat dan ketentuan
                         </Link>
                       </Label>
                     </div>
                     {errors.agreeTerms && <p className="text-sm text-destructive">{errors.agreeTerms}</p>}
                   </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Memproses..." : "Daftar Sekarang"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" disabled>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" disabled>
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Butuh bantuan?{' '}
            <Link to="/support" className="text-primary hover:underline">
              Hubungi Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
