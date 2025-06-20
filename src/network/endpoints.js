export const API_BASE_URL = "https://ac9f-2405-201-2046-c80d-f6dc-fbe4-3af2-659c.ngrok-free.app";
export const MEDIA_URL = "https://nmp-storage.s3.ap-south-1.amazonaws.com";


export const ApiEndPoints = {
  AUTH: {
    login: `${API_BASE_URL}/api/v1/admin/auth/login`,
    me: `${API_BASE_URL}/api/v1/admin/auth/me`,
    forgot: `${API_BASE_URL}/api/v1/admin/auth/forgot/password`,
    verifyotp: `${API_BASE_URL}/api/v1/admin/auth/verify/otp`,
    reset: `${API_BASE_URL}/api/v1/admin/auth/reset/password`,
    resendotp: `${API_BASE_URL}/api/v1/admin/auth/resend/otp`,
  },
  DASHBOARD: {
    count: `${API_BASE_URL}/api/v1/admin/website/dashboard`,
  },
  BANNER: {
    list: `${API_BASE_URL}/api/admin/banner`,
    edit: (id) => `${API_BASE_URL}/api/admin/banner/${id}`,
  }

};
