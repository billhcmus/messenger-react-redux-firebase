import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, compose} from 'redux'
import {Provider} from 'react-redux'
import {reactReduxFirebase} from 'react-redux-firebase'
import firebase from 'firebase'
import {rootReducer} from "./reducer";
import 'antd/dist/antd.css';
import './css/app.css'

// const firebaseConfig = {
//     apiKey: "AIzaSyCnfAP9Xlwr_3FghFe84iQm1PUE32Na1K8",
//     authDomain: "messenger-3676d.firebaseapp.com",
//     databaseURL: "https://messenger-3676d.firebaseio.com",
//     projectId: "messenger-3676d",
//     storageBucket: "messenger-3676d.appspot.com",
//     messagingSenderId: "556380240160"
// };

var firebaseConfig = {
    apiKey: "AIzaSyAGdlaY_9rIM38x_wY68phC07WB3LyKurQ",
    authDomain: "messenger-mid-term.firebaseapp.com",
    databaseURL: "https://messenger-mid-term.firebaseio.com",
    projectId: "messenger-mid-term",
    storageBucket: "gs://messenger-mid-term.appspot.com",
    messagingSenderId: "104035033680"
};

firebase.initializeApp(firebaseConfig);

// react-redux-firebase options
const config = {
    userProfile: 'users', // firebase root where user profiles are stored
    firebaseStateName: 'firebase',// should match the reducer name ('firebase' is default)
};

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, config)
)(createStore);

const initialState = {};

const store = createStoreWithFirebase(rootReducer, initialState);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
