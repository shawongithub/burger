import React, { Component } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import axios from 'axios'
import { connect } from 'react-redux'
import Spinner from '../../Spinner/Spinner'
import { updateIngredients } from '../../../redux/actionCreators'

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchasable: state.purchasable
    }
}
const mapDispatchToProps = Dispatch => {
    return {
        resetIngredients: () => Dispatch(updateIngredients())
    }
}

class Checkout extends Component {
    state = {
        values: {
            delivaryAddress: "",
            phone: "",
            paymentType: "Cash on delivary"
        },
        isLoading: false,
        isModalOpen: false,
        modalMsg: ""
    }
    inputHandler = e => {
        this.setState({
            values: {
                ...this.state.values,
                [e.target.name]: e.target.value
            }
        })
    }
    goBack = () => {
        this.props.history.goBack("/");
    }
    submitHandler = () => {
        const order = {
            ingredients: this.props.ingredients,
            customer: this.state.values,
            price: this.props.totalPrice,
            orderTime: new Date()
        }
        this.setState({ isLoading: true })
        axios.post("https://burger-73c18.firebaseio.com/orders.json", order)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        isLoading: false, isModalOpen: true,
                        modalMsg: "Your Order Placed Successfully"
                    })
                    this.props.resetIngredients();
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
    render() {
        const form = <div>
            <h4 style={{
                border: "1px solid grey",
                boxShadow: "1px 1px #888888",
                borderRadius: "5px",
                padding: "20px"
            }}>Total Price:{this.props.totalPrice} BDT</h4>
            <form style={{
                border: "1px solid grey",
                boxShadow: "1px 1px #888888",
                borderRadius: "5px",
                padding: "20px",
            }}>
                <textarea name="delivaryAddress" value={this.state.values.delivaryAddress}
                    placeholder="Your Address" className="form-control"
                    onChange={(e) => this.inputHandler(e)}></textarea>
                <br />
                <input name="phone" value={this.state.values.Phone}
                    placeholder="phone number" className="form-control"
                    onChange={(e) => this.inputHandler(e)} />
                <br />
                <select name="paymentType" value={this.state.values.paymentType}
                    className="form-control" onChange={(e) => this.inputHandler(e)}>
                    <option>Cash on delivary</option>
                    <option>Bkash</option>
                </select>
                <Button style={{ backgroundColor: "#D70F64" }} className="mr-auto"
                    disabled={!this.props.purchasable} onClick={this.submitHandler}>Place Order</Button>
                <Button color="secondary" className="ml-1" onClick={this.goBack}>Cancel</Button>
            </form>
        </div>
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