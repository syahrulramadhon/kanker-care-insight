
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { FileInput, Book, BarChart3, Calendar, Users, Shield, Heart, CheckCircle } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Book,
      title: 'Edukasi Kanker',
      description: 'Pelajari berbagai jenis kanker, gejala, dan metode deteksi dini',
      color: 'text-medical-blue'
    },
    {
      icon: FileInput,
      title: 'Input Data Pasien',
      description: 'Catat dan pantau kondisi kesehatan pasien secara terstruktur',
      color: 'text-medical-pink'
    },
    {
      icon: BarChart3,
      title: 'Analisis & Dashboard',
      description: 'Visualisasi data dan analisis perkembangan kondisi pasien',
      color: 'text-medical-green'
    },
    {
      icon: Calendar,
      title: 'Konsultasi Medis',
      description: 'Hubungi dokter spesialis dan atur jadwal konsultasi',
      color: 'text-medical-blue'
    }
  ];

  const stats = [
    { label: 'Jenis Kanker Terdokumentasi', value: '15+' },
    { label: 'Pasien Terdaftar', value: '1,200+' },
    { label: 'Konsultasi Berhasil', value: '850+' },
    { label: 'Rumah Sakit Mitra', value: '25+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-medical-blue/10 via-background to-medical-pink/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Deteksi Dini Kanker
                  <span className="text-primary block">Selamatkan Hidup</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Platform informasi dan monitoring kanker yang aman, mudah digunakan, dan terpercaya untuk mendukung perjalanan pengobatan Anda.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/patient-input">
                    <FileInput className="mr-2 h-5 w-5" />
                    Masukkan Data Pasien
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link to="/education">
                    <Book className="mr-2 h-5 w-5" />
                    Pelajari Tentang Kanker
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-medical-blue" />
                  <span>Data Aman & Terenkripsi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-medical-pink" />
                  <span>Didukung Dokter Spesialis</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-medical-blue/20 to-medical-pink/20 rounded-3xl p-8 backdrop-blur-sm border">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Dashboard Pasien</h3>
                      <div className="h-3 w-3 rounded-full bg-medical-green animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-medical-pink/10 rounded-lg">
                        <span className="text-sm">Status Pemeriksaan</span>
                        <CheckCircle className="h-4 w-4 text-medical-green" />
                      </div>
                      <div className="flex justify-between items-center p-3 bg-medical-blue/10 rounded-lg">
                        <span className="text-sm">Jadwal Konsultasi</span>
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Hari ini</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-medical-green/10 rounded-lg">
                        <span className="text-sm">Hasil Lab Terbaru</span>
                        <span className="text-xs text-medical-green">Normal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Fitur Unggulan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dapatkan informasi lengkap dan kelola data pasien dengan mudah melalui platform terintegrasi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-scale-in border-0 bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Dipercaya Ribuan Pasien</h2>
            <p className="text-xl text-muted-foreground">
              Platform yang telah membantu banyak pasien dalam perjalanan pengobatan kanker
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 md:p-12 text-center text-white">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Mulai Perjalanan Kesehatan Anda Hari Ini
              </h2>
              <p className="text-xl opacity-90">
                Bergabunglah dengan ribuan pasien yang telah mempercayai platform kami untuk mendukung pengobatan kanker mereka.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                  <Link to="/patient-input">
                    Daftar Sekarang
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/consultation">
                    Konsultasi Gratis
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
