import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty } from 'react-redux-firebase'
import {withRouter} from 'react-router-dom'
// import GoogleButton from 'react-google-button' // optional

class LoginPage extends Component {
    componentDidUpdate() {
        if (!isEmpty(this.props.auth)) {
            this.props.history.push("/");
        }
    }

    render() {
        return (
            <div className="login">
                <div>
                    <h2>Welcome to Let's Chat</h2>
                </div>
                <button type="button" className="btn btn-social btn-google login-button" onClick={() => this.props.firebase.login({ provider: 'google', type: 'popup' })}>
                    <span className="fa fa-google"/> Sign in with Google
                </button>
            </div>
        )
    }
}

LoginPage.propTypes = {
    firebase: PropTypes.shape({
        login: PropTypes.func.isRequired
    }),
    auth: PropTypes.object
};

export default compose(
    firebaseConnect(), // withFirebase can also be used
    withRouter,
    connect(({ firebase: { auth } }) => ({ auth }))
)(LoginPage)