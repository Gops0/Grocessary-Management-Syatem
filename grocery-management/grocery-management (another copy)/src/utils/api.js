// src/utils/api.js
import axios from 'axios';
import { getToken } from './storage';


const API_BASE_URL = 'http://localhost:9999'; // Replace with your actual backend URL



const apiClient = axios.create({
    baseURL: 'http://localhost:9999', // Adjust this to your API base URL
    headers: {
        token: `${getToken()}`,
    },
});

export const login = async (credentials) => {
    const { data } = await apiClient.post('/customer/signin', credentials);
    //console.log(data);
    return data;
};

export const register = async (userData) => {
    await apiClient.post('/customer/signup', userData);
};

// // export const getProducts = async () => {
// //     const { data } = await apiClient.get('/products');
// //     return data;
// // };

// // export const addToCart = async (productId) => {
// //     await apiClient.post(`/cart/add/${productId}`);
// // };

// // export const getCartItems = async () => {
// //     const { data } = await apiClient.get('/cart');
// //     return data;
// // };

export const updateCartItem = async (itemId, quantity) => {
    await apiClient.put(`/cart/update/${itemId}`, { quantity });
};

export const removeCartItem = async (itemId) => {
    await apiClient.delete(`/customer/cartitems/delete/single/${itemId}`);
};

// // export const placeOrder = async (orderDetails) => {
// //     await apiClient.post('/orders', { orderDetails });
// // };



// const API_BASE_URL = 'http://localhost:9999'; // Replace with your actual backend URL

// // Admin Authentication
// export const adminSignIn = (credentials) => axios.post(`${API_BASE_URL}/admin/signin`, credentials);
// export const adminSignUp = (data) => axios.post(`${API_BASE_URL}/admin/signup`, data);

// // Customer Authentication
// export const customerSignIn = (credentials) => axios.post(`${API_BASE_URL}/customer/signin`, credentials);
// export const customerSignUp = (data) => axios.post(`${API_BASE_URL}/customer/signup`, data);

// // Categories
// export const getCategories = () => axios.get(`${API_BASE_URL}/admin/categories`);
// export const addCategory = (data) => axios.post(`${API_BASE_URL}/admin/categories/add`, data);
// export const deleteCategory = (id) => axios.delete(`${API_BASE_URL}/admin/categories/delete/${id}`);

// // Products
// export const getProducts = () => axios.get(`${API_BASE_URL}/admin/products/getProducts`);
// export const addProduct = (data) => axios.post(`${API_BASE_URL}/admin/products/add`, data);
// export const getProductImage = (productId) => axios.get(`${API_BASE_URL}/admin/products/image/${productId}`, { responseType: 'blob' });

// // Cart
// export const getCart = () => axios.get(`${API_BASE_URL}/customer/cart`);
// export const addToCart = (data) => axios.post(`${API_BASE_URL}/customer/cart`, data);
// export const deleteCartItem = (id) => axios.delete(`${API_BASE_URL}/customer/cart/${id}`);

// CartItems


export const getCartItems = (customerId) => axios.get(`${API_BASE_URL}/customer/cartitems/all/${customerId}`, getAuthHeader());
export const addCartItem = (cartId, productId) => axios.post(`${API_BASE_URL}/customer/cartitems/add/${cartId}/${productId}`,{ Quantity: 1 },getAuthHeader());
export const deleteCartItemById = (id) => axios.delete(`${API_BASE_URL}/customer/cartitems/delete/${id}`);

// // Orders
// export const getOrders = (customerId) => axios.get(`${API_BASE_URL}/customer/orders/all/${customerId}`);
// export const placeOrder = (customerId, data) => axios.post(`${API_BASE_URL}/customer/orders/addorder/${customerId}`, data);







// Function to get the authorization header with the JWT token
const getAuthHeader = () => {
    const token = getToken();
    console.log(token); // Get the token from local storage
    return {
        headers: {
            token: `${token}`,
        },
    };
};


// Customer Authentication
export const customerSignIn = (credentials) => axios.post(`${API_BASE_URL}/customer/signin`, credentials);
export const customerSignUp = (data) => axios.post(`${API_BASE_URL}/customer/signup`, data);


// Products
export const getProducts = () => axios.get(`${API_BASE_URL}/customer/getProducts`, getAuthHeader());
export const addProduct = (data) => axios.post(`${API_BASE_URL}/customer/products/add`, data, getAuthHeader());
export const getProductImage = (productId) => axios.get(`${API_BASE_URL}/customer/image/${productId}`, { 
    ...getAuthHeader(), 
    responseType: 'blob' 
});

// Cart
// export const getCart = () => axios.get(`${API_BASE_URL}/customer/cart`, getAuthHeader());
// export const addToCart = (data) => axios.post(`${API_BASE_URL}/customer/cart`, data, getAuthHeader());
// export const deleteCartItem = (id) => axios.delete(`${API_BASE_URL}/customer/cart/${id}`, getAuthHeader());

// // CartItems
// export const getCartItems = (customerId) => axios.get(`${API_BASE_URL}/customer/cartitems/all/${customerId}`, getAuthHeader());
//export const addCartItem = (cartId, productId, quantity) => axios.post(`${API_BASE_URL}/customer/cartitems/add/${cartId}/${productId}`, { Quantity: quantity }, getAuthHeader());
// export const deleteCartItemById = (id) => axios.delete(`${API_BASE_URL}/customer/cartitems/delete/${id}`, getAuthHeader());

// Orders
export const getOrders = (customerId) => axios.get(`${API_BASE_URL}/customer/orders/all/${customerId}`, getAuthHeader());
export const placeOrder = (customerId, data) => axios.post(`${API_BASE_URL}/customer/orders/addorder/${customerId}`, data, getAuthHeader());