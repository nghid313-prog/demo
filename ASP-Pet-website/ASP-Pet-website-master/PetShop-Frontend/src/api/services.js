import api from './axios';

export const authApi = {
    login: (credentials) => api.post('/Authenticate/login', credentials),
    register: (userData) => api.post('/Authenticate/register', userData),
    registerAdmin: (userData) => api.post('/Authenticate/register-admin', userData),
    // verify removed - no email verification needed
    getInfo: () => api.get('/Authenticate/info'),
};

export const dogItemsApi = {
    getAllItems: () => api.get('/DogItems/get-all'),
    getItemById: (id) => api.get(`/DogItems/get-dog/${id}`),
    getAllSpecies: () => api.get('/DogItems/get-all-species'),
    getItemsBySpecies: (specieId) => api.get(`/DogItems/get-dog-by-specie/${specieId}`),
};

export const dogProductsApi = {
    getAllProducts: () => api.get('/DogProductItem/get-all-dog-product-item'),
    getProductById: (id) => api.get(`/DogProductItem/get-dog-product-item/${id}`),
};

export const checkoutApi = {
    createOrder: (orderData) => api.post('/Checkout/create', orderData),
    getVouchers: () => api.get('/Voucher/list'),
    getOrdersByUser: (userId) => api.get(`/Checkout/list/${userId}`),
    getOrderDetail: (orderId) => api.get(`/Checkout/get-detail/${orderId}`),
};

