import React, {Component} from 'react'
import {Dropdown, Menu} from "antd";
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
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleChannelClick(id) {
        this.props.changeActiveChannel(id);
    }

    componentDidMount() {

    }

    handleItemClick() {

    }

    render() {
        const menu = (
            <Menu onClick={this.handleItemClick}>
                <Menu.Item key="1">
                    Xóa
                </Menu.Item>
            </Menu>
        );
        let listChannels = [];
        if (this.props.users !== undefined && this.props.users !== null) {
            this.props.users.forEach((user, id) => {
                if (user.key === this.props.auth.uid) {
                    let result = Object.keys(user.value.channels).map(function(key) {
                        return user.value.channels[key];
                    });
                    listChannels = listChannels.concat(result).sort((a,b) => {
                        if (a.updated  > b.updated) {
                            return -1;
                        }
                        if (a.updated < b.updated) {
                            return 1;
                        }
                        return 0;
                    })
                }
            })
        }

        return (
            <div className={"channels"}>
                {
                    listChannels.map((channel, index) => {
                        if (_.get(channel, "channelId") !== _.get(this.props.auth, "uid")) {
                            return (
                                <div key={index} className={classNames("channel",{active: _.get(channel, "channelId") === this.props.activeChannelId})}
                                     onClick={() => this.handleChannelClick(_.get(channel, "channelId"))}
                                >
                                    <div className={"user-image"}>
                                        <img src={_.get(channel, "avatarUrl")} alt={""}/>
                                    </div>
                                    <div className={"channel-info"}>
                                        <h2>{_.get(channel, "displayName")}</h2>
                                        {
                                            _.get(channel, "online") ?
                                                <div className="status">
                                                    <i className="fa fa-circle online"/> Online
                                                </div> :
                                                <div className="status">
                                                    <i className="fa fa-circle offline"/> {moment(_.get(channel, "lastOnline")).fromNow()}
                                                </div>
                                        }
                                    </div>
                                    <div className={"channel-setting"}>
                                        <Dropdown overlay={menu} trigger={["click"]}>
                                            <i className={"icon-settings-streamline-1"}/>
                                        </Dropdown>
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