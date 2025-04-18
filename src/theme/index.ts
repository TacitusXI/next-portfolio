export interface Theme {
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  cardBackground: string;
  codeBackground: string;
}

export const darkTheme: Theme = {
  background: '#080808',
  backgroundSecondary: '#101010',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  border: '#222222',
  primary: '#00ff00', // Matrix green
  secondary: '#0575e6',
  accent: '#00f260',
  success: '#00ff00',
  warning: '#ffcc00',
  error: '#ff0033',
  cardBackground: '#121212',
  codeBackground: '#1a1a1a',
};

export const lightTheme: Theme = {
  background: '#f8f9fa',
  backgroundSecondary: '#ffffff',
  text: '#212529',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  primary: '#0d6efd',
  secondary: '#6c757d',
  accent: '#0dcaf0',
  success: '#198754',
  warning: '#ffc107',
  error: '#dc3545',
  cardBackground: '#ffffff',
  codeBackground: '#f1f3f5',
}; 