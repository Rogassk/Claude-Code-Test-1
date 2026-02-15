export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return null;
}
