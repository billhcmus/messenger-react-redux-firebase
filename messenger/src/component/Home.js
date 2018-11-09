import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {firebaseConnect, isEmpty} from 'react-redux-firebase'
import PageHeader from "./Header";
import Conversations from "./Conversation";
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
        };

        this._onResize = this._onResize.bind(this);
    }

    _onResize() {
        this.setState({height: window.innerHeight});
    }

    componentDidMount() {
        window.addEventListener("resize", this._onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._onResize);
    }

    componentWillMount() { // auto check when authenticated change, ex: when user click signOut
        if (isEmpty(this.props.auth)) {
            this.props.history.push("/login");
        }
    }

    componentWillUpdate() {
        if (isEmpty(this.props.auth)) {
            this.props.history.push("/login");
        }
    }

    render() {
        const {height} = this.state;

        const style = {
            height: height
        };

        return (
            <div>
                <div className={"main-page"} style={style}>
                    <PageHeader/>
                    <Conversations/>
                </div>
            </div>
        )
    }
}

export default compose(
    firebaseConnect(),
    withRouter,
    connect((state) => ({
        auth: state.firebase.auth,
    }))
)(Home)