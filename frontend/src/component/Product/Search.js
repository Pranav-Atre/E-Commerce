import React, { useState } from 'react'
import './Search.css'
import MetaData from '../layout/MetaData';

const Search = ({history}) => {
    const [keyword, setKeyword] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            history.push(`/products/${keyword}`);
        }  else {
            history.push('/');
        }
    }
  return (
    <>
          <MetaData title='Search a Product --- ECOMMERCE'/>
    <form className='searchBox' onSubmit={handleSubmit}>
        <input autoFocus type='text' placeholder='Search a Product...' onChange={(e)=> setKeyword(e.target.value)}/>
        <input type='submit' value='Search' />
    </form>
    </>
  )
}

export default Search
