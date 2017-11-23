import App from './components/App.jsx';
import Otp from './components/Otp.jsx';
import Sms from './components/Sms.jsx';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import { _ } from 'underscore';



const getParameterByName = (name, url) =>
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};


const INITIAL_STATE = {
    personalId: '',
    phone: '',
    urlParams: {
        callback: getParameterByName('redirect_uri'),
        grantType: getParameterByName('response_type'),
        appId: getParameterByName('client_id'),
        state: getParameterByName('state')

   }
 };

const update = (state, mutations) =>
        _.assign({}, state, mutations);

const reducer = (state = INITIAL_STATE, action ) => {

    switch( action.type ) {

    case 'PID_CHANGED' :
        state = update(state, {personalId: action.data.pid} );
        break;

    case 'PHONE_CHANGED':
        state = update(state, {phone: action.data.phone});
        break;

    default:
        return state;
    }

    return state;

};

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDom.render(<Provider store={store}>
                    <Router history={hashHistory}>
                        <Route path="default.html" component={App}>
                          <Route path="/" component={Sms}/>
                          <Route path="/otp" component={Otp}/>
                        </Route>
                    </Router>
                </Provider>,
                  document.getElementById('container'));
