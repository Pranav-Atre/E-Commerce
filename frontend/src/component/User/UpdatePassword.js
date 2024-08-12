import React, { useEffect, useState } from 'react';
import './UpdatePassword.css'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, updatePassword} from '../../actions/userActions';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

const UpdatePassword = ({history}) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { error, isUpdated, loading } = useSelector(state => state.profile);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.set("oldPassword", oldPassword);
        form.set("newPassword", newPassword);
        form.set("confirmPassword", confirmPassword);
        dispatch(updatePassword(form))
    }
        
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success("Password Updated Successfully");
            history.push('/account');
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [dispatch, error, alert, history, isUpdated])
  return (
    <>
            {loading ? <Loader /> :
                <>
                <MetaData title="CHANGE PASSWORD"/>
                    <div className='updatePasswordContainer'>
                        <div className='updatePasswordBox'>
                            <h2 className='updatePasswordHeading'>Update Password</h2>
                        <form
                                className='updatePasswordForm'
                                onSubmit={updatePasswordSubmit}
                                encType='multipart/form-data'
                            >
                            <div className='loginPassword'>
                                    <VpnKeyIcon />
                                    <input
                                        type='password'
                                        placeholder='Old Password'
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required />
                                </div>
                                <div className='loginPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='New Password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required />
                                </div>
                                <div className='loginPassword'>
                                    <LockIcon />
                                    <input
                                        type='password'
                                        placeholder='Confirm Password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required />
                                </div>
                                <input
                                    type='submit'
                                    value='CHANGE'
                                    className='updatePasswordBtn' />
                            </form>
                        </div>
                    </div>
                </>
            }
        </>
  )
}

export default UpdatePassword
