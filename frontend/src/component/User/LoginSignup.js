import React, { useEffect, useRef, useState } from 'react';
import './LoginSignup.css'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FaceIcon from '@material-ui/icons/Face';
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, login, register } from '../../actions/userActions';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

const LoginSignup = ({history, location}) => {
    const loginTab = useRef(null);
    const alert = useAlert();
    const registerTab = useRef(null);
    const switcherTab = useRef(null);
    const dispatch = useDispatch();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const { error, loading , isAuthenticated} = useSelector(state => state.user)
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })
    const { name, email, password } = user;
    const [avatar, setAvatar] = useState("https://res.cloudinary.com/dkp7bgiet/image/upload/v1724515579/avatars/pqqy1dldjlbaw9ulkmws.png");
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
    const redirect = location.search ? location.search.split("=")[1] : "/account"
    useEffect(()=>{
        if(error){
            const errorMessage = typeof error === 'string' ? error : error.message.split(":")[2];
             alert.error(errorMessage);
             dispatch(clearErrors())
          }
        if (isAuthenticated) {
            history.push(redirect);
        }
    },[ dispatch, error, alert, history, isAuthenticated, redirect])
    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    }
    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword))
    }
    const registerSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.set("name", name);
        form.set("email", email);
        form.set("password", password);
        form.set("avatar", avatar);
        dispatch(register(form))
    }
    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <div className='LoginSignUpContainer'>
                        <div className='LoginSignUpBox'>
                            <div>
                                <div className='login_signUp_toggle'>
                                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                                </div>
                                <button ref={switcherTab}></button>
                            </div>
                            <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                                <div className='loginEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required />
                                </div>
                                <div className='loginPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required />
                                </div>
                                <input type='submit' value='Login' className='loginBtn' />
                            </form>
                            <form
                                className='signUpForm'
                                ref={registerTab}
                                onSubmit={registerSubmit}
                                encType='multipart/form-data'
                            >
                                <div className='signUpName' >
                                    <FaceIcon />
                                    <input
                                        type='text'
                                        placeholder='Name'
                                        value={name}
                                        name="name"
                                        onChange={registerDataChange}
                                        required />
                                </div>
                                <div className='signUpEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        value={email}
                                        name="email"
                                        onChange={registerDataChange}
                                        required />
                                </div>
                                <div className='signUpPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        value={password}
                                        name="password"
                                        onChange={registerDataChange}
                                        required />
                                </div>
                                <div id='registerImage'>
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type='file'
                                        name="avatar"
                                        accept='image/'
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <input
                                    type='submit'
                                    value='Register '
                                    className='signUpBtn' />

                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default LoginSignup
