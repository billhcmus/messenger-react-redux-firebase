import React, {Component} from 'react'
import {Input} from 'antd'
export default class Search extends Component {
    render() {
        return (
            <div className={"header-left"}>
                <Input placeholder="Search on Messenger" />
            </div>
        );
    }
}