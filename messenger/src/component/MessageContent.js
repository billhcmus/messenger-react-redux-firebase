import React, {Component} from 'react'
import MessageInput from './MessageInput';
import _ from "lodash"
import classNames from 'classnames'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'

class MessageContent extends Component {
    constructor(props) {
        super(props);
        this.renderMessage = this.renderMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        const {messageList} = this.refs;
        messageList.scrollTop = messageList.scrollHeight;
    }

    renderMessage(message) {
        const msgtext = _.get(message, "body", "");
        let html = _.split(msgtext, "\n").map((line, key) => {
            return <p key={key} dangerouslySetInnerHTML={{__html: line}}/>;
        });
        return html;
    }

    render() {
        let channelMessages = [];
        let curUserId = _.get(this.props.auth, "uid");
        let activeChannelId = this.props.activeChannelId;
        if (this.props.messages !== undefined && this.props.messages !== null) {
            this.props.messages.forEach((message, index) => {
                let IdReceive = _.get(message.value, "IdReceive");
                let IdSend = _.get(message.value, "IdSend");
                if ((IdReceive === curUserId && IdSend === activeChannelId) || (IdReceive === activeChannelId && IdSend === curUserId)) {
                    channelMessages.push(message.value);
                }
            });
        }
        return (
            [
                <div key={1} ref={"messageList"} className={"messages"}>
                    {
                        channelMessages.map((message, index) => {
                            return (
                                <div key={index} className={classNames("message", {me: _.get(message, "IdSend") === _.get(this.props.auth, "uid")})}>
                                    <div className={"message-user-image"}>
                                        <img src={_.get(message, "avatar")} alt={""}/>
                                    </div>
                                    <div className={"message-body"}>
                                        <div className={"message-author"}>{_.get(message, "author")}</div>
                                        <div className={"message-text"}>
                                            {_.get(message, "body")}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>,
                <MessageInput key={2}/>
            ]
        )
    }
}

const mapStateToProps = state => ({
        auth: state.firebase.auth,
        activeChannelId: state.channelReducer.activeChannelId,
        messages: state.firebase.ordered.messages
    }
);

export default compose(
    firebaseConnect(['messages']),
    connect(mapStateToProps, null)
)(MessageContent)