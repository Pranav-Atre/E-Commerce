import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./Dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts } from "../../actions/productActions";
import { getAllOrders } from "../../actions/orderActions.js";
import { getAllUsers } from "../../actions/userActions.js";
import MetaData from "../layout/MetaData";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { orders, totalAmount } = useSelector((state) => state.allOrders);
    const { users } = useSelector((state) => state.allUsers);
    let outOfStock = 0;
    products.forEach((item) => {
        if (item.stock === 0) {
            outOfStock += 1;
        }
    });
    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch])
    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [{
            label: "TOTAL AMOUNT",
            backgroundColor: ["tomato"],
            hoverBackgroundColor: ["rgb(197, 72, 49)"],
            data: [0, totalAmount]
        }
        ]
    }
    const doughnutState = {
        labels: ["Out of Stock", "InStock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products.length - outOfStock],
            },
        ],
    };
    return (
        <div className='dashboard'>
            <MetaData title="Dashboard --- Admin" />
            <Sidebar />
            <div className='dashboardContainer'>
                <Typography component='h1' >Dashboard</Typography>
                <div className="dashboardSummary" >
                    <div>
                        <p>
                            Total Amount <br /> ₹{totalAmount}
                        </p>
                    </div>
                    <div className="dashboardSummaryBox2" >
                        <Link to="/admin/products" >
                            <p>Products</p>
                            <p>{products.length}</p>
                        </Link>
                        <Link to="/admin/orders" >
                            <p>Orders</p>
                            <p>{orders && orders.length}</p>
                        </Link>
                        <Link to="/admin/users" >
                            <p>Users</p>
                            <p>{users && users.length}</p>
                        </Link>
                    </div>
                </div>

                <div className="lineChart" >
                    <Line data={lineState} />
                </div>
                <div className="doughnutChart" >
                    <Doughnut data={doughnutState} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
