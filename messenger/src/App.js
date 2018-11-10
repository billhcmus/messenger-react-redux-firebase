import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import LoginPage from "./component/Login";
import Home from "./component/Home";
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'
import {changeActiveChannelId} from "./action";
import _ from 'lodash'
class App extends Component {
    componentWillMount() {
        this.props.firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if (this.props.users !== undefined && this.props.users !== null) {
                    this.props.users.forEach((u,id) => {
                        if (u.key !== user.uid) {
                            let channelId = u.key;
                            let updated = new Date().getTime();
                            let star = false;

                            this.props.firebase.database().ref(`users/${user.uid}/channels/${channelId}`).update({
                                channelId,
                            });
                            // push new user to available users
                            channelId = user.uid;
                            updated = 0;
                            this.props.firebase.database().ref(`users/${u.key}/channels/${user.uid}`).update({
                                channelId,
                            });
                        }
                    });
                }
                this.props.firebase.database().ref(`users/${user.uid}`).update({online: true});
                // this.props.firebase.database().ref(`users/${user.uid}`).update({star: false});
                // this.props.firebase.database().ref(`users/${user.uid}`).update({updated: 0});

                this.props.firebase.database().ref(`users/${user.uid}`).onDisconnect().update({online: false});
                this.props.firebase.database().ref(`users/${user.uid}`).onDisconnect().update({lastOnline: this.props.firebase.database.ServerValue.TIMESTAMP});
                this.props.firebase.ref('messages').on('child_added', (snapshot)=> {
                    if (_.get(snapshot.val(), "IdSend") !== _.get(this.props.auth, "uid") && _.get(snapshot.val(), "IdReceive") === _.get(this.props.auth, "uid")) {
                        this.props.changeActiveChannel(_.get(snapshot.val(), "IdSend"));
                    }
                });
            }
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={"/"} component={Home}/>
                    <Route path={"/login"} component={LoginPage}/>
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    users: state.firebase.ordered.users
});

const mapDispatchToProps = dispatch => {
    return {
        changeActiveChannel: (id) => {
            dispatch(changeActiveChannelId(id))
        }
    }
};
export default compose(
    firebaseConnect(['users']),
    connect(mapStateToProps, mapDispatchToProps)
)(App)