import React, {Component} from 'react'
import {Button} from "antd";
import _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'

class MessageInput extends Component{
    constructor(props) {
        super(props);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.state = {
            message: ""
        }
    }
    handleMessageChange(e) {
        if (_.get(e, "target.value") !== "\n") {
            this.setState({message: _.get(e, "target.value")})
        }
    }
    handleKeyUp(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            this.handleSendClick();
        }
    }
    handleSendClick() {
        if (this.props.message === "") {
            return;
        }
        const IdReceive = this.props.activeChannelId;
        const IdSend = _.get(this.props.auth, "uid");
        const author = _.get(this.props.auth, "displayName");
        const avatar = _.get(this.props.auth, "photoURL");
        const body = this.state.message;
        this.setState({message: ""});
        this.props.firebase.database().ref('messages').push({
                IdReceive,
                IdSend,
                author,
                avatar,
                body
            }
        );
        this.props.firebase.database().ref(`users/${_.get(this.props.auth, "uid")}/channels/${this.props.activeChannelId}`)
            .update({updated: new Date().getTime()})
        this.props.firebase.database().ref(`users/${this.props.activeChannelId}/channels/${_.get(this.props.auth, "uid")}`)
            .update({updated: new Date().getTime()})
    }

    render() {
        return (
            <div>
                {
                    this.props.activeChannelId !== 0 ?
                        <div className={"message-input"}>
                            < div className={"text-input"}>
                        < textarea
                            placeholder={"Write your message..."}
                            value={this.state.message}
                            onChange={this.handleMessageChange}
                            onKeyUp={this.handleKeyUp}
                        />
                            </div>
                            <div className={"actions"}>
                                <Button className={"send"} onClick={this.handleSendClick}
                                        type="primary" shape="circle" icon="right"/>
                            </div>
                        </div> : null
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.firebase.auth,
    activeChannelId: state.channelReducer.activeChannelId
});

export default compose(
    firebaseConnect(),
    connect(mapStateToProps, null)
)(MessageInput)