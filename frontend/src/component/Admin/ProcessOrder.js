import React, { Fragment, useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ProcessOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SideBar from "./Sidebar";
import { getOrderDetails, clearErrors, updateOrder  } from "../../actions/orderActions";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";

const ProcessOrder = ({ history, match }) => {
  const { error, loading, order } = useSelector(state => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(state => state.order);
  const dispatch = useDispatch();
  const alert = useAlert  ();
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (error) {
        alert.error(error);
        dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
  }
  if (isUpdated) {
    alert.success("Order Updated Successfully");
    dispatch({ type : UPDATE_ORDER_RESET})    
}
    dispatch(getOrderDetails(match.params.id))
}, [error, alert, dispatch, match.params.id, isUpdated, updateError ]);

  const processOrder = (e) => {
    e.preventDefault();
        const myForm = new FormData();
        myForm.set("status", status);
        dispatch(updateOrder(match.params.id, myForm));
  }

  return (
    <>
            <MetaData title="Process Orders" />
            <div className="dashboard">
                <SideBar />
                <div className="newProductContainer">
                {loading ? <Loader/> : (
                  <div className="confirmOrderPage"
                  style={{
                    display: order.orderStatus === "Delivered" ? "block" : "grid"
                  }}
                  >
                  <div>
                    <div className="confirmshippingArea">
                      <Typography>Shipping Info</Typography>
                      <div className="processOrderContainerBox">
                                          <div>
                                              <p>Name:</p>
                                              <span>{order.user && order.user.name}</span>
                                          </div>
                                          <div>
                                              <p>Phone:</p>
                                              <span>{order.shippingInfo && order.shippingInfo.phone}</span>
                                          </div>
                                          <div>
                                              <p>Address:</p>
                                              <span>{order.shippingInfo &&
                                                  `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                                          </div>
                                      </div>
                      <Typography> Payment Info</Typography>
                                      <div className="processOrderContainerBox">
                                          <div>
                                              <p
                                                  className={order.paymentInfo && order.paymentInfo.status === "succeeded"
                                                      ? "greenColor"
                                                      : "redColor"
                                                  }
                                              >{order.paymentInfo && order.paymentInfo.status === "succeeded"
                                                  ? "PAID"
                                                  : "NOT PAID"
                                                  }</p>
                                          </div>
                                          <div>
                                              <p>Amount:</p>
                                              <span>{order.totalPrice && order.totalPrice}</span>
                                          </div>
                                      </div>
                                      <Typography> Order Status</Typography>
                                      <div className="processOrderContainerBox">
                                          <div>
                                              <p
                                                  className={ order.orderStatus && order.orderStatus === "Delivered"
                                                      ? "greenColor"
                                                      : "redColor"}
                                              >
                                                  {order.orderStatus && order.orderStatus}
                                              </p>
                                          </div>
                                      </div>
                    </div>
                    <div className="confirmCartItems">
                      <Typography>Your Cart Items:</Typography>
                      <div className="confirmCartItemsContainer">
                        {order.orderItems &&
                          order.orderItems.map((item) => (
                            <div key={item.product}>
                              <img src={item.image} alt="Product" />
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>{" "}
                              <span>
                                {item.quantity} X ₹{item.price} ={" "}
                                <b>₹{item.price * item.quantity}</b>
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  <div
                  style={{
                    display: order.orderStatus === "Delivered" ? "none" : "block"
                  }}
                  >
                  <form
                        className="updateOrderForm"
                        onSubmit={processOrder}
                    >
                        <h1>Process Order</h1>
                      <div>
                            <AccountTreeIcon />
                            <select onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Select Category</option>
                                {order.orderStatus === "Processing" && (
                                  <option value="Shipped">Shipped</option>
                                )}
                                {order.orderStatus === "Shipped" && (
                                  <option value="Delivered">Delivered</option>
                                )}
                                
                            </select>
                        </div>
                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false || status === "" ? true : false}
                        >
                            Process
                        </Button>
                    </form>
                  </div>
                </div>
                )}
                </div>
            </div>
        </>
  );
};

export default ProcessOrder
