import React, {Component} from 'react'
import {Button, Progress, Icon} from "antd";
import _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'
import FileUploader from 'react-firebase-file-uploader'
import firebase from 'firebase'

class MessageInput extends Component{
    constructor(props) {
        super(props);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.handleProgress = this.handleProgress.bind(this);
        this.handleUploadError = this.handleUploadError.bind(this);
        this.handleUploadStart = this.handleUploadStart.bind(this);

        this.state = {
            message: "",
            isUploading: false,
            progress: 0
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
        if (this.state.message === "") {
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
            .update({updated: new Date().getTime()});
        this.props.firebase.database().ref(`users/${this.props.activeChannelId}/channels/${_.get(this.props.auth, "uid")}`)
            .update({updated: new Date().getTime()})
    }

    handleUploadSuccess = (filename) => {
        this.setState({isUploading: false, progress: 100});
        firebase.storage().ref('images').child(filename).getDownloadURL().then(url => {
            this.setState({message: url});
            this.handleSendClick();
        });
    };
    handleUploadStart = () => this.setState({isUploading: true, progress: 0});
    handleProgress = (progress) => this.setState({progress});
    handleUploadError = (error) => {
        this.setState({isUploading: false});
        console.error(error);
    };
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
                                <div className={"function"}>
                                    <label className={"choose-label"}>
                                        <Icon size={'small'} type="instagram" />
                                        <FileUploader
                                            hidden
                                            accept="image/*"
                                            storageRef={firebase.app().storage('gs://messenger-mid-term.appspot.com').ref('images')}
                                            onUploadStart={this.handleUploadStart}
                                            onUploadError={this.handleUploadError}
                                            onProgress={this.handleProgress}
                                            onUploadSuccess={this.handleUploadSuccess}
                                        />
                                    </label>
                                </div>
                                <div className={"send"}>
                                    {this.state.isUploading ?
                                        <Progress type="circle" width={40} percent={this.state.progress} />:
                                        <Button onClick={this.handleSendClick} size={'large'} type="primary" shape="circle" icon="right"/>
                                    }
                                </div>

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