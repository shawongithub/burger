import * as actionTypes from './actionTypes';
import axios from 'axios'


export const addIngredient = igtype => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        payload: igtype,
    }
}

export const removeIngredient = igtype => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        payload: igtype,
    }
}

export const updatePurchasable = () => {
    return {
        type: actionTypes.UPDATE_PURCHASABLE,
    }
}

export const updateIngredients = () => {
    return {
        type: actionTypes.UPDATE_INGREDIENT
    }
}

export const loadOrders = orders => {

    return {
        type: actionTypes.LOAD_ORDERS,
        payload: orders,
    }
}

export const orderFailed = () => {
    return {
        type: actionTypes.ORDER_FAILED
    }
}

export const fetchOrders = (token, userId) => {
    const query = '&orderBy="userId"&equalTo="' + userId + '"'
    return (dispatch) => {
        axios.get('https://burger-73c18.firebaseio.com/orders.json?auth=' + token + query)
            .then(response => {

                dispatch(loadOrders(response.data));
            })
            .catch(err => {
                dispatch(orderFailed())
            })
    }
}

