export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isOTPExpired = (timestamp: Date): boolean => {
  const OTP_EXPIRY_MINUTES = 10;
  const now = new Date();
  const diffInMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);
  return diffInMinutes > OTP_EXPIRY_MINUTES;
};
