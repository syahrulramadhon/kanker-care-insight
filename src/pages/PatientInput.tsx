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
import { patientInputSchema, validateFileUpload, sanitizeInput, type PatientInputData } from '@/lib/validation';
import { sanitizeFormData } from '@/lib/security';
import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '@/lib/firebase';


const PatientInput = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PatientInputData & { uploadedFiles: File[] }>({ // Perbarui type di sini
    // Personal Data
    fullName: '',
    age: '',
    gender: '', // Diperlukan inisialisasi awal yang sesuai dengan Select
    phone: '',
    email: '',

    // Cancer Details
    cancerType: '',
    stage: '',
    diagnosisDate: '',

    // Symptoms
    symptoms: [],
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

    // Files (Hanya untuk keperluan tampilan dan validasi di frontend)
    uploadedFiles: []
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;

    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // Clear error when user starts typing (if an error exists for this field)
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (
    field: keyof typeof formData.labResults,
    value: string
  ) => {
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      labResults: {
        ...prev.labResults,
        [field]: sanitizedValue,
      },
    }));

    const errorKey = `labResults.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    files.forEach(file => {
      const validation = validateFileUpload(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        toast({
          title: "File tidak valid",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
      }
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...validFiles]
      }));

      toast({
        title: "File berhasil diupload",
        description: `${validFiles.length} file berhasil ditambahkan`,
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    setErrors({});

    try {
      // Sanitize data first
      const sanitizedData = sanitizeFormData(formData);

      // Validate based on current step
      if (currentStep === 1) {
        // Validate personal data
        const personalData = {
          fullName: sanitizedData.fullName,
          age: sanitizedData.age,
          gender: sanitizedData.gender,
          phone: sanitizedData.phone,
          email: sanitizedData.email
        };

        const result = patientInputSchema.pick({
          fullName: true,
          age: true,
          gender: true,
          phone: true,
          email: true
        }).safeParse(personalData);

        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path[0]) {
              fieldErrors[issue.path[0] as string] = issue.message;
            }
          });
          setErrors(fieldErrors);
          return false;
        }
      } else if (currentStep === 2) {
        // Validate cancer details
        const cancerData = {
          cancerType: sanitizedData.cancerType,
          stage: sanitizedData.stage,
          diagnosisDate: sanitizedData.diagnosisDate,
          symptoms: sanitizedData.symptoms,
          otherSymptoms: sanitizedData.otherSymptoms
        };

        const result = patientInputSchema.pick({
          cancerType: true,
          stage: true,
          diagnosisDate: true,
          symptoms: true,
          otherSymptoms: true
        }).safeParse(cancerData);

        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path[0]) {
              fieldErrors[issue.path.join('.')] = issue.message; // Tangani nested path seperti labResults.ca125
            }
          });
          setErrors(fieldErrors);
          return false;
        }
      } else if (currentStep === 3) {
        // Validate medical history and lab results
        const medicalLabData = {
          familyHistory: sanitizedData.familyHistory,
          allergies: sanitizedData.allergies,
          previousTreatment: sanitizedData.previousTreatment,
          labResults: sanitizedData.labResults
        };

        const result = patientInputSchema.pick({
          familyHistory: true,
          allergies: true,
          previousTreatment: true,
          labResults: true
        }).safeParse(medicalLabData);

        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path[0]) {
              fieldErrors[issue.path.join('.')] = issue.message; // Tangani nested path seperti labResults.ca125
            }
          });
          setErrors(fieldErrors);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error during step validation:", error);
      toast({
        title: "Error validasi",
        description: "Terjadi kesalahan saat memvalidasi data",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!validateCurrentStep()) {
      // If validation fails, show toast error
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang wajib diisi dan perbaiki error.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => { // Tambahkan 'async' di sini
    setErrors({});

    try {
      // Final validation of all data
      const sanitizedData = sanitizeFormData(formData);
      const validationResult = patientInputSchema.safeParse(sanitizedData);

      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          const path = issue.path.join('.'); // Handle nested paths like 'labResults.ca125'
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);

        toast({
          title: "Data tidak valid",
          description: "Silakan periksa kembali data yang Anda masukkan",
          variant: "destructive",
        });

        // Go back to the first step with errors
        setCurrentStep(1);
        return;
      }

      // --- KIRIM DATA KE N8N WEBHOOK ---
      const n8nWebhookUrl = 'PASTE_WEBHOOK_URL_N8N_ANDA_DI_SINI'; // <--- PASTE URL WEBHOOK N8N ANDA DI SINI!

      // Siapkan data untuk dikirim ke n8n
      // Pastikan nama key di objek ini sama dengan yang Anda gunakan di n8n untuk ekspresi $json.nama_field
      const dataToSendToN8N = {
        fullName: validationResult.data.fullName,
        age: validationResult.data.age,
        gender: validationResult.data.gender,
        phone: validationResult.data.phone,
        email: validationResult.data.email,
        cancerType: validationResult.data.cancerType,
        stage: validationResult.data.stage,
        diagnosisDate: validationResult.data.diagnosisDate,
        // Mengubah array gejala menjadi string dipisahkan koma untuk Google Sheets
        symptoms: validationResult.data.symptoms.join(', '),
        otherSymptoms: validationResult.data.otherSymptoms,
        familyHistory: validationResult.data.familyHistory,
        allergies: validationResult.data.allergies,
        previousTreatment: validationResult.data.previousTreatment,
        // Field labResults
        ca125: validationResult.data.labResults.ca125,
        psa: validationResult.data.labResults.psa,
        cea: validationResult.data.labResults.cea,
        otherLabMarker: validationResult.data.labResults.other, // Nama field yang jelas
        // Hanya mengirim nama file, bukan data file itu sendiri via JSON Webhook
        uploadedFileNames: formData.uploadedFiles.map(file => file.name).join(', '),
        submittedAt: new Date().toISOString() // Timestamp saat submit
      };

      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST', // Gunakan POST untuk mengirim data baru
          headers: {
            'Content-Type': 'application/json', // Beri tahu server bahwa body adalah JSON
          },
          body: JSON.stringify(dataToSendToN8N), // Konversi objek JavaScript ke string JSON
        });

        if (n8nResponse.ok) { // Status 200-299 berarti sukses
          console.log('Data pasien berhasil dikirim ke n8n!');
          toast({
            title: "Data berhasil dikirim ke Google Sheets!",
            description: "Informasi pasien telah disimpan via n8n.",
          });
        } else {
          console.error("Gagal mengirim data ke n8n:", n8nResponse.status, n8nResponse.statusText);
          toast({
            title: "Gagal mengirim data ke Google Sheets",
            description: "Terjadi kesalahan saat mengirim ke n8n. Cek konsol untuk detail.",
            variant: "destructive",
          });
        }
      } catch (n8nError) {
        console.error("Error saat koneksi ke n8n:", n8nError);
        toast({
          title: "Error koneksi",
          description: "Tidak dapat menghubungi layanan otomatisasi (n8n). Coba lagi.",
          variant: "destructive",
        });
      }

      // --- KIRIM DATA KE FIREBASE (Opsional, jika Anda masih ingin menyimpannya di sana) ---
      const db = getDatabase(app);
      const pasienRef = ref(db, 'patients'); // folder `patients` di database
      const newPatientRef = push(pasienRef);

      set(newPatientRef, {
        ...validationResult.data, // Menggunakan data asli dari validationResult
        submittedAt: new Date().toISOString(),
        // Jika Anda ingin menyertakan nama file di Firebase juga
        uploadedFileNames: formData.uploadedFiles.map(file => file.name)
      })
        .then(() => {
          toast({
            title: "Data berhasil dikirim ke Firebase!",
            description: "Informasi Anda telah disimpan dengan aman di Firebase.",
          });
        })
        .catch((error) => {
          console.error("Firebase error:", error);
          toast({
            title: "Gagal mengirim data ke Firebase",
            description: "Terjadi kesalahan saat menyimpan ke Firebase.",
            variant: "destructive",
          });
        });

      // Reset form setelah semua pengiriman berhasil (atau setidaknya dicoba)
      setCurrentStep(1);
      setFormData({
        fullName: '', age: '', gender: '' as 'laki-laki' | 'perempuan' | '', phone: '', email: '',
        cancerType: '', stage: '', diagnosisDate: '',
        symptoms: [], otherSymptoms: '',
        familyHistory: '', allergies: '', previousTreatment: '',
        labResults: { ca125: '', psa: '', cea: '', other: '' },
        uploadedFiles: []
      });
      setErrors({});

    } catch (error) {
      console.error("Unhandled error during form submission:", error);
      toast({
        title: "Error Umum",
        description: "Terjadi kesalahan tak terduga saat menyimpan data. Silakan coba lagi.",
        variant: "destructive",
      });
    }
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
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className={errors.fullName ? 'border-destructive' : ''}
                    required
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Usia *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Masukkan usia"
                    className={errors.age ? 'border-destructive' : ''}
                    required
                  />
                  {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Jenis Kelamin *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={errors.phone ? 'border-destructive' : ''}
                    required
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)} // Gunakan handleInputChange
                    placeholder="nama@email.com"
                    className={errors.email ? 'border-destructive' : ''} // Tambahkan pengecekan error
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
                <Select value={formData.cancerType} onValueChange={(value) => handleInputChange('cancerType', value)}>
                  <SelectTrigger className={errors.cancerType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih jenis kanker" />
                  </SelectTrigger>
                  <SelectContent>
                    {cancerTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cancerType && <p className="text-sm text-destructive">{errors.cancerType}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stadium Kanker *</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                    <SelectTrigger className={errors.stage ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Pilih stadium" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stage && <p className="text-sm text-destructive">{errors.stage}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosisDate">Tanggal Diagnosa *</Label>
                  <Input
                    id="diagnosisDate"
                    type="date"
                    value={formData.diagnosisDate}
                    onChange={(e) => handleInputChange('diagnosisDate', e.target.value)}
                    className={errors.diagnosisDate ? 'border-destructive' : ''}
                    required
                  />
                  {errors.diagnosisDate && <p className="text-sm text-destructive">{errors.diagnosisDate}</p>}
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
                    onChange={(e) => handleInputChange('otherSymptoms', e.target.value)}
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
                  onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                  placeholder="Jelaskan riwayat kanker pada keluarga (orangtua, saudara, dll)..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Alergi Obat/Makanan</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="Jelaskan alergi yang Anda miliki..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousTreatment">Pengobatan Sebelumnya</Label>
                <Textarea
                  id="previousTreatment"
                  value={formData.previousTreatment}
                  onChange={(e) => handleInputChange('previousTreatment', e.target.value)}
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
                      onChange={(e) => handleNestedInputChange('ca125', e.target.value)}
                      placeholder="Contoh: 35"
                      className={errors['labResults.ca125'] ? 'border-destructive' : ''}
                    />
                    {errors['labResults.ca125'] && <p className="text-sm text-destructive">{errors['labResults.ca125']}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="psa">PSA (ng/ml)</Label>
                    <Input
                      id="psa"
                      value={formData.labResults.psa}
                      onChange={(e) => handleNestedInputChange('psa', e.target.value)}
                      placeholder="Contoh: 4.0"
                      className={errors['labResults.psa'] ? 'border-destructive' : ''}
                    />
                    {errors['labResults.psa'] && <p className="text-sm text-destructive">{errors['labResults.psa']}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cea">CEA (ng/ml)</Label>
                    <Input
                      id="cea"
                      value={formData.labResults.cea}
                      onChange={(e) => handleNestedInputChange('cea', e.target.value)}
                      placeholder="Contoh: 3.0"
                      className={errors['labResults.cea'] ? 'border-destructive' : ''}
                    />
                    {errors['labResults.cea'] && <p className="text-sm text-destructive">{errors['labResults.cea']}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherLab">Marker Lainnya</Label>
                    <Input
                      id="otherLab"
                      value={formData.labResults.other}
                      onChange={(e) => handleNestedInputChange('other', e.target.value)} // Pastikan ini 'other'
                      placeholder="Contoh: AFP: 10"
                      className={errors['labResults.other'] ? 'border-destructive' : ''}
                    />
                    {errors['labResults.other'] && <p className="text-sm text-destructive">{errors['labResults.other']}</p>}
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
                      <span className="font-medium">Jenis Kelamin:</span> {formData.gender || '-'}
                    </div>
                    <div>
                      <span className="font-medium">No. Telepon:</span> {formData.phone || '-'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Email:</span> {formData.email || '-'}
                    </div>
                    <div>
                      <span className="font-medium">Jenis Kanker:</span> {formData.cancerType || '-'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Stadium:</span> {formData.stage || '-'}
                    </div>
                    <div>
                      <span className="font-medium">Tanggal Diagnosa:</span> {formData.diagnosisDate || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Gejala:</span> {formData.symptoms.length > 0 ? formData.symptoms.join(', ') : '-'}
                  </div>
                  {formData.otherSymptoms && (
                    <div>
                      <span className="font-medium">Gejala Lainnya:</span> {formData.otherSymptoms}
                    </div>
                  )}
                  {formData.familyHistory && (
                    <div>
                      <span className="font-medium">Riwayat Kanker Keluarga:</span> {formData.familyHistory}
                    </div>
                  )}
                  {formData.allergies && (
                    <div>
                      <span className="font-medium">Alergi:</span> {formData.allergies}
                    </div>
                  )}
                  {formData.previousTreatment && (
                    <div>
                      <span className="font-medium">Pengobatan Sebelumnya:</span> {formData.previousTreatment}
                    </div>
                  )}
                  {/* Review Lab Results */}
                  {(formData.labResults.ca125 || formData.labResults.psa || formData.labResults.cea || formData.labResults.other) && (
                    <div className="pt-2">
                      <span className="font-medium">Hasil Lab:</span>
                      <ul className="list-disc list-inside ml-4">
                        {formData.labResults.ca125 && <li>CA-125: {formData.labResults.ca125} U/ml</li>}
                        {formData.labResults.psa && <li>PSA: {formData.labResults.psa} ng/ml</li>}
                        {formData.labResults.cea && <li>CEA: {formData.labResults.cea} ng/ml</li>}
                        {formData.labResults.other && <li>Lainnya: {formData.labResults.other}</li>}
                      </ul>
                    </div>
                  )}
                  {formData.uploadedFiles.length > 0 && (
                    <div>
                      <span className="font-medium">File Uploaded:</span> {formData.uploadedFiles.map(file => file.name).join(', ')}
                    </div>
                  )}
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