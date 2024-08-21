// src/utils/storage.js
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};


export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const removeCID = () => {
  localStorage.removeItem('CustID');
};


export const removecartID = () => {
  localStorage.removeItem('cartID');
};


export const removeorderID = () => {
  localStorage.removeItem('OrderId');
};