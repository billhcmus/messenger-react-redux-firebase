import {CHANGE_ACTIVE_CHANNEL_ID} from "../constant";

export const changeActiveChannelId = (id) => (
    {
        type: CHANGE_ACTIVE_CHANNEL_ID,
        payload: id
    }
);