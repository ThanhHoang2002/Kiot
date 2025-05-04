export const isPhoneNumber = (text: string) => {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(text.trim());
};
