import React, { useEffect, useRef } from 'react'
import "./Payment.css"
import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { Typography } from '@material-ui/core'
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements 
} from "@stripe/react-stripe-js"
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import axios from 'axios'
import { createOrder, clearErrors } from '../../actions/orderActions'
import { removeFromCart } from '../../actions/cartActions'
const API_BASE_URL = "https://e-commerce-zrqz.onrender.com";

const Payment = ({history}) => {
    const payBtn = useRef(null);
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const alert = useAlert();
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const { error } = useSelector(state => state.newOrder);
    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }
    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    }
    const submitHander = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    },
                withCredentials: true
            }
            const {data} = await axios.post(
                `${API_BASE_URL}/api/v1/payment/process`,
                paymentData,
                config
            )
            const client_secret = data.client_secret;
            if (!stripe || !elements) return;
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pincode,
                            country: shippingInfo.country,
                        }
                    }
                }
            })
            if (result.error) {
                payBtn.current.disabled = false;
                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    };
                    dispatch(createOrder(order))
                    cartItems && cartItems.map((item) => (
                        dispatch(removeFromCart(item.product))
                    ))
                    history.push("./success")
                } else {
                    alert.error("Something went wrong with your payment. Please try again.")
                }
            }
        } catch (error) {
        payBtn.current.disabled = false;
        alert.error(error.response.data.message)
        }
    }
    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error, alert])
  return (
    <>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className='paymentContainer'>
        <form className='paymentForm' onSubmit={submitHander}>
            <Typography>Card Info</Typography>
            <div>
                <CreditCardIcon/>
                <CardNumberElement className='paymentInput' />
            </div>
            <div>
                <EventIcon/>
                <CardExpiryElement className='paymentInput' />
            </div>
            <div>
                <VpnKeyIcon/>
                <CardCvcElement className='paymentInput' />
            </div>
            <input
            type='submit'
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className='paymentFormBtn'></input>
        </form>
      </div>
    </>
  )
}

export default Payment
