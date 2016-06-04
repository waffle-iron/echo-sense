var React = require('react');
var Router = require('react-router');
var $ = require('jquery');
import {clone} from 'lodash';
var LoadStatus = require('components/LoadStatus');
var AppConstants = require('constants/AppConstants');
var mui = require('material-ui'),
  RefreshIndicator = mui.RefreshIndicator,
  RaisedButton = mui.RaisedButton,
  FlatButton = mui.FlatButton,
  List = mui.List,
  ListItem = mui.ListItem,
  FontIcon = mui.FontIcon,
  Card = mui.Card,
  CardTitle = mui.CardTitle,
  CardHeader = mui.CardHeader,
  IconButton = mui.IconButton;
var RefreshIndicator = mui.RefreshIndicator;

var util = require('utils/util');
var toastr = require('toastr');
var bootbox = require('bootbox');
var UserStore = require('stores/UserStore');
var GroupStore = require('stores/GroupStore');
var IconMenu = mui.IconMenu;
var MenuItem = mui.MenuItem;
var api = require('utils/api');
import connectToStores from 'alt/utils/connectToStores';
import history from 'config/history'

var Link = Router.Link;

@connectToStores
export default class GroupedSelector extends React.Component {

  static defaultProps = {
    type: "targets", // or "sensors"
    sortProp: null
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
      group_selected: null
    };
  }
  static getStores() {
    return [UserStore, GroupStore];
  }
  static getPropsFromStores() {
    var st = UserStore.getState();
    st.groups = GroupStore.getState().groups;
    return st;
  }

  componentDidUpdate(nextProps) {
  }

  componentDidMount() {
    GroupStore.get_groups();
  }

  fetch_items() {
    var type = this.props.type;
    var that = this;
    var g = this.state.group_selected;
    if (g != null) {
      var uri;
      switch (type) {
        case "targets":
          uri = "/api/target";
          break;
        case "sensors":
          uri = "/api/sensor"
          break;
      }
      this.setState({loading: true});
      var data = {
        group_id: g.id
      };
      api.get(uri, data, function(res) {
        if (res.success) {
          var items = type == "targets" ? res.data.targets : res.data.sensors;
          that.setState({items: items, loading: false});
        } else that.setState({loading:false});
      });
    }
  }

  handle_group_click(g) {
    var that = this;
    this.setState({group_selected: g}, function() {
      that.fetch_items();
    })

  }

  render_group_list() {
    var groups = util.flattenDict(this.props.groups);
    return (
      <Card>
        <CardHeader
          title="Groups"
          subtitle="Choose a group" />
        <List>
          { groups.map(function(g, i) {
            return <ListItem key={i} primaryText={g.name} onClick={this.handle_group_click.bind(this, g)} leftIcon={<FontIcon className="material-icons">folder</FontIcon>} />
          }, this) }
        </List>
      </Card>
    )
  }

  render_item_list() {
    var g = this.state.group_selected;
    if (!g) return <div className="empty"><i className="fa fa-arrow-left"/> Select a group</div>
    var items = clone(this.state.items);
    if (this.props.sortProp) {
      var sp = this.props.sortProp;
      items.sort(function(a, b) { return a[sp] - b[sp]; });
    }
    var title = this.props.type == "targets" ? "Targets" : "Sensors";
    var subtitle = title + " in " + g.name;
    var icon = this.props.type == "targets" ? <FontIcon className="fa fa-th-large"/> : <FontIcon className="fa fa-map-pin"/>;
    return (
      <Card>
        <CardHeader
          title={title}
          subtitle={subtitle} />
        <List>{ items.map(function(item, i) {
            var subhead = this.props.subhead != null ? this.props.subhead(item) : null;
            return <ListItem key={i} primaryText={item.name} iconLeft={icon} secondaryText={subhead} onClick={this.props.onItemClick.bind(this, item)} />
          }, this) }
        </List>
      </Card>
    )
  }

  render() {
    var ri;
    if (this.state.loading) ri = <RefreshIndicator size={40} left={50} top={50} status="loading" />
    return (
      <div className="groupedSelector">
        { ri }
        <div className="row">
          <div className="col-sm-6">
            { this.render_group_list() }
          </div>
          <div className="col-sm-6">
            { this.render_item_list() }
          </div>
        </div>
      </div>
      );
  }
}
