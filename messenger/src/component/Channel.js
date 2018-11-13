import React, {Component} from 'react'
import _ from 'lodash'
import {firebaseConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {withRouter} from "react-router-dom";
import {changeActiveChannelId} from "../action";
import moment from 'moment'


class Channel extends Component {
    constructor(props) {
        super(props);
        this.handleChannelClick = this.handleChannelClick.bind(this);
        this.handleStarClick = this.handleStarClick.bind(this);
    }

    handleChannelClick(id) {
        this.props.changeActiveChannel(id);
    }

    handleStarClick(channel) {
        let star = true;
        if (_.get(channel.value, "star")) {
            star = false;
        }
        this.props.firebase.database().ref(`users/${_.get(this.props.auth, "uid")}/channels/${channel.key}`)
             .update({star: star})
    }

    render() {
        let listChannels = [];
        let listChannelsInfo = [];
        if (this.props.users !== undefined && this.props.users !== null) {
            let me = this.props.users.find(u => u.key === this.props.auth.uid);
            if (me !== null && me !== undefined) {
                if (me.value.channels !== null && me.value.channels !== undefined) {
                    let  tmpArr = Object.values(me.value.channels);
                    tmpArr.forEach((v, i) =>{
                        listChannelsInfo[v.channelId] = v;
                    });
                }
            }
            this.props.users.forEach((user, id) => {
                if (user.key !== this.props.auth.uid && listChannelsInfo[user.key] !== undefined) {
                    if (user.key === listChannelsInfo[user.key].channelId) {
                        user.value.updated = listChannelsInfo[user.key].updated;
                        user.value.star = listChannelsInfo[user.key].star;
                    }
                    listChannels.push(user)
                }
            })
        }

        listChannels = listChannels.sort((a,b) => {
            if (b.value.star === true && (a.value.star === false || a.value.star === undefined) && b.value.online === true) {
                return 1;
            } else if ((a.value.star === false || a.value.star === undefined) && (b.value.star === false || b.value.star === undefined)) {
                if (a.value.updated  > b.value.updated) {
                    return -1;
                }
                if ((a.value.updated < b.value.updated) || b.value.updated !== undefined) {
                    return 1;
                }
                return 0;
            } else if (a.value.star === true && b.value.star === true) {
                if (a.value.updated  > b.value.updated) {
                    return -1;
                }
                if (a.value.updated < b.value.updated) {
                    return 1;
                }
                return 0;
            }
            return 0;
        });

        return (
            <div className={"channels"}>
                {
                    listChannels.map((channel, key) => {
                        if (channel.key !== _.get(this.props.auth, "uid")) {
                            return (
                                <div key={key} className={classNames("channel",{active: channel.key === this.props.activeChannelId})}
                                     onClick={() => this.handleChannelClick(channel.key)}
                                >
                                    <div className={"user-image"}>
                                        <img src={_.get(channel.value, "avatarUrl")} alt={""}/>
                                    </div>
                                    <div className={"channel-info"}>
                                        <h2>{_.get(channel.value, "displayName")}</h2>
                                        {
                                            _.get(channel.value, "online") ?
                                                <div className="status">
                                                    <i className="fa fa-circle online"/> Online
                                                </div> :
                                                <div className="status">
                                                    <i className="fa fa-circle offline"/> {moment(_.get(channel.value, "lastOnline")).fromNow()}
                                                </div>
                                        }
                                    </div>
                                    <div className={"channel-setting"} onClick={() => this.handleStarClick(channel)}>
                                        {
                                            _.get(channel.value, "star") ? <i className={"icon-star"}/>
                                                : <i className={"icon-star-o"}/>
                                        }

                                    </div>
                                </div>
                            )
                        }
                        return null;
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    users: state.firebase.ordered.users,
    auth: state.firebase.auth,
    activeChannelId: state.channelReducer.activeChannelId
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
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Channel)