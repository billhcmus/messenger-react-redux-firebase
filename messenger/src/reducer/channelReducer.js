import {CHANGE_ACTIVE_CHANNEL_ID} from "../constant";

let initState = {
    activeChannelId: 0
};
export default (state=initState, action) => {
    switch (action.type) {
        case CHANGE_ACTIVE_CHANNEL_ID:
            return {
                activeChannelId: action.payload,
            };
        default:
            return state;
    }
}