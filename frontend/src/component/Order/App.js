import './App.css';
import Header from "./component/layout/Header/Header.js";
import UserOptions from "./component/layout/Header/UserOptions.js";
import Footer from "./component/layout/Footer/Footer.js";
import {BrowserRouter as Router} from "react-router-dom";
import WebFont from 'webfontloader'
import React, { useEffect, useState } from "react";
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min.js';
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails';
import Products from './component/Product/Products.js';
import Search from './component/Product/Search.js';
import LoginSignup from './component/User/LoginSignup.js';
import store from './store.js';
import { loadUser } from './actions/userActions.js';
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile.js';
import ProtectedRoute from './component/Route/ProtectedRoute.js';
import UpdateProfile from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import Cart from './component/Cart/Cart.js';
import Shipping from './component/Cart/Shipping.js';
import ConfirmOrder from './component/Cart/ConfirmOrder.js';
import axios from 'axios';
import Payment from './component/Cart/Payment.js';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from './component/Cart/OrderSuccess.js';
import MyOrders from './component/Order/MyOrders.js';
import OrderDetails from './component/Order/OrderDetails.js';

function App() {
  const {isAuthenticated, user} = useSelector(state => state.user)
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    WebFont.load({
    google: {
      families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
      })
      store.dispatch(loadUser()); 
      getStripeApiKey();
  }, [])
  return (
    <Router>
    <Header />
    {isAuthenticated && <UserOptions user={user}/>}
    <Route exact path ='/' component={Home} />
    <ProtectedRoute exact path ='/account' component={Profile} />
    <ProtectedRoute exact path ='/me/update' component={UpdateProfile} />
    <ProtectedRoute exact path ='/password/update' component={UpdatePassword} />
    <ProtectedRoute exact path ='/shipping' component={Shipping} />
    <Switch>
    <ProtectedRoute exact path ='/order/confirm' component={ConfirmOrder} />
    <ProtectedRoute exact path ='/order/:id' component={OrderDetails} />
    </Switch>
    <ProtectedRoute exact path ='/process/success' component={OrderSuccess} />
    <ProtectedRoute exact path ='/orders' component={MyOrders} />
    {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}
    <Route exact path ='/product/:id' component={ProductDetails} />
    <Route exact path ='/products' component={Products} />
    <Route exact path ='/search' component={Search} />
    <Route exact path ='/login' component={LoginSignup} />
    <Route path ='/products/:keyword' component={Products} />
    <Route exact path ='/cart' component={Cart} />
    <Footer />
    </Router>
  )
}

export default App;
