var React = require('react');
var Router = require('react-router');
var $ = require('jquery');
var DialogChooser = require('components/DialogChooser');
var LoadStatus = require('components/LoadStatus');
var AppConstants = require('constants/AppConstants');
var mui = require('material-ui');
var RefreshIndicator = mui.RefreshIndicator;
var RaisedButton = mui.RaisedButton;
var FlatButton = mui.FlatButton;
var IconButton = mui.IconButton;
var FetchedList = require('components/FetchedList');
var util = require('utils/util');
var toastr = require('toastr');
var bootbox = require('bootbox');
var UserStore = require('stores/UserStore');
var IconMenu = mui.IconMenu;
var MenuItem = mui.MenuItem;
var api = require('utils/api');
import connectToStores from 'alt/utils/connectToStores';
import history from 'config/history'

var Link = Router.Link;

@connectToStores
export default class GroupDetail extends React.Component {

  static defaultProps = { user: null };
  constructor(props) {
    super(props);
    this.state = {
      group: null,
      loading: false
    };
  }
  static getStores() {
    return [UserStore];
  }
  static getPropsFromStores() {
    var st = UserStore.getState();
    return st;
  }

  componentWillReceiveProps(nextProps) {
    var newGroup = nextProps.params.groupID && (!this.props.params.groupID || nextProps.params.groupID != this.props.params.groupID);
    if (newGroup) {
      this.prepareGroup(nextProps.params.groupID);
    }
  }

  componentDidMount() {
    if (this.props.params.groupID) {
      this.prepareGroup(this.props.params.groupID);
    }
  }

  prepareGroup(id) {
    this.fetchData(id);
  }

  fetchData(_tid) {
    var that = this;
    var tid = _tid || this.props.params.groupID;
    if (tid) {
      this.setState({loading: true, sensor: null});
      api.get("/api/group/"+tid, {}, function(res) {
        if (res.success) {
          that.setState({
            group: res.data.group,
            loading: false
          }, function() {
            util.printTimestampsNow(null, null, null, "UTC");
          });
        } else that.setState({loading:false});
      });
    }
  }

  close() {
    if (this.props.onClose) this.props.onClose();
  }

  gotoSensor(s) {
    history.pushState(null, `/app/sensors/${s.kn}`);
  }

  gotoTarget(t) {
    history.pushState(null, `/app/targets/${t.id}`);
  }

  userAdmin() {
    return this.props.user && this.props.user.level == 4;
  }

  render() {
    var g = this.state.group;
    var user = this.props.user;
    var can_write = user ? user.level > AppConstants.USER_READ : false;
    var content;
    if (!g) {
      content = (<RefreshIndicator size={40} left={50} top={50} status="loading" />);
    } else {
      var _action_items = [];
      content = (
        <div>
          <Link to="/app/groups" className='close'><i className="fa fa-close"></i></Link>
          <h2><i className="fa fa-folder"/> { g.name } <IconButton iconClassName="fa fa-refresh" tooltip="Refresh" onClick={this.fetchData.bind(this, null)}/></h2>
          <div className="row">
            <div className="col-sm-6">
              <small>
                <b>Created:</b> <span data-ts={g.ts_created}></span><br/>
              </small>
            </div>
            <div className="col-sm-6">
              <div hidden={_action_items.length == 0}>
                <IconMenu iconButtonElement={ <FlatButton label="Actions" /> } >
                  { _action_items }
                </IconMenu>
              </div>
            </div>
          </div>

          <div>
            <h2>Sensors</h2>
            <FetchedList url="/api/sensor" params={{group_id: g.id}} autofetch={true} listProp="sensors" labelProp="name" onItemClick={this.gotoSensor.bind(this)} />
          </div>
          <div>
            <h2>Targets</h2>
            <FetchedList url="/api/target" params={{group_id: g.id}} autofetch={true} listProp="targets" labelProp="name" onItemClick={this.gotoTarget.bind(this)} />
          </div>

        </div>
      );
    }
    return (
      <div className="detailBox">
        { content }
      </div>
      );
  }
}
