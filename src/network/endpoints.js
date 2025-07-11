// export const API_BASE_URL = "http://45.248.33.161:5019/";
export const MEDIA_URL = "https://nmp-storage.s3.ap-south-1.amazonaws.com";
export const API_BASE_URL = "http://192.168.29.37:3030/";



export const ApiEndPoints = {
  AUTH: {
    login: `${API_BASE_URL}api/v1/admin/auth/login`,
    me: `${API_BASE_URL}api/v1/admin/auth/me`,
    forgot: `${API_BASE_URL}api/v1/admin/auth/forgot/password`,
    verifyotp: `${API_BASE_URL}api/v1/admin/auth/verify/otp`,
    reset: `${API_BASE_URL}api/v1/admin/auth/reset/password`,
    resendotp: `${API_BASE_URL}api/v1/admin/auth/resend/otp`,
  },
  DASHBOARD: {
    count: `${API_BASE_URL}api/v1/admin/website/dashboard`,
  },
  BANNER: {
    list: `${API_BASE_URL}api/admin/banner`,
    edit: (id) => `${API_BASE_URL}api/admin/banner/${id}`,
  },
  LEGAL_CONTENT:{
    list:(type) => `${API_BASE_URL}api/v1/admin/legalcontent/${type}`,
    edit:(type) => `${API_BASE_URL}api/v1/admin/legalcontent/${type}`,
  },
  USERS:{
    list: `${API_BASE_URL}api/v1/admin/user-list`,
    delete:(id) =>`${API_BASE_URL}api/v1/admin/user-list/${id}`,
  },
  PRODUCT: {
    list: `${API_BASE_URL}api/v1/admin/product`,
    edit:(id) => `${API_BASE_URL}api/v1/admin/product/${id}`,
    delete:(id) => `${API_BASE_URL}api/v1/admin/product/${id}`,
  },
};
