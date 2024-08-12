import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import { allReviewsReducer, newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducer, reviewReducer } from "./reducers/productReducer";
import { allUsersReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderReducer, ordersDetailsReducer } from "./reducers/orderReducers";

const reducer = combineReducers({
    products : productsReducer,
    productDetails : productDetailsReducer,
    user : userReducer,
    profile : profileReducer,
    cart : cartReducer,
    newOrder : newOrderReducer,
    myOrders : myOrdersReducer,
    orderDetails : ordersDetailsReducer,
    newReview : newReviewReducer,
    newProduct : newProductReducer,
    product : productReducer,
    allOrders : allOrdersReducer,
    order : orderReducer,
    allUsers : allUsersReducer,
    userDetails : userDetailsReducer,
    allReviews : allReviewsReducer,
    review : reviewReducer
});
let initialState = {
    cart : {
        cartItems : localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems")) : [],
        shippingInfo : localStorage.getItem("shippingInfo") 
        ? JSON.parse(localStorage.getItem("shippingInfo")) : []
    },
};
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;