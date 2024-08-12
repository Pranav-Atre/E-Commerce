import React from 'react'
import "./Cart.css"
import CartItemCard from './CartItemCard'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../../actions/cartActions'
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart'
import MetaData from '../layout/MetaData'


const Cart = ({history}) => {
    const { cartItems } = useSelector((state) => state.cart)
    const dispatch = useDispatch()
    const increaseQty = (id, quantity, stock) => {
        if (quantity >= stock) return;
        const newQty = quantity + 1;
        dispatch(addToCart(id, newQty));
    }
    const decreaseQty = (id, quantity, stock) => {
        if (quantity <= 1) return;
        const newQty = quantity - 1;
        dispatch(addToCart(id, newQty));
    }
    const deleteFromCart = (id) => {
        dispatch(removeFromCart(id));
    }
    const checkoutHandler = () => {
        history.push("/login?redirect=shipping")
    }
    return (    
        <>
        <MetaData title="Cart ECOMMERCE"/>
            {cartItems.length === 0 ?
                (<div className='emptyCart'>
                    <RemoveShoppingCartIcon />
                    <Typography>No Product in Cart</Typography>
                    <Link to="/products">View Products</Link>
                </div>
                ) :
                (<>
                    <div className='cartPage'>
                        <div className='cartHeader'>
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>
                        {cartItems && cartItems.map((item) => (
                            <div key={item.product} className='cartContainer'>
                                <CartItemCard item={item} deleteFromCart={deleteFromCart} />
                                <div className='cartInput'>
                                    <button onClick={() => decreaseQty(item.product, item.quantity, item.stock)}>-</button>
                                    <input type="number" readOnly value={item.quantity} />
                                    <button onClick={() => increaseQty(item.product, item.quantity, item.stock)}>+</button>
                                </div>
                                <p className='cartSubtotal'>{`₹${item.price * item.quantity}`}</p>
                            </div>
                        ))}
                        <div className='cartGrossTotal'>
                            <div></div>
                            <div className='cartGrossTotalBox'>
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce((sum, item) => {
                                    return sum + (item.price * item.quantity);
                                }, 0)}`}</p>
                            </div>
                            <div></div>
                            <div className='checkOutBtn'>
                                <button onClick={checkoutHandler}>Checkout</button>
                            </div>
                        </div>
                    </div>
                </>)}
        </>
    )
}

export default Cart
