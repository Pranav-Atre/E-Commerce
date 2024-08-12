import { Typography } from '@material-ui/core'
import React from 'react'
import "./OrderSuccess.css"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import { Link } from 'react-router-dom/cjs/react-router-dom.min'


const OrderSuccess = () => {
  return (
    <div className='orderSuccess'>
      <CheckCircleIcon/>
      <Typography>
        Your order has been placed successfully
      </Typography>
      <Link to="/orders">
      View Orders
      </Link>
    </div>
  )
}

export default OrderSuccess
