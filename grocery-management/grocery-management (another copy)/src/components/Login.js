import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { saveToken } from '../utils/storage';

const Login = () => {
    const [Email, setEmail] = useState('alice@example.com');
    const [Password, setPassword] = useState('hashedpassword3');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Perform the login operation
            const response = await login({ Email, Password });
            saveToken(response.jwttoken);

            const getAuthHeader = () => {
                const token = response.jwttoken;
                console.log(token); // Get the token from local storage
                return {
                    headers: {
                        token: `${token}`,
                    },
                };
            };
            

            // Store the CustomerID in localStorage
            const customerID = response.custID;
            localStorage.setItem('CustID', customerID);

            // Check if a cart exists for the customer
            const cartResponse = await axios.get(`http://localhost:9999/customer/cart/${customerID}`,getAuthHeader());
            console.log('Cart Check Response:', cartResponse);

            let cartID;

            if (cartResponse.data.length > 0) {
                // If cart exists, get the CartID
                cartID = cartResponse.data[0].CartID;
            } else {
                // If cart doesn't exist, create a new cart
                const createCartResponse = await axios.post(`http://localhost:9999/customer/cart/`, { CustomerID: customerID },getAuthHeader());
                console.log('Create Cart Response:', createCartResponse);

                // Fetch the newly created CartID
                const newCartResponse = await axios.get(`http://localhost:9999/customer/cart/${customerID}`,getAuthHeader());
                cartID = newCartResponse.data[0].CartID;
            }

            // Store the CartID in localStorage
            localStorage.setItem('cartID', cartID);

            // Navigate to the products page
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input 
                        type="email" 
                        value={Email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={styles.input}
                    />
                </div>  
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password:</label>
                    <input 
                        type="password" 
                        value={Password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <button onClick={() => navigate('/register')} style={styles.registerButton}>
                Register Here
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        width: '300px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '1rem',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '8px',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    registerButton: {
        marginTop: '10px',
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        fontSize: '1rem',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default Login;
