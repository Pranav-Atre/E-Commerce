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
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { clearErrors, getAdminProducts, deleteProduct } from "../../actions/productActions";

const ProductList = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { products, error } = useSelector(state => state.products);
    const { error : deleteError, isDeleted } = useSelector(state => state.product);
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
            alert.success('Product Deleted Successfully');
            history.push("/admin/dashboard");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
        dispatch(getAdminProducts());
        }, [dispatch, error, deleteError, isDeleted, history, alert]);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    const columns = [
        { field: "id", headerName: "Product ID", flex: 0.5 },
        { field: "name", headerName: "Product Name", minWidth: 200, flex: 0.5 },
        { field: "stock", headerName: "Stock", minWidth: 150, type: "number", flex: 0.3 },
        { field: "price", headerName: "Product Price", type: "number", minWidth: 200, flex: 0.5 },
        {
            field: "actions", headerName: "Actions", minWidth: 150, flex: 0.3, type: "number", sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={()=> deleteProductHandler(params.getValue(params.id, "id"))
                        }>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        }
    ];
    const rows = [];
    products && products.forEach((item) => {
        rows.push({
            id: item._id,
            name: item.name,
            stock: item.stock,
            price: item.price
        });
    });


    return (
        <>
            <MetaData title='ALL PRODUCTS -- Admin' />
            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>
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

export default ProductList
