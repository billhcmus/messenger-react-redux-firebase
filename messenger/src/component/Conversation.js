import React, {Component} from "react";
import Search from "./Search";
import Channel from "./Channel";
import MessageContent from "./MessageContent";

export default class Conversations extends Component {

    render() {

        return (
            <div className={"main-content"}>
                <div className={"sidebar-left"}>
                    <Search/>
                    <Channel/>
                </div>
                <div className={"content"}>
                    <MessageContent/>
                </div>
                <div className={"sidebar-right"}>

                </div>
            </div>
        );
    }
}
