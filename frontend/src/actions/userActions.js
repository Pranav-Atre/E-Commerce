import axios from 'axios'
import {
    CLEAR_ERRORS,
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
} from "../constants/userConstants";
const API_BASE_URL = "https://e-commerce-zrqz.onrender.com";

//Login User
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });
        const config = { 
            headers: { 
                'Content-Type': 'application/json'},
                withCredentials: true
              }
        const { data } = await axios.post(`${API_BASE_URL}/api/v1/login`,
            { email, password },
            config,
        );
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}

//Register User
export const register = (userData) => async (dispatch) => {
    try {   
        dispatch({ type: REGISTER_USER_REQUEST });
        const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
        const { data } = await axios.post(`${API_BASE_URL}/api/v1/register`,
            userData,   
            config
        );
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response && error.response.data.error
            ? error.response.data.error
            : error.message,
        })
    }
}

//Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/me`, {
            withCredentials: true  // Include cookies in the request
          }
        );
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/admin/users`, {withCredentials: true});
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })
    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}  

export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/admin/user/${id}`, {withCredentials: true});
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateUser = (id, userData) => async (dispatch) => {
    try {   
        dispatch({ type: UPDATE_USER_REQUEST });
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        const { data } = await axios.put(`${API_BASE_URL}/api/v1/admin/user/${id}`,
            userData,
            config
        );
        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteUser = (id) => async (dispatch) => {
    try {   
        dispatch({ type: DELETE_USER_REQUEST });
        const { data } = await axios.delete(`${API_BASE_URL}/api/v1/admin/user/${id}`, {withCredentials: true});
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

//Logout User
export const logout = () => async (dispatch) => {
    try {
        await axios.get(`${API_BASE_URL}/api/v1/logout`, {withCredentials: true});
        dispatch({
            type: LOGOUT_SUCCESS,
        })
    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
    }

//Update Profile
export const updateProfile = (userData) => async (dispatch) => {
    try {   
        dispatch({ type: UPDATE_PROFILE_REQUEST });
        const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
        const { data } = await axios.put(`${API_BASE_URL}/api/v1/me/change`,
            userData,
            config
        );
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}

//Update PASSWORD
export const updatePassword = (password) => async (dispatch) => {
    try {   
        dispatch({ type: UPDATE_PASSWORD_REQUEST });
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        const { data } = await axios.put(`${API_BASE_URL}/api/v1/password/change`,
            password,
            config
        );
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

