'use strict';

var React = require('react');
var Router = require('react-router');
var mui = require('material-ui');
var ThemeManager = mui.Styles.ThemeManager;
// var AltContainer = require('alt/AltContainer');
var UserStore = require('stores/UserStore');
var UserActions = require('actions/UserActions');
var AppConstants = require('constants/AppConstants');
var toastr = require('toastr');
var RouteHandler = Router.RouteHandler;
const RawTheme = require('config/RawTheme');

class Site extends React.Component {
  constructor(props) {
    super(props);
    UserActions.loadLocalUser();
  }

  // Important!
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(RawTheme)
    };
  }

  componentDidMount() {
    toastr.options.closeButton = true;
    toastr.options.progressBar = true;
    toastr.options.positionClass = "toast-bottom-left";
  }

  render() {
    var YEAR = new Date().getFullYear();
    return (
        <div>
          <div>{this.props.children}</div>

          <div id="footer">
            &copy; { AppConstants.YEAR } - { YEAR } { AppConstants.SITENAME }<br/>
            <small>A project of <a href="https://www.echomobile.org">Echo Mobile</a>. Built in Kenya.</small>
          </div>
        </div>
    )
  }
};

// Important!
Site.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

module.exports = Site;
