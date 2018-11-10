import React, {Component} from 'react'
import {Input} from 'antd'
import _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'
import {changeActiveChannelId} from "../action";
import {OrderedMap} from 'immutable'

class Search extends Component {
    constructor(props) {
        super(props);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.SearchUser = this.SearchUser.bind(this);
        this.handleClickUser = this.handleClickUser.bind(this);
        this.SearchItems = new OrderedMap();

        this.state = {
            keyword: ""
        }
    }

    SearchUser(keyword) {
        if (_.trim(keyword).length) {
            if (this.props.users !== undefined && this.props.users !== null) {
                this.SearchItems = this.SearchItems.clear();
                _.map(this.props.users, u =>{
                    if (_.includes(u.value.displayName, keyword) && u.key !== _.get(this.props.auth, "uid")) {
                        this.SearchItems = this.SearchItems.set(u.key, u);
                    }
                });
            }
        } else {
            this.SearchItems = this.SearchItems.clear();
        }
    }

    handleClickUser(id) {
        this.props.changeActiveChannel(id);
        this.setState({keyword: ""});
        this.SearchItems = this.SearchItems.clear();
    }

    handleSearchChange(e) {
        let input = _.get(e,'target.value');
        this.setState({keyword: input});
        this.SearchUser(input);
    }

    render() {
        return (
            <div className={"header-left"}>
                <Input value={this.state.keyword} placeholder="Search on Messenger" onChange={this.handleSearchChange} />
                <div className={"search-user"}>
                    {
                        this.SearchItems.size > 0 ?
                            <div className={"user-list"}>
                                {this.SearchItems.valueSeq().map((user, index) => {
                                    return (
                                        <div onClick={() => this.handleClickUser(user.key)} key={index} className={"user"}>
                                            <img src={_.get(user.value,"avatarUrl")} alt={""}/>
                                            <h2>{_.get(user.value, "displayName")}</h2>
                                        </div>
                                    );
                                })}
                            </div> : null
                    }
                </div>

            </div>
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
)(Search)