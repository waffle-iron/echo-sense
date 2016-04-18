var React = require('react');
var ReactDOM = require('react-dom');
import { Router } from 'react-router';
// Browser ES6 Polyfill
require('babel/polyfill');
var routes = require('config/Routes');
import history from 'config/history'
ReactDOM.render(<Router routes={routes} history={history} />, document.getElementById('app'));
