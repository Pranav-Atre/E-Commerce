import React, { useEffect, useState } from 'react'
import Loader from '../layout/Loader/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../actions/productActions';
import ProductCard from '../Home/ProductCard';
import Pagination from 'react-js-pagination';
import './Products.css';
import Slider from '@material-ui/core/Slider';
import { Typography } from '@material-ui/core';
import MetaData from '../layout/MetaData';

const categories = [
  "Laptop",
  "Mobile",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = ({ match }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 30000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
  }
  const setPageNo = (e) => {
    setCurrentPage(e);
  }
  const { products, loading, productCount, resultPerPage, filteredProducts } = useSelector(state => state.products);
  const keyword = match.params.keyword;
  useEffect(() => {
    dispatch(getProducts(keyword, currentPage, price, category, ratings))
  }, [dispatch, keyword, currentPage, price, category, ratings])
  return (
    <>
      {loading ? <Loader /> :
        <>
          <MetaData title='PRODUCTS --- ECOMMERCE'/>
          <div className='container'>
        <h2 className="productsHeading">Products</h2>
          <div className="products">
        <h2 className="productsHeading2">Products</h2>
        {filteredProducts === 0 && <Typography>No Product Found</Typography>}
            {products && products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className='filterBox'>
            <Typography>Price</Typography>
            <Slider
            value={price}
            onChange={priceHandler}
            aria-labelledby="range-slider"
            valueLabelDisplay='auto'
            min={0}
            max={30000}
            />
            <Typography>Categories</Typography>
            <ul className='categoryBox'>
            {categories.map((category) => (
              <li
              key={category}
              className='category-link'
              onClick={()=> setCategory(category)}
              >{category}</li>
            ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
              value={ratings}
              onChange={(e,newRating)=>{setRatings(newRating)}}
              aria-labelledby='continous-slider'
              valueLabelDisplay='auto'
              min={0}
              max={5}
              />
            </fieldset>
            </div>
            </div>  
         
      {resultPerPage < filteredProducts &&
        <div className='paginationBox'>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productCount}
            onChange={setPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="First"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass='pageItemActive'
            activeLinkClass='pageLinkActive'
          />
        </div>
      }
      </> } 
    </>
  )
}

export default Products
