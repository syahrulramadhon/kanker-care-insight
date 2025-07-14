import { z } from 'zod';

// Security utilities
export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Indonesian phone number validation
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password terlalu panjang')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  rememberMe: z.boolean().optional()
});

// Registration form validation schema
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama terlalu panjang')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang'),
  phone: z
    .string()
    .min(1, 'Nomor telepon harus diisi')
    .refine(validatePhone, 'Format nomor telepon tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password terlalu panjang')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, 'Anda harus menyetujui syarat dan ketentuan')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak sama",
  path: ["confirmPassword"],
});

// Patient input validation schema
export const patientInputSchema = z.object({
  // Personal Data
  fullName: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama terlalu panjang')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  age: z
    .string()
    .min(1, 'Usia harus diisi')
    .refine((val) => {
      const age = parseInt(val);
      return age >= 1 && age <= 150;
    }, 'Usia harus antara 1-150 tahun'),
  gender: z.enum(['laki-laki', 'perempuan'], {
    message: 'Jenis kelamin harus dipilih'
  }),
  phone: z
    .string()
    .min(1, 'Nomor telepon harus diisi')
    .refine(validatePhone, 'Format nomor telepon tidak valid'),
  email: z
    .string()
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .optional()
    .or(z.literal('')),
  
  // Cancer Details
  cancerType: z
    .string()
    .min(1, 'Jenis kanker harus dipilih'),
  stage: z
    .string()
    .optional(),
  diagnosisDate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, 'Tanggal diagnosa tidak boleh di masa depan'),
  
  // Symptoms
  symptoms: z.array(z.string()).optional(),
  otherSymptoms: z
    .string()
    .max(1000, 'Deskripsi gejala terlalu panjang')
    .optional(),
  
  // Medical History
  familyHistory: z
    .string()
    .max(1000, 'Riwayat keluarga terlalu panjang')
    .optional(),
  allergies: z
    .string()
    .max(500, 'Deskripsi alergi terlalu panjang')
    .optional(),
  previousTreatment: z
    .string()
    .max(1000, 'Deskripsi pengobatan terlalu panjang')
    .optional(),
  
  // Lab Results
  labResults: z.object({
    ca125: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      }, 'Nilai CA-125 harus berupa angka positif'),
    psa: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      }, 'Nilai PSA harus berupa angka positif'),
    cea: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      }, 'Nilai CEA harus berupa angka positif'),
    other: z
      .string()
      .max(200, 'Deskripsi marker lainnya terlalu panjang')
      .optional()
  }).optional()
});

// File upload validation
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format file tidak didukung. Gunakan PDF, JPG, atau PNG'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu besar. Maksimal 10MB'
    };
  }
  
  return { isValid: true };
};

// Rate limiting utility (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, timeLeft);
  }
}

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PatientInputData = z.infer<typeof patientInputSchema>;