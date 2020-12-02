import * as actionTypes from './actionTypes'
import axios from 'axios'


export const authSuccess = (token, userId) => {
    const authData = {
        token: token,
        userId: userId
    }
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: authData
    }

}

export const authFailed = errorMsg => {
    return {
        type: actionTypes.AUTH_FAILED,
        payload: errorMsg
    }
}
export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expirationTime')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}
export const authLoading = authLoading => {
    return {
        type: actionTypes.AUTH_LOADING,
        payload: authLoading
    }
}

export const auth = (email, password, mode) => {
    return (dispatch) => {
        dispatch(authLoading(true))
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        console.log("mode:", mode)
        let URL = null
        if (mode === "SignUp") {
            URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
        } else {
            URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
        }
        const API_KEY = "AIzaSyCRnazqnDSkr47dRiDFOavFIzcBYC7wTXE"
        axios.post(URL + API_KEY, authData)
            .then(response => {
                dispatch(authLoading(false))
                localStorage.setItem('token', response.data.idToken)
                localStorage.setItem('userId', response.data.localId)
                const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000)
                localStorage.setItem('expirationTime', expirationTime)
                dispatch(authSuccess(response.data.idToken, response.data.localId))
            })
            .catch(err => {
                console.log(err.response.data.error.message)
                dispatch(authLoading(false))
                dispatch(authFailed(err.response.data.error.message))
            })
    }
}


export const authExpiration = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        if (!token) {
            dispatch(logout())
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationTime'))
            if (expirationTime <= new Date()) {
                dispatch(logout())
            }
            else {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId))
            }
        }
    }

}

