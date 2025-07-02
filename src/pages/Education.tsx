
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, Zap, Shield, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Education = () => {
  const [selectedType, setSelectedType] = useState('semua');

  const cancerTypes = [
    {
      id: 'payudara',
      name: 'Kanker Payudara',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      category: 'wanita',
      prevalence: '23%',
      description: 'Kanker yang terbentuk di jaringan payudara, paling umum pada wanita namun juga dapat terjadi pada pria.',
      symptoms: ['Benjolan di payudara', 'Perubahan ukuran payudara', 'Keluarnya cairan dari puting', 'Perubahan tekstur kulit'],
      riskFactors: ['Usia di atas 50 tahun', 'Riwayat keluarga', 'Mutasi gen BRCA1/BRCA2', 'Terapi hormon'],
      stages: {
        1: 'Tumor kecil terbatas pada payudara',
        2: 'Tumor sudah menyebar ke kelenjar getah bening terdekat',
        3: 'Penyebaran lebih luas ke kelenjar getah bening',
        4: 'Metastasis ke organ lain'
      }
    },
    {
      id: 'paru',
      name: 'Kanker Paru-paru',
      icon: Zap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      category: 'umum',
      prevalence: '18%',
      description: 'Kanker yang dimulai di paru-paru, sering dikaitkan dengan kebiasaan merokok namun juga dapat terjadi pada non-perokok.',
      symptoms: ['Batuk kronis', 'Sesak napas', 'Nyeri dada', 'Batuk berdarah', 'Penurunan berat badan'],
      riskFactors: ['Merokok aktif/pasif', 'Paparan radon', 'Polusi udara', 'Riwayat keluarga'],
      stages: {
        1: 'Tumor kecil hanya di paru-paru',
        2: 'Tumor lebih besar atau menyebar ke kelenjar getah bening',
        3: 'Penyebaran ke struktur terdekat',
        4: 'Metastasis ke organ jauh'
      }
    },
    {
      id: 'prostat',
      name: 'Kanker Prostat',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      category: 'pria',
      prevalence: '15%',
      description: 'Kanker yang berkembang di kelenjar prostat pria, umumnya tumbuh lambat dan terjadi pada usia lanjut.',
      symptoms: ['Sering buang air kecil', 'Aliran urin lemah', 'Darah dalam urin', 'Nyeri panggul'],
      riskFactors: ['Usia di atas 65 tahun', 'Riwayat keluarga', 'Ras Afrika-Amerika', 'Diet tinggi lemak'],
      stages: {
        1: 'Tumor kecil tidak teraba',
        2: 'Tumor dapat diraba tapi terbatas pada prostat',
        3: 'Penyebaran ke jaringan sekitar prostat',
        4: 'Metastasis ke organ lain'
      }
    },
    {
      id: 'serviks',
      name: 'Kanker Serviks',
      icon: Shield,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      category: 'wanita',
      prevalence: '8%',
      description: 'Kanker yang terjadi pada leher rahim, sering disebabkan oleh infeksi Human Papillomavirus (HPV).',
      symptoms: ['Pendarahan vagina abnormal', 'Keputihan berbau', 'Nyeri panggul', 'Nyeri saat berhubungan'],
      riskFactors: ['Infeksi HPV', 'Aktivitas seksual dini', 'Multiple partner', 'Merokok'],
      stages: {
        1: 'Tumor terbatas pada serviks',
        2: 'Penyebaran ke vagina atau parametrium',
        3: 'Penyebaran ke dinding panggul',
        4: 'Metastasis ke organ jauh'
      }
    }
  ];

  const categories = [
    { id: 'semua', name: 'Semua Jenis', count: cancerTypes.length },
    { id: 'umum', name: 'Umum', count: cancerTypes.filter(c => c.category === 'umum').length },
    { id: 'wanita', name: 'Khusus Wanita', count: cancerTypes.filter(c => c.category === 'wanita').length },
    { id: 'pria', name: 'Khusus Pria', count: cancerTypes.filter(c => c.category === 'pria').length }
  ];

  const filteredCancers = selectedType === 'semua' 
    ? cancerTypes 
    : cancerTypes.filter(cancer => cancer.category === selectedType);

  const CancerDetailModal = ({ cancer }: { cancer: typeof cancerTypes[0] }) => {
    const Icon = cancer.icon;
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            Pelajari Detail <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className={cn("p-3 rounded-lg", cancer.bgColor)}>
                <Icon className={cn("h-6 w-6", cancer.color)} />
              </div>
              <div>
                <DialogTitle className="text-2xl">{cancer.name}</DialogTitle>
                <Badge variant="secondary">Prevalensi: {cancer.prevalence}</Badge>
              </div>
            </div>
            <DialogDescription className="text-base">
              {cancer.description}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="gejala" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gejala">Gejala & Tanda</TabsTrigger>
              <TabsTrigger value="faktor">Faktor Risiko</TabsTrigger>
              <TabsTrigger value="stadium">Stadium Kanker</TabsTrigger>
            </TabsList>

            <TabsContent value="gejala" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                    Gejala dan Tanda Peringatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {cancer.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Penting:</strong> Gejala-gejala ini tidak selalu menandakan kanker. 
                      Konsultasikan dengan dokter untuk diagnosis yang akurat.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faktor" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                    Faktor Risiko
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {cancer.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0"></div>
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Catatan:</strong> Memiliki faktor risiko tidak berarti pasti akan terkena kanker. 
                      Ini hanya meningkatkan kemungkinan terjadinya kanker.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stadium" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stadium Kanker</CardTitle>
                  <CardDescription>
                    Pemahaman stadium membantu menentukan tingkat penyebaran dan rencana pengobatan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(cancer.stages).map(([stage, description]) => (
                      <div key={stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Stadium {stage}</span>
                          <Badge variant={stage === '1' ? 'default' : stage === '4' ? 'destructive' : 'secondary'}>
                            {stage === '1' ? 'Dini' : stage === '4' ? 'Lanjut' : 'Menengah'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{description}</p>
                        <Progress value={parseInt(stage) * 25} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Edukasi Kanker</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pelajari berbagai jenis kanker, gejala, faktor risiko, dan pentingnya deteksi dini 
            untuk meningkatkan peluang kesembuhan.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedType === category.id ? "default" : "outline"}
                onClick={() => setSelectedType(category.id)}
                className="mb-2"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Cancer Types Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {filteredCancers.map((cancer) => {
            const Icon = cancer.icon;
            return (
              <Card key={cancer.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-3 rounded-lg", cancer.bgColor)}>
                        <Icon className={cn("h-6 w-6", cancer.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{cancer.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">Prevalensi: {cancer.prevalence}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {cancer.category === 'umum' ? 'Umum' : 
                             cancer.category === 'wanita' ? 'Wanita' : 'Pria'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {cancer.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Gejala Utama:</h4>
                      <div className="flex flex-wrap gap-1">
                        {cancer.symptoms.slice(0, 3).map((symptom, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                        {cancer.symptoms.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{cancer.symptoms.length - 3} lainnya
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CancerDetailModal cancer={cancer} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Info className="mr-2 h-5 w-5" />
                Deteksi Dini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                Deteksi dini kanker dapat meningkatkan peluang kesembuhan hingga 90%. 
                Lakukan pemeriksaan rutin sesuai usia dan faktor risiko Anda.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Shield className="mr-2 h-5 w-5" />
                Pencegahan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Hidup sehat dengan olahraga teratur, diet seimbang, tidak merokok, 
                dan menghindari alkohol berlebihan dapat mengurangi risiko kanker.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Heart className="mr-2 h-5 w-5" />
                Dukungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">
                Dukungan keluarga, teman, dan komunitas sangat penting dalam perjalanan 
                pengobatan kanker. Jangan ragu untuk mencari bantuan profesional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Education;
