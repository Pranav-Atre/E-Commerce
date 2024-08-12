import React from 'react'
import "./CartItemCard.css"
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const CartItemCard = ({item, deleteFromCart}) => {
  return (
    <div className='CartItemCard'>
      <img src={item.image} alt="Product"/>
      <div>
        <Link to={`/product/${item.product}`} >{item.name}</Link>
        <span>Price: ₹{item.price}</span>
        <p onClick={()=> deleteFromCart(item.product)}>Remove</p>
      </div>
    </div>  
  )
}

export default CartItemCard
