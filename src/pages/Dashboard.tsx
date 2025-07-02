
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { BarChart3, TrendingUp, Calendar, FileText, Alert, CheckCircle, Clock, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const patientData = {
    name: 'Sarah Johnson',
    age: 45,
    cancerType: 'Kanker Payudara',
    stage: 'Stadium II',
    diagnosisDate: '2024-03-15',
    nextAppointment: '2024-07-15'
  };

  const labData = [
    { date: 'Jan 2024', ca125: 32, cea: 2.8, psa: 0 },
    { date: 'Feb 2024', ca125: 28, cea: 2.5, psa: 0 },
    { date: 'Mar 2024', ca125: 25, cea: 2.2, psa: 0 },
    { date: 'Apr 2024', ca125: 22, cea: 2.0, psa: 0 },
    { date: 'May 2024', ca125: 20, cea: 1.8, psa: 0 },
    { date: 'Jun 2024', ca125: 18, cea: 1.5, psa: 0 }
  ];

  const treatmentData = [
    { treatment: 'Kemoterapi', sessions: 8, completed: 6 },
    { treatment: 'Radiasi', sessions: 20, completed: 15 },
    { treatment: 'Terapi Target', sessions: 12, completed: 10 }
  ];

  const upcomingAppointments = [
    { date: '2024-07-15', type: 'Konsultasi Onkologi', doctor: 'Dr. Amanda', time: '10:00' },
    { date: '2024-07-20', type: 'Lab Kontrol', doctor: 'Lab Klinik', time: '08:00' },
    { date: '2024-07-25', type: 'Radiasi', doctor: 'Dr. Michael', time: '14:00' }
  ];

  const symptoms = [
    { symptom: 'Kelelahan', severity: 'Ringan', status: 'stable' },
    { symptom: 'Mual', severity: 'Sedang', status: 'improving' },
    { symptom: 'Nyeri', severity: 'Ringan', status: 'stable' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Dashboard Analisis</h1>
            <p className="text-muted-foreground mt-2">
              Pantau perkembangan kondisi dan pengobatan Anda
            </p>
          </div>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Laporan
          </Button>
        </div>

        {/* Patient Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {patientData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{patientData.name}</CardTitle>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <span>{patientData.age} tahun</span>
                  <Badge variant="outline">{patientData.cancerType}</Badge>
                  <Badge variant="secondary">{patientData.stage}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Diagnosa</p>
                  <p className="font-semibold">{new Date(patientData.diagnosisDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Konsultasi Berikutnya</p>
                  <p className="font-semibold">{new Date(patientData.nextAppointment).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-medical-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Status Pengobatan</p>
                  <p className="font-semibold text-medical-green">Membaik</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="treatment">Pengobatan</TabsTrigger>
            <TabsTrigger value="schedule">Jadwal</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">CA-125 Terbaru</p>
                      <p className="text-2xl font-bold text-medical-green">18 U/ml</p>
                      <Badge variant="secondary" className="mt-1">Normal</Badge>
                    </div>
                    <TrendingUp className="h-8 w-8 text-medical-green" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sesi Kemoterapi</p>
                      <p className="text-2xl font-bold">6/8</p>
                      <Progress value={75} className="mt-2 h-2" />
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Gejala Terpantau</p>
                      <p className="text-2xl font-bold">3</p>
                      <Badge variant="outline" className="mt-1">Stabil</Badge>
                    </div>
                    <Alert className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Konsultasi Berikutnya</p>
                      <p className="text-lg font-bold">5 hari</p>
                      <Badge variant="outline" className="mt-1">Terjadwal</Badge>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Symptoms Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Gejala</CardTitle>
                <CardDescription>Pantauan gejala dan tingkat keparahan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {symptoms.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${
                          item.status === 'improving' ? 'bg-medical-green' : 
                          item.status === 'worsening' ? 'bg-red-500' : 'bg-amber-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{item.symptom}</p>
                          <p className="text-sm text-muted-foreground">Tingkat: {item.severity}</p>
                        </div>
                      </div>
                      <Badge variant={
                        item.status === 'improving' ? 'default' : 
                        item.status === 'worsening' ? 'destructive' : 'secondary'
                      }>
                        {item.status === 'improving' ? 'Membaik' : 
                         item.status === 'worsening' ? 'Memburuk' : 'Stabil'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tren Hasil Laboratorium</CardTitle>
                <CardDescription>Perkembangan marker tumor selama 6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={labData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="ca125" stroke="#3b82f6" strokeWidth={2} name="CA-125" />
                      <Line type="monotone" dataKey="cea" stroke="#ef4444" strokeWidth={2} name="CEA" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CA-125</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-medical-green">18 U/ml</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Normal: &lt;35 U/ml
                  </p>
                  <Badge variant="secondary" className="mt-2">Turun 28%</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CEA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-medical-green">1.5 ng/ml</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Normal: &lt;3 ng/ml
                  </p>
                  <Badge variant="secondary" className="mt-2">Turun 46%</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hemoglobin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12.5 g/dL</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Normal: 12-15 g/dL
                  </p>
                  <Badge variant="outline" className="mt-2">Normal</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Pengobatan</CardTitle>
                <CardDescription>Status dan kemajuan berbagai terapi yang sedang dijalani</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {treatmentData.map((treatment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{treatment.treatment}</h4>
                        <Badge variant="outline">
                          {treatment.completed}/{treatment.sessions} sesi
                        </Badge>
                      </div>
                      <Progress 
                        value={(treatment.completed / treatment.sessions) * 100} 
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground">
                        {Math.round((treatment.completed / treatment.sessions) * 100)}% selesai
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rekomendasi Terapi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-medical-green/10 border border-medical-green/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-medical-green mt-0.5" />
                      <div>
                        <p className="font-medium text-medical-green">Respons Baik terhadap Kemoterapi</p>
                        <p className="text-sm text-muted-foreground">
                          Marker tumor menunjukkan penurunan signifikan. Lanjutkan protokol saat ini.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Alert className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Evaluasi Radiasi</p>
                        <p className="text-sm text-muted-foreground">
                          Pertimbangkan penyesuaian dosis radiasi berdasarkan respons tumor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Konsultasi Mendatang</CardTitle>
                <CardDescription>Daftar appointment dan pemeriksaan yang terjadwal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">
                            {new Date(appointment.date).getDate()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString('id-ID', { month: 'short' })}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor} • {appointment.time}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Detail
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reminder Obat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Tamoxifen 20mg</span>
                      <Badge variant="outline">08:00</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Multivitamin</span>
                      <Badge variant="outline">20:00</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Anti-mual</span>
                      <Badge variant="outline">Sesuai kebutuhan</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kontrol Lab Berikutnya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold">20 Juli</div>
                    <p className="text-muted-foreground">CA-125, CEA, Complete Blood Count</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Atur Pengingat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
