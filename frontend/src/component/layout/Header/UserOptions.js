import React, { useState } from 'react'
import './Header.css'
import {SpeedDial, SpeedDialAction} from '@material-ui/lab';
import { Backdrop } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/icons/ListAlt';
import { useDispatch, useSelector } from 'react-redux';
import {useAlert} from 'react-alert'
import { logout } from '../../../actions/userActions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const UserOptions = ({user}) => {
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const { cartItems } = useSelector((state)=> state.cart);
    const dispatch = useDispatch();
    const alert = useAlert();
    
    const actions = [
        { icon: <ListItemIcon/>, name: 'Orders', func: orders},
        { icon: <PersonIcon />, name: 'Profile', func: account},
        { icon: <ShoppingCartIcon style={{color: cartItems.length >0 ? "tomato" : "unset"}} />, name: `Cart(${cartItems.length})`, func: cart},
        { icon: <ExitToAppIcon/>, name: 'Logout', func: logoutUser},
      ];
    
    if (user.role === "admin"){
        actions.unshift({ icon: <DashboardIcon />, name: 'Dashboard', func: dashboard})
    }
    
    function dashboard(){
        history.push('/admin/dashboard');
    }
    function orders(){
        history.push('/orders');
    }
    function account(){
        history.push('/account');
    }
    function cart(){
        history.push('/cart');
    }
    function logoutUser(){
        dispatch(logout());
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingInfo');
        alert.success('Logout Successfully')
    }
    return (
        <>
        <Backdrop open={open} style={{zIndex: '10'}}/>
            <SpeedDial
                className='speedDial'
                ariaLabel="SpeedDial toolkit example"
                onClose={()=>   setOpen(false)}
                onOpen={()=> setOpen(true)}
                open={open}
                direction="down"
                icon={
                    <img
                    className='speedDialIcon'
                    src= {user?.avatar?.url ? user.avatar.url : '/Profile.png'}
                    alt= "User Avatar"
                    />
                }
            >
            {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.func}
            tooltipOpen = {window.innerWidth < 600 ? true : false}
            />
            ))}
            </SpeedDial>
        </>
    )
}

export default UserOptions
