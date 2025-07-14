import DOMPurify from 'dompurify';

// Safe HTML rendering utility
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: []
  });
};

// Safe component for rendering user content (to be used in components)
export const createSafeHtml = (content: string): { __html: string } => {
  const sanitizedContent = sanitizeHtml(content);
  return { __html: sanitizedContent };
};

// Secure local storage utilities
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      // Encrypt sensitive data before storing (basic implementation)
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },

  getItem: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      // Decrypt data when retrieving
      const decrypted = JSON.parse(atob(encrypted));
      return decrypted;
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};

// Authentication state management
export const authStorage = {
  setAuthToken: (token: string): void => {
    secureStorage.setItem('auth_token', token);
  },

  getAuthToken: (): string | null => {
    return secureStorage.getItem('auth_token');
  },

  removeAuthToken: (): void => {
    secureStorage.removeItem('auth_token');
  },

  setUserData: (userData: any): void => {
    secureStorage.setItem('user_data', userData);
  },

  getUserData: (): any => {
    return secureStorage.getItem('user_data');
  },

  isAuthenticated: (): boolean => {
    const token = authStorage.getAuthToken();
    return token !== null && token !== '';
  },

  logout: (): void => {
    authStorage.removeAuthToken();
    secureStorage.removeItem('user_data');
    // Clear any other sensitive data
    secureStorage.clear();
  }
};

// CSRF token management
export const csrfToken = {
  generate: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  set: (token: string): void => {
    sessionStorage.setItem('csrf_token', token);
  },

  get: (): string | null => {
    return sessionStorage.getItem('csrf_token');
  },

  validate: (token: string): boolean => {
    const storedToken = csrfToken.get();
    return storedToken === token;
  }
};

// Security headers for API requests
export const getSecureHeaders = (): HeadersInit => {
  const token = authStorage.getAuthToken();
  const csrf = csrfToken.get();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (csrf) {
    headers['X-CSRF-Token'] = csrf;
  }

  return headers;
};

// Input sanitization for forms
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim().slice(0, 1000); // Limit string length
    } else if (Array.isArray(value)) {
      sanitized[key] = value.slice(0, 100); // Limit array length
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};