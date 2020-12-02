import React, { Component } from 'react'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import { auth } from '../../redux/authActionCreators'
import Spinner from '../Spinner/Spinner'
import { Alert } from 'reactstrap'

const mapDispatchToProps = (dispatch) => {
    return {
        auth: (email, password, mode) => dispatch(auth(email, password, mode))
    }
}

const mapStateToProps = state => {
    return {
        authLoading: state.authLoading,
        errorMsg: state.errorMsg
    }
}

class Auth extends Component {
    state = {
        mode: "SignUp",
        submitted: false
    }
    submitHandler = () => {
        this.setState({
            mode: this.state.mode === "SignUp" ? "Login" : "SignUp",

        })
    }
    render() {
        let err = null
        if (this.props.errorMsg !== null) {
            err = <Alert>{this.props.errorMsg}</Alert>
        }
        let form = null
        if (this.props.authLoading) {
            form = <Spinner />
        }
        else {
            form = <Formik
                initialValues={
                    {
                        "email": "",
                        "password": "",
                        "passwordConfirm": ""
                    }
                }
                onSubmit={
                    (values) => {
                        this.props.auth(values.email, values.password, this.state.mode)
                    }
                }
                validate={
                    (values) => {
                        const errors = {}
                        if (!values.email) {
                            errors.email = "Required"
                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                            errors.email = 'Invalid email address';
                        }
                        if (!values.password) {
                            errors.password = "Required"
                        } else if (values.password.length < 6) {
                            errors.password = "Password is too short"
                        }
                        if (this.state.mode === "SignUp") {
                            if (!values.passwordConfirm) {
                                errors.passwordConfirm = "Required"
                            } else if (values.password !== values.passwordConfirm) {
                                errors.passwordConfirm = "Password doesn't match"
                            }
                        }

                        console.log("Errors", errors)
                        return errors
                    }
                }
            >
                {({ values, handleChange, handleSubmit, errors }) => (
                    <div style={{
                        border: "1px solid grey",
                        padding: "10px",
                        borderRadius: "15px"
                    }}>
                        <button
                            style={{ width: "100%", backgroundColor: "#D70F64", color: "white" }}
                            onClick={this.submitHandler}
                        >Switch to {this.state.mode === "SignUp" ? "Login" : "SignUp"}</button>
                        <br /><br />
                        <form onSubmit={handleSubmit}>
                            <input
                                name="email"
                                placeholder="Enter Email"
                                className="form-control"
                                value={values.email}
                                onChange={handleChange}

                            />
                            {<span style={{ color: "red" }}>{errors.email}</span>}

                            <br />
                            <input
                                name="password"
                                placeholder="Enter Password"
                                className="form-control"
                                value={values.password}
                                onChange={handleChange}
                            />
                            {<span style={{ color: "red" }}>{errors.password}</span>}

                            <br />
                            {this.state.mode === "SignUp" ? <div>
                                <input
                                    name="passwordConfirm"
                                    placeholder="Confirm Password"
                                    className="form-control"
                                    value={values.passwordConfirm}
                                    onChange={handleChange}
                                />
                                {<span style={{ color: "red" }}>{errors.password}</span>}

                                <br />
                            </div> : null}

                            <button type="submit" className="btn btn-sm btn-success">{this.state.mode}</button>

                        </form>
                    </div>
                )}
            </Formik>
        }
        return (
            <div>
                {err}
                {form}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);