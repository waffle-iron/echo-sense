var React = require('react');
var Router = require('react-router');

var util = require('utils/util');

var bootstrap = require('bootstrap');
var toastr = require('toastr');
import history from 'config/history'

import LeftNav from 'material-ui/lib/left-nav';
import AppBar from 'material-ui/lib/app-bar';
import MenuItem from 'material-ui/lib/menus/menu-item';
var $ = require('jquery');

var mui = require('material-ui'),
  FontIcon = mui.FontIcon,
  Dialog = mui.Dialog,
  FlatButton = mui.FlatButton;

var UserActions = require('actions/UserActions');
var UserStore = require('stores/UserStore');
var AppConstants = require('constants/AppConstants');

import connectToStores from 'alt/utils/connectToStores';
import {changeHandler} from 'utils/component-utils';

@connectToStores
@changeHandler
class Public extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ln_open: false,
      faqs_open: false
    };
    this.FAQ = [
      { title: "", content: "" },
      { title: "", content: "" },
      { title: "", content: "" },
    ]
  }
  static getStores() {
    return [UserStore];
  }
  static getPropsFromStores() {
    return UserStore.getState();
  }

  componentDidMount() {
    console.log("mounted public");
    $("body").addClass("public");
    // $('link[title=public_css]').prop('disabled',false);
  }

  componentWillUnmount() {
    console.log("unmounting public");
    $("body").removeClass("public");
    // $('link[title=public_css]').prop('disabled',true);
  }


  handle_toggle_leftnav = () => this.setState({ln_open: !this.state.ln_open});

  handle_leftnav_change = (open) => this.setState({ln_open: open});

  goto_page(link) {
    window.location = link;
  }

  navigate_to_page(page) {
    history.pushState(null, page);
  }

  render_menu() {
    var menu_items = [
      {title: "Documentation", link: "/docs/index.html", icon: <FontIcon className="material-icons">chrome_reader_mode</FontIcon>},
      // {title: "FAQs", onClick: this.toggle_faqs.bind(this, true), icon: <FontIcon className="material-icons">help</FontIcon>},
      {title: "React", link: "http://facebook.github.io/react/", icon: <FontIcon className="material-icons">build</FontIcon>},
      {title: "Google App Engine", link: "https://cloud.google.com/appengine/docs", icon: <FontIcon className="material-icons">cloud_circle</FontIcon>},
    ];
    return menu_items.map(function(mi) {
      var click = mi.onClick || this.goto_page.bind(this, mi.link);
      return <MenuItem onClick={click} leftIcon={mi.icon}>{ mi.title }</MenuItem>
    }, this);
  }

  toggle_faqs(open) {
    this.setState({faqs_open: open});
  }

  render_faqs() {
    return this.FAQ.map(function(faq) {
      return (
        <div>
          <h1>{ faq.title }</h1>
          <p className="lead">{ faq.content }</p>
        </div>
        )
    });
  }

  render() {
    return (
      <div>
          <AppBar
            title={AppConstants.SITENAME}
            onTitleTouchTap={this.navigate_to_page.bind(this, '/public/splash')}
            onLeftIconButtonTouchTap={this.handle_toggle_leftnav.bind(this)}
            iconElementRight={<FlatButton onClick={this.navigate_to_page.bind(this, '/public/login')}  label="Sign In" />} />

          <LeftNav docked={false} open={this.state.ln_open} onRequestChange={this.handle_leftnav_change.bind(this)}>
            { this.render_menu() }
          </LeftNav>

          <Dialog title="FAQs" open={this.state.faqs_open} onRequestClose={this.toggle_faqs.bind(this, false)} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
            { this.render_faqs() }
          </Dialog>

          <div>
            { this.props.children }
          </div>
      </div>
    )
  }
};

module.exports = Public;
