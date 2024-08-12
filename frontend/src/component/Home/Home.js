import React, { useEffect } from 'react';
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from '../layout/MetaData.js';
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../actions/productActions.js';
import Loader from '../layout/Loader/Loader.js';
import { useAlert } from 'react-alert';

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector(state => state.products)
  const alert = useAlert();
  useEffect(() => {
    if(error){
      return alert.error(error);
    }
    dispatch(getProducts());
  }, [dispatch,error, alert]);
  return (
    <>
      {loading ? <Loader/> :
        <>
          <MetaData title="ECOMMERCE" />
          <div className='banner'>
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href='#card'>
              <button>Shop Now</button>
            </a>
          </div>

          <div id='card'><h2 className='homeHeading'>Featured Products</h2>
          <div className='container' id='container'>
            {products && products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          </div>
        </>
      }
    </>
  )
}

export default Home
