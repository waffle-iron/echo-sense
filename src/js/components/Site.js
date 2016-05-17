'use strict';

var React = require('react');
var Router = require('react-router');
var mui = require('material-ui');
// var ThemeManager = mui.Styles.ThemeManager;
// var AltContainer = require('alt/AltContainer');
var UserStore = require('stores/UserStore');
var UserActions = require('actions/UserActions');
var AppConstants = require('constants/AppConstants');
import {
  blue500, blue700, blueA200,
  lightBlack, darkBlack,
  grey100, grey500, grey300,
  white
} from 'material-ui/styles/colors';
var toastr = require('toastr');
var RouteHandler = Router.RouteHandler;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';


const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: blue500,
    primary2Color: blue700,
    primary3Color: lightBlack,
    accent1Color: blueA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3)
  }
});


class Site extends React.Component {
  constructor(props) {
    super(props);
    UserActions.loadLocalUser();
  }

  componentDidMount() {
    toastr.options.closeButton = true;
    toastr.options.progressBar = true;
    toastr.options.positionClass = "toast-bottom-left";
  }

  render() {
    var YEAR = new Date().getFullYear();
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div>{this.props.children}</div>

          <div id="footer">
            &copy; { AppConstants.YEAR } - { YEAR } { AppConstants.SITENAME }<br/>
            <small>A project of <a href="https://www.echomobile.org">Echo Mobile</a>. Built in Kenya.</small>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
};

var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

module.exports = Site;
