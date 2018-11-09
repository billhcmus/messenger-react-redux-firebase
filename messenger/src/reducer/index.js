import {combineReducers} from 'redux'
import {firebaseReducer} from 'react-redux-firebase'
import channelReducer from './channelReducer'

export const rootReducer = combineReducers({
    firebase: firebaseReducer,
    channelReducer: channelReducer
});
