import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css"; 
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { getAllOrders, clearErrors, deleteOrder } from "../../actions/orderActions";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrderList = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { orders, error } = useSelector(state => state.allOrders);
    const { error: deleteError, isDeleted } = useSelector(state => state.order);
    useEffect(() => {   
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success('Order Deleted Successfully');
            history.push("/admin/orders");
            dispatch({ type: DELETE_ORDER_RESET });
        }
        dispatch(getAllOrders());
    }, [dispatch, error, deleteError, isDeleted, history, alert]);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            minWidth: 250,
            flex: 0.5 
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 200,
            flex: 0.4,
            cellClassName: (params) => {
                return params.value === 'Delivered' ? 'greenColor' : 'redColor'
            }
        },
        {
            field: 'itemsQuantity',
            headerName: 'Items Quantity',
            type: "number",
            minWidth: 200,
            flex: 0.6
        },
        {
            field: 'amount',
            headerName: 'Amount',
            type: "number",
            minWidth: 150,
            flex: 0.3
        },
        {
            field: "actions", headerName: "Actions", minWidth: 150, flex: 0.3, type: "number", sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))
                        }>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        }
    ];
    const rows = [];
    orders && orders.forEach((item) => {
        rows.push({
            itemsQuantity: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice
        });
    });


    return (
         <>
            <MetaData title='ALL ORDERS -- Admin' />
            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </>
    )
}

export default OrderList
