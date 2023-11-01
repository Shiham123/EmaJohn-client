import React, { useEffect, useState } from 'react';
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from '../../utilities/fakedb';

import Cart from '../Cart/Cart';
import Product from '../Product/Product';

import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState([]);
  const cart = useLoaderData();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const loaderData = useLoaderData();
  // const { count } = loaderData;
  // const count = 76;
  const numberOfPage = Math.ceil(count / itemPerPage);

  const pages = [...Array(numberOfPage).keys()];

  useEffect(() => {
    fetch('http://localhost:5000/productsCount')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCount(data.count);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${currentPage}&size=${itemPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log(error));
  }, [currentPage, itemPerPage]);

  // useEffect(() => {
  //   const storedCart = getShoppingCart();
  //   const savedCart = [];
  //   // step 1: get id of the addedProduct
  //   for (const id in storedCart) {
  //     // step 2: get product from products state by using id
  //     const addedProduct = products.find((product) => product._id === id);
  //     if (addedProduct) {
  //       // step 3: add quantity
  //       const quantity = storedCart[id];
  //       addedProduct.quantity = quantity;
  //       // step 4: add the added product to the saved cart
  //       savedCart.push(addedProduct);
  //     }
  //     // console.log('added Product', addedProduct)
  //   }
  //   // step 5: set the cart
  //   setCart(savedCart);
  // }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleItemChange = (event) => {
    const value = parseInt(event.target.value);
    setItemPerPage(value);
    setCurrentPage(0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>

      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage}>Previous</button>
        {pages.map((item, index) => {
          return (
            <button
              className={currentPage === item ? 'selected' : ''}
              onClick={() => setCurrentPage(item)}
              key={index}
            >
              {item}
            </button>
          );
        })}
        <button onClick={handleNextPage}>Next</button>
        <p>current page : {currentPage}</p>
        <select value={itemPerPage} onChange={handleItemChange} name="select">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
