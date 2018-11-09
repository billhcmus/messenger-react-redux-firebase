import React, { Component } from "react";
import { Layout, Dropdown, Icon, Menu } from "antd";
import _ from "lodash"
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withRouter} from 'react-router-dom'
import {firebaseConnect, isLoaded} from "react-redux-firebase";
const { Header } = Layout;

class PageHeader extends Component {
    constructor(props) {
        super(props);
        this.handleSignOutClick = this.handleSignOutClick.bind(this)
    }
    handleSignOutClick(e) {
        if (e.key === "2") {
            this.props.firebase.database().ref(`users/${_.get(this.props.auth, "uid")}`).update({online: false});
            this.props.firebase.database().ref(`users/${_.get(this.props.auth, "uid")}`).update({lastOnline: this.props.firebase.database.ServerValue.TIMESTAMP});
            this.props.firebase.logout();
        }
    }
    render() {
        let menu = (
            <Menu onClick={this.handleSignOutClick}>
                <Menu.Item key="1">
                    <Icon type="user" />
                    User Info
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="logout" />
                    Logout
                </Menu.Item>
            </Menu>
        );
        return (
            <Header>
                {
                    isLoaded(this.props.auth) ?
                        <div className={"header"}>
                            <div className={"header-left"}>
                            </div>
                            <div className={"header-content"}>
                                <h2>{_.get(this.props.auth, "displayName")}</h2>
                            </div>
                            <div className={"header-right"}>
                                <div className={"user-bar"}>
                                    <div className={"profile-name"}>{_.get(this.props.auth, "displayName")}</div>
                                    <div className={"profile-img"}>
                                        <Dropdown overlay={menu} trigger={["click"]}>
                                            <img src={_.get(this.props.auth, "photoURL")} alt={""} />
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                }
            </Header>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    users: state.firebase.ordered.users
});

export default compose(
    firebaseConnect(['users']), // withFirebase can also be used
    withRouter,
    connect(mapStateToProps, null)
)(PageHeader)