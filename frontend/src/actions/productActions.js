import axios from 'axios'
import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    ALL_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
} from "../constants/productConstants";
const API_BASE_URL = "https://e-commerce-zrqz.onrender.com";

export const getProducts = (keyword = "", currentPage = 1, price = [0, 80000], category, ratings = 0) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        let link = `${API_BASE_URL}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
        if (category) {
            link = `${API_BASE_URL}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
        }
        const { data } = await axios.get(link);
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCT_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/admin/products`, {
            withCredentials: true
        });
        dispatch({
            type: ADMIN_PRODUCT_SUCCESS,
            payload: data.products
        })
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEWS_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/reviews?id=${id}`, {withCredentials: true});
        dispatch({
            type: ALL_REVIEWS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ALL_REVIEWS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteReview = (reviewId, productId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });
        const { data } = await axios.delete(`${API_BASE_URL}/api/v1/reviews?id=${reviewId}&productId=${productId}`, {withCredentials: true});
        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });
        const { data } = await axios.delete(`${API_BASE_URL}/api/v1/admin/products/${id}`, {withCredentials: true});
        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}


export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });
        const { data } = await axios.get(`${API_BASE_URL}/api/v1/products/${id}`, {withCredentials: true});
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        const { data } = await axios.put(`${API_BASE_URL}/api/v1/review`, reviewData, config);
        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        const { data } = await axios.post(`${API_BASE_URL}/api/v1//admin/products/new`, productData, config);
        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        const { data } = await axios.put(`${API_BASE_URL}/api/v1/admin/products/${id}`, productData, config);
        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}
