export function isValidEmail(emailValue: string): boolean {
  if (!emailValue.trim()) return false;
  return emailValue.includes('@') && emailValue.endsWith('.com');
};

export const isValidPassword = (passwordValue: string): boolean => {
  return passwordValue.length >= 6;
};