import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import LaunchIcon from "@material-ui/icons/Launch"
import "./MyOrders.css"
import MetaData from '../layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../layout/Loader/Loader'
import { Typography } from '@material-ui/core'
import { useAlert } from 'react-alert'
import { myOrders, clearErrors } from '../../actions/orderActions'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const MyOrders = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector(state => state.user);

  const columns = [
    {
      field: 'id',
      headerName: 'Order ID',
      minWidth: 300,
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.value === 'Delivered' ? 'greenColor' : 'redColor'
      }
    },
    {
      field: 'itemsQuantity',
      headerName: 'Items Quantity',
      type: "number",
      minWidth: 200,
      flex: 0.3
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: "number",
      minWidth: 270,
      flex: 0.5
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: "number",
      minWidth: 200,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`} >
            <LaunchIcon />
          </Link>
        )
      }
    }
  ]
  
  const rows = []
  
  orders && orders.forEach((item) => {
    rows.push({
      itemsQuantity: item.orderItems.length,
      id: item._id,
      status: item.orderStatus,
      amount: item.totalPrice
    })
  })


  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders())
  }, [dispatch, alert, error])
  return (
    <>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? <Loader /> : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className='myOrdersTable'
            autoHeight
          />
          <Typography id="myOrdersHeading" >{`${user.name}'s Orders`}</Typography>
        </div>
      )
      }
    </>
  )
}

export default MyOrders
