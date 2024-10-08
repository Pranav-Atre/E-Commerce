import React, { useEffect, useState } from 'react';
import './UpdateProfile.css'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FaceIcon from '@material-ui/icons/Face';
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, loadUser, updateProfile } from '../../actions/userActions';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';

const UpdateProfile = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
    const updateProfileSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.set("name", name);
        form.set("email", email);
        form.set("avatar", avatar);
        dispatch(updateProfile(form))
    }
    const updateProfileDataChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully");
            dispatch(loadUser());
            history.push('/account');
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }
    }, [dispatch, error, alert, history, user, isUpdated])

    return (
        <>
            {loading ? <Loader /> :
                <>
                <MetaData title="UPDATE PROFILE"/>
                    <div className='updateProfileContainer'>
                        <div className='updateProfileBox'>
                            <h2 className='updateProfileHeading'>Update Profile</h2>
                        <form
                                className='updateProfileForm'
                                onSubmit={updateProfileSubmit}
                                encType='multipart/form-data'
                            >
                                <div className='updateProfileName' >
                                    <FaceIcon />
                                    <input
                                        type='text'
                                        placeholder='Name'
                                        value={name}
                                        name="name"
                                        onChange={(e)=> setName(e.target.value)}
                                        required />
                                </div>
                                <div className='updateProfileEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        value={email}
                                        name="email"
                                        onChange={(e)=> setEmail(e.target.value)}
                                        required />
                                </div>
                                <div id='updateProfileImage'>
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type='file'
                                        name="avatar"
                                        accept='image/'
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type='submit'
                                    value='UPDATE'
                                    className='updateProfileBtn' />

                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default UpdateProfile
