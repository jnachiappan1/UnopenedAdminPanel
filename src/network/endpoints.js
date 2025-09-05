export const API_BASE_URL = "http://45.248.33.161:5019/";
export const MEDIA_URL = "http://45.248.33.161:9000/unoppened/";
// export const API_BASE_URL = "http://192.168.29.37:3030/";

export const ApiEndPoints = {
  AUTH: {
    login: `${API_BASE_URL}api/v1/admin/auth/login`,
    me: `${API_BASE_URL}api/v1/admin/auth/me`,
    forgot: `${API_BASE_URL}api/v1/admin/auth/forgot/password`,
    verifyotp: `${API_BASE_URL}api/v1/admin/auth/verify/otp`,
    reset: `${API_BASE_URL}api/v1/admin/auth/reset/password`,
    resendotp: (type) => `${API_BASE_URL}api/v1/admin/auth/resend/otp/${type}`,
  },
  DASHBOARD: {
    count: `${API_BASE_URL}api/v1/admin/dashboard/count`,
  },
  LEGAL_CONTENT: {
    list: (type) => `${API_BASE_URL}api/v1/admin/legalcontent/${type}`,
    edit: (type) => `${API_BASE_URL}api/v1/admin/legalcontent/${type}`,
  },
  CONTACT_US: {
    list: `${API_BASE_URL}api/v1/admin/contact-us`,
    respond: (id) => `${API_BASE_URL}api/v1/admin/contact-us/${id}`,
  },
  USERS: {
    list: `${API_BASE_URL}api/v1/admin/user-list`,
    getById: (id) => `${API_BASE_URL}api/v1/admin/user-list/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/user-list/${id}`,
  },
  ROLE: {
    list: `${API_BASE_URL}api/v1/admin/role`,
    getById: (id) => `${API_BASE_URL}api/v1/admin/role/${id}`,
    dropdown: `${API_BASE_URL}api/v1/admin/role/view-all`,
    add: `${API_BASE_URL}api/v1/admin/role`,
    update: (id) => `${API_BASE_URL}api/v1/admin/role/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/role/${id}`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/role/${id}`,
  },
  PERMISSION: {
    list: `${API_BASE_URL}api/v1/admin/permission`,
    create: `${API_BASE_URL}api/v1/admin/permission`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/permission/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/permission/${id}`,
  },
  SUB_ADMIN: {
    list: `${API_BASE_URL}api/v1/admin/sub-admin`,
    create: `${API_BASE_URL}api/v1/admin/sub-admin`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/sub-admin/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/sub-admin/${id}`,
  },
  PRODUCT: {
    list: `${API_BASE_URL}api/v1/admin/product`,
    create: `${API_BASE_URL}api/v1/product`,
    getById: (id) => `${API_BASE_URL}api/v1/admin/product/${id}`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/product/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/product/${id}`,
  },
  PRODUCT_PRICE: {
    list: `${API_BASE_URL}api/v1/admin/product-price`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/product-price/${id}`,
  },
  PRODUCT_PRICE_CHARGES: {
    list: `${API_BASE_URL}api/v1/admin/product-price-charge`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/product-price-charge/${id}`,
  },
  CATEGORY: {
    list: `${API_BASE_URL}api/v1/admin/category`,
    create: `${API_BASE_URL}api/v1/admin/category`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/category/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/category/${id}`,
  },
  COUPON: {
    list: `${API_BASE_URL}api/v1/admin/coupon/all`,
    getById: (id) => `${API_BASE_URL}api/v1/admin/coupon/${id}`,
    create: `${API_BASE_URL}api/v1/admin/coupon/create`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/coupon/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/coupon/${id}`,
  },
  CASHOUT_FEES: {
    list: `${API_BASE_URL}api/v1/admin/cashout-fees`,
    edit: (id) => `${API_BASE_URL}api/v1/admin/cashout-fees/${id}`,
  },
  TRANSACTION: {
    list: `${API_BASE_URL}api/v1/admin/transaction`,
    getById: (id) => `${API_BASE_URL}api/v1/admin/transaction/${id}`,
    delete: (id) => `${API_BASE_URL}api/v1/admin/transaction/${id}`,
  },
};
