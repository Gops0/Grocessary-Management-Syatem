import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, Table } from 'react-bootstrap'; // Import Image from react-bootstrap
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:9999/admin/products/getProducts', {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    

    return (
        <>
           
           <AdminNavbar/>

            <div className="mt-5 p-4">
                <h2>Product List</h2>
                <Table striped bordered hover className='text-center'>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Image</th> {/* New column for images */}
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Units on Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.ProductID}>
                                <td>{product.ProductID}</td>
                                <td>
                                    <Image 
                                        src={`http://localhost:9999/admin/products/image/${product.ProductID}`} 
                                        alt={product.ProductName} 
                                        fluid 
                                        rounded 
                                        style={{ maxHeight: '100px', maxWidth: '100px' }} // Adjust size as needed
                                        loading="lazy" // Optional: to improve performance by lazy loading images
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/100'} // Placeholder image if error
                                    />
                                </td>
                                <td>{product.ProductName}</td>
                                <td>{product.CategoryName}</td>
                                <td>{product.UnitPrice}</td>
                                <td>{product.UnitsOnOrder}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default ProductList;
