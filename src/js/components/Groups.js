'use strict';

var React = require('react');
var Router = require('react-router');

var FetchedList = require('components/FetchedList');
var SensorDetail = require('components/SensorDetail');
var $ = require('jquery');
var util = require('utils/util');
var mapc = require('utils/map_common');
var api = require('utils/api');
var mui = require('material-ui'),
  FlatButton = mui.FlatButton,
  List = mui.List,
  Card = mui.Card,
  CardTitle = mui.CardTitle,
  ListItem = mui.ListItem;
  // IconMenu = mui.IconMenu,
  // MenuItem = mui.MenuItem;
var GroupedSelector = require('components/shared/GroupedSelector');

var IconMenu = mui.IconMenu;
var MenuItem = mui.MenuItem;

var Link = Router.Link;
import history from 'config/history'

export default class Groups extends React.Component {
  static defaultProps = {
    user: null
  }

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      loading: false
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  gotoGroup(g) {
    if (g==null) history.replaceState(null, `/app/groups`);
    else history.replaceState(null, `/app/groups/${g.id}`);
  }
  closeDetail() {
    this.gotoGroup(null);
  }

  render_group(g) {
    return (
      <li className="list-group-item">
        <i className="fa fa-folder"/>&nbsp;
        <Link className="title" to={`/app/groups/${g.id}`}>{ g.name }</Link>
      </li>
      )
  }

  render() {
    var detail;
    var _list;
    var center = this.state.map_center;
    return (
      <div>

        <h1>Groups</h1>

        <p className="lead">Groups are a way to organize sensors and targets. Users can access items in a group they have been given permission for.</p>
        { this.props.children }

        <FetchedList renderItem={this.render_group.bind(this)} url="/api/group" listProp="groups" autofetch={true} />

      </div>
    );
  }
}
