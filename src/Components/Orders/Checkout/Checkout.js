import React, { Component } from 'react'
import { Formik } from 'formik'
import { updateIngredients } from '../../../redux/actionCreators'
import { Button, Modal, ModalBody } from 'reactstrap'
import axios from 'axios'
import { connect } from 'react-redux'
import Spinner from '../../Spinner/Spinner'


const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchasable: state.purchasable,
        userId: state.userId,
        token: state.token
    }
}
const mapDispatchToProps = Dispatch => {
    return {
        resetIngredients: () => Dispatch(updateIngredients())
    }
}


class Checkout extends Component {
    state = {
        isLoading: false,
        isModalOpen: false,
        modalMsg: ""
    }
    goBack = () => {
        this.props.history.goBack("/");
    }
    render() {
        const form = <div>
            <h4 style={{
                border: "1px solid grey",
                boxShadow: "1px 1px #888888",
                borderRadius: "5px",
                padding: "20px"
            }}>Total Price:{this.props.totalPrice} BDT</h4>
            <Formik
                initialValues={
                    {

                        "delivaryAddress": "",
                        "phone": "",
                        "paymentType": ""

                    }

                }
                onSubmit={
                    (values) => {
                        console.log("Values:", values);
                        const order = {
                            ingredients: this.props.ingredients,
                            customer: values,
                            price: this.props.totalPrice,
                            orderTime: new Date(),
                            userId: this.props.userId
                        }

                        this.setState({ isLoading: true })
                        axios.post("https://burger-73c18.firebaseio.com/orders.json?auth=" + this.props.token, order)
                            .then(response => {
                                if (response.status === 200) {
                                    this.props.resetIngredients();
                                    this.setState({
                                        isLoading: false, isModalOpen: true,
                                        modalMsg: "Your Order Placed Successfully"
                                    })
                                } else {
                                    this.setState({
                                        isLoading: false,
                                        isModalOpen: true, modalMsg: "Something went wrong. Please Order Again"
                                    })
                                }
                            })
                            .catch(err => {
                                this.setState({
                                    isLoading: false,
                                    isModalOpen: true, modalMsg: "Something went wrong. Please Order Again"
                                })
                            })
                    }
                }
                validate={
                    (values) => {
                        const errors = {}
                        if (!values.delivaryAddress) {
                            errors.delivaryAddress = "Required"
                        }
                        if (!values.phone) {
                            errors.phone = "Required"
                        }
                        console.log("Errors", errors)
                        return errors
                    }
                }
            >
                {({ values, handleChange, handleSubmit, errors }) => (
                    <div style={{
                        border: "1px solid grey",
                        boxShadow: "1px 1px #888888",
                        borderRadius: "5px",
                        padding: "20px",

                    }}>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                name="delivaryAddress"
                                placeholder="Enter delivaryAddress"
                                className="form-control"
                                value={values.delivaryAddress}
                                onChange={handleChange}
                            ></textarea>
                            <span style={{ color: "red" }}>{errors.delivaryAddress}</span>
                            <br />
                            <input
                                name="phone"
                                placeholder="Enter phone number"
                                className="form-control"
                                value={values.phone}
                                onChange={handleChange}
                            />
                            <span style={{ color: "red" }}>{errors.phone}</span>
                            <br />
                            <select name="paymentType" value={values.paymentType}
                                className="form-control" onChange={handleChange}>
                                <option>Cash on delivary</option>
                                <option>Bkash</option>
                            </select>
                            <span style={{ color: "red" }}>{errors.passwordConfirm}</span>
                            <br />
                            <Button type="submit" style={{ backgroundColor: "#D70F64" }} className="mr-auto"
                                disabled={!this.props.purchasable} >Place Order</Button>
                            <Button color="secondary" className="ml-1" onClick={this.goBack}>Cancel</Button>

                        </form>
                    </div>
                )}
            </Formik>
        </div >
        return (
            <div>
                {this.state.isLoading ? <Spinner /> : form}
                <Modal isOpen={this.state.isModalOpen}>
                    <ModalBody onClick={this.goBack}>{this.state.modalMsg}</ModalBody>
                </Modal>
            </div>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)