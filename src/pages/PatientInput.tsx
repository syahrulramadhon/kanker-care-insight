
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Upload, User, FileText, Heart, CheckCircle } from 'lucide-react';

const PatientInput = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Data
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    
    // Cancer Details
    cancerType: '',
    stage: '',
    diagnosisDate: '',
    
    // Symptoms
    symptoms: [] as string[],
    otherSymptoms: '',
    
    // Medical History
    familyHistory: '',
    allergies: '',
    previousTreatment: '',
    
    // Lab Results
    labResults: {
      ca125: '',
      psa: '',
      cea: '',
      other: ''
    },
    
    // Files
    uploadedFiles: [] as File[]
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const cancerTypes = [
    'Kanker Payudara',
    'Kanker Paru-paru',
    'Kanker Prostat',
    'Kanker Serviks',
    'Kanker Kolorektal',
    'Kanker Darah (Leukemia)',
    'Kanker Hati',
    'Kanker Lambung',
    'Lainnya'
  ];

  const stages = ['Stadium I', 'Stadium II', 'Stadium III', 'Stadium IV'];

  const commonSymptoms = [
    'Benjolan atau massa abnormal',
    'Penurunan berat badan drastis',
    'Kelelahan kronis',
    'Demam berkepanjangan',
    'Nyeri yang tidak kunjung hilang',
    'Perubahan pada kulit',
    'Batuk kronis',
    'Kesulitan menelan',
    'Perdarahan abnormal',
    'Perubahan kebiasaan buang air'
  ];

  const handleSymptomChange = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form Data:', formData);
    toast({
      title: "Data berhasil disimpan!",
      description: "Informasi pasien telah tersimpan dengan aman. Tim medis akan menghubungi Anda segera.",
    });
    
    // Reset form or redirect
    setCurrentStep(1);
    setFormData({
      fullName: '', age: '', gender: '', phone: '', email: '',
      cancerType: '', stage: '', diagnosisDate: '',
      symptoms: [], otherSymptoms: '',
      familyHistory: '', allergies: '', previousTreatment: '',
      labResults: { ca125: '', psa: '', cea: '', other: '' },
      uploadedFiles: []
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Data Pribadi
              </CardTitle>
              <CardDescription>
                Masukkan informasi pribadi Anda dengan lengkap dan akurat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Usia *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Masukkan usia"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Jenis Kelamin *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Detail Kanker
              </CardTitle>
              <CardDescription>
                Informasi spesifik mengenai diagnosa kanker Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Kanker *</Label>
                <Select value={formData.cancerType} onValueChange={(value) => setFormData(prev => ({ ...prev, cancerType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kanker" />
                  </SelectTrigger>
                  <SelectContent>
                    {cancerTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stadium Kanker</Label>
                  <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih stadium" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosisDate">Tanggal Diagnosa</Label>
                  <Input
                    id="diagnosisDate"
                    type="date"
                    value={formData.diagnosisDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, diagnosisDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Gejala yang Dirasakan</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomChange(symptom)}
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherSymptoms">Gejala Lainnya</Label>
                  <Textarea
                    id="otherSymptoms"
                    value={formData.otherSymptoms}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherSymptoms: e.target.value }))}
                    placeholder="Jelaskan gejala lain yang tidak tercantum di atas..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Riwayat Medis
              </CardTitle>
              <CardDescription>
                Informasi riwayat kesehatan dan pengobatan sebelumnya
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="familyHistory">Riwayat Kanker dalam Keluarga</Label>
                <Textarea
                  id="familyHistory"
                  value={formData.familyHistory}
                  onChange={(e) => setFormData(prev => ({ ...prev, familyHistory: e.target.value }))}
                  placeholder="Jelaskan riwayat kanker pada keluarga (orangtua, saudara, dll)..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Alergi Obat/Makanan</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="Jelaskan alergi yang Anda miliki..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousTreatment">Pengobatan Sebelumnya</Label>
                <Textarea
                  id="previousTreatment"
                  value={formData.previousTreatment}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousTreatment: e.target.value }))}
                  placeholder="Jelaskan pengobatan yang pernah dilakukan (kemoterapi, radiasi, operasi, dll)..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <Label>Hasil Laboratorium Terbaru</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ca125">CA-125 (U/ml)</Label>
                    <Input
                      id="ca125"
                      value={formData.labResults.ca125}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        labResults: { ...prev.labResults, ca125: e.target.value }
                      }))}
                      placeholder="Contoh: 35"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="psa">PSA (ng/ml)</Label>
                    <Input
                      id="psa"
                      value={formData.labResults.psa}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        labResults: { ...prev.labResults, psa: e.target.value }
                      }))}
                      placeholder="Contoh: 4.0"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cea">CEA (ng/ml)</Label>
                    <Input
                      id="cea"
                      value={formData.labResults.cea}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        labResults: { ...prev.labResults, cea: e.target.value }
                      }))}
                      placeholder="Contoh: 3.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherLab">Marker Lainnya</Label>
                    <Input
                      id="otherLab"
                      value={formData.labResults.other}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        labResults: { ...prev.labResults, other: e.target.value }
                      }))}
                      placeholder="Contoh: AFP: 10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Dokumen & Review
              </CardTitle>
              <CardDescription>
                Upload hasil radiologi dan review semua informasi sebelum mengirim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Upload Hasil Radiologi/Lab (Opsional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Drag & drop file atau klik untuk upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Format: PDF, JPG, PNG (Max: 10MB per file)
                    </p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="mt-4">
                      Pilih File
                    </Button>
                  </Label>
                </div>
                
                {formData.uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>File yang diupload:</Label>
                    {formData.uploadedFiles.map((file, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Summary */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Review Informasi</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Nama:</span> {formData.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Usia:</span> {formData.age} tahun
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Jenis Kanker:</span> {formData.cancerType}
                    </div>
                    <div>
                      <span className="font-medium">Stadium:</span> {formData.stage}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Gejala:</span> {formData.symptoms.length} gejala dipilih
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <CheckCircle className="inline h-4 w-4 mr-2" />
                  Semua data akan dienkripsi dan disimpan dengan aman. Tim medis akan menghubungi Anda dalam 1x24 jam.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Input Data Pasien</h1>
          <p className="text-lg text-muted-foreground">
            Masukkan informasi lengkap untuk monitoring kondisi kesehatan Anda
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Langkah {currentStep} dari {totalSteps}</span>
            <span>{Math.round(progress)}% selesai</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sebelumnya
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Lanjutkan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-medical-green hover:bg-medical-green/90">
              <CheckCircle className="mr-2 h-4 w-4" />
              Kirim Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInput;
