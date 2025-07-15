
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, Star, Send, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ref, push, set } from 'firebase/database'; // pastikan 'set' diimpor!
import { db } from '@/lib/firebase'; // path ini harus sesuai

const Consultation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: '',
    complaint: '',
    urgency: 'normal'
  });

  const doctors = [
    {
      id: 'dr-amanda',
      name: 'Dr. Amanda Sari, Sp.Onk',
      specialty: 'Onkologi',
      experience: '15 tahun',
      rating: 4.9,
      image: '/placeholder.svg',
      available: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      hospital: 'RS Kanker Dharmais'
    },
    {
      id: 'dr-michael',
      name: 'Dr. Michael Tan, Sp.Rad.Onk',
      specialty: 'Radioterapi',
      experience: '12 tahun',
      rating: 4.8,
      image: '/placeholder.svg',
      available: ['08:00', '09:00', '13:00', '14:00', '16:00'],
      hospital: 'RS Cipto Mangunkusumo'
    },
    {
      id: 'dr-lisa',
      name: 'Dr. Lisa Wijaya, Sp.PD-KHOM',
      specialty: 'Hematologi Onkologi',
      experience: '10 tahun',
      rating: 4.7,
      image: '/placeholder.svg',
      available: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      hospital: 'RS Persahabatan'
    }
  ];

  const consultationTypes = [
    'Konsultasi Umum',
    'Second Opinion',
    'Follow-up Pengobatan',
    'Diskusi Hasil Lab',
    'Konsultasi Darurat'
  ];

  const hospitals = [
    {
      name: 'RS Kanker Dharmais',
      address: 'Jl. Letjen S. Parman Kav 84-86, Jakarta Barat',
      phone: '(021) 568-0571',
      distance: '2.5 km'
    },
    {
      name: 'RS Cipto Mangunkusumo',
      address: 'Jl. Diponegoro No.71, Jakarta Pusat',
      phone: '(021) 314-0608',
      distance: '5.2 km'
    },
    {
      name: 'RS Persahabatan',
      address: 'Jl. Persahabatan Raya No.1, Jakarta Timur',
      phone: '(021) 489-4001',
      distance: '7.8 km'
    }
  ];

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedDate || !selectedTime || !selectedDoctor) {
    toast({
      title: "Data belum lengkap",
      description: "Mohon pilih tanggal, waktu, dan dokter konsultasi.",
      variant: "destructive"
    });
    return;
  }

  // Simpan ke Firebase
  const newConsultRef = push(ref(db, 'konsultasi'));

    set(newConsultRef, {
      ...formData,
      doctor: selectedDoctor,
      date: selectedDate.toISOString(),
      time: selectedTime,
      createdAt: new Date().toISOString()
    })
    .then(() => {
      toast({
        title: "Konsultasi berhasil dikirim!",
        description: `Konsultasi dengan ${selectedDoctorData?.name} pada ${format(selectedDate, 'dd MMMM yyyy', { locale: id })} pukul ${selectedTime}.`,
      });

      // Reset form
      setFormData({
        name: '', email: '', phone: '', consultationType: '', complaint: '', urgency: 'normal'
      });
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedDoctor('');
    })
    .catch((err) => {
      toast({
        title: "Gagal mengirim data",
        description: err.message,
        variant: "destructive"
      });
    });
};


  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Konsultasi & Rujukan</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Jadwalkan konsultasi dengan dokter spesialis atau dapatkan rujukan ke rumah sakit terpercaya
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Consultation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Jadwalkan Konsultasi
                </CardTitle>
                <CardDescription>
                  Isi formulir di bawah untuk membuat janji konsultasi dengan dokter spesialis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">No. Telepon *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="nama@email.com"
                    />
                  </div>

                  {/* Consultation Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Jenis Konsultasi *</Label>
                      <Select value={formData.consultationType} onValueChange={(value) => setFormData(prev => ({ ...prev, consultationType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis konsultasi" />
                        </SelectTrigger>
                        <SelectContent>
                          {consultationTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tingkat Urgensi</Label>
                      <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Mendesak</SelectItem>
                          <SelectItem value="emergency">Darurat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complaint">Keluhan/Pertanyaan *</Label>
                    <Textarea
                      id="complaint"
                      value={formData.complaint}
                      onChange={(e) => setFormData(prev => ({ ...prev, complaint: e.target.value }))}
                      placeholder="Jelaskan keluhan atau pertanyaan yang ingin Anda konsultasikan..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Doctor Selection */}
                  <div className="space-y-4">
                    <Label>Pilih Dokter Spesialis *</Label>
                    <div className="grid gap-4">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-colors",
                            selectedDoctor === doctor.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                          onClick={() => setSelectedDoctor(doctor.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  {doctor.rating}
                                </span>
                                <span>{doctor.experience} pengalaman</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                            </div>
                            <Badge variant="outline">{doctor.specialty}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time Selection */}
                  {selectedDoctor && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pilih Tanggal *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date() || date.getDay() === 0}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Pilih Waktu *</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih waktu" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedDoctorData?.available.map((time) => (
                              <SelectItem key={time} value={time}>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {time}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Jadwalkan Konsultasi
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Konsultasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-medical-green mt-0.5" />
                  <div>
                    <p className="font-medium">Konsultasi Gratis</p>
                    <p className="text-sm text-muted-foreground">
                      Konsultasi awal tidak dikenakan biaya
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Respon Cepat</p>
                    <p className="text-sm text-muted-foreground">
                      Konfirmasi dalam 1x24 jam
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Telehealth Available</p>
                    <p className="text-sm text-muted-foreground">
                      Konsultasi online tersedia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg text-red-800">Kontak Darurat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-red-700">
                  <p className="font-medium">Untuk kondisi darurat:</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-bold">119</span>
                  </div>
                  <p className="text-sm">
                    Atau datang langsung ke IGD rumah sakit terdekat
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hospital List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rumah Sakit Rujukan</CardTitle>
                <CardDescription>Rumah sakit mitra terdekat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hospitals.map((hospital, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{hospital.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {hospital.distance}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{hospital.address}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {hospital.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
