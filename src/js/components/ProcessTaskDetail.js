var React = require('react');
var Router = require('react-router');
var $ = require('jquery');
var DialogChooser = require('components/DialogChooser');
var LoadStatus = require('components/LoadStatus');
var AppConstants = require('constants/AppConstants');
var mui = require('material-ui'),
  RefreshIndicator = mui.RefreshIndicator,
  RaisedButton = mui.RaisedButton,
  FlatButton = mui.FlatButton,
  IconButton = mui.IconButton,
  TextField = mui.TextField,
  IconMenu = mui.IconMenu,
  MenuItem = mui.MenuItem,
  FontIcon = mui.FontIcon;
var FetchedList = require('components/FetchedList');
var util = require('utils/util');
var toastr = require('toastr');
var bootbox = require('bootbox');
var UserStore = require('stores/UserStore');
var ProcessTaskStore = require('stores/ProcessTaskStore');
var ProcessTaskActions = require('actions/ProcessTaskActions');
var IconMenu = mui.IconMenu;
var MenuItem = mui.MenuItem;
var api = require('utils/api');
import {merge} from 'lodash';
import connectToStores from 'alt/utils/connectToStores';
import history from 'config/history'

var Link = Router.Link;

@connectToStores
export default class ProcessTaskDetail extends React.Component {

  static defaultProps = { user: null };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      form: {}
    };
  }
  static getStores() {
    return [UserStore, ProcessTaskStore];
  }
  static getPropsFromStores() {
    var st = UserStore.getState();
    merge(st, ProcessTaskStore.getState());
    return st;
  }

  componentDidUpdate(prevProps, prevState) {
    var newTask = this.props.params.processtaskID && (!prevProps.params.processtaskID || this.props.params.processtaskID != prevProps.params.processtaskID);
    if (newTask) {
      this.prepare_task(this.props.params.processtaskID);
      this.refs.sensors.refresh();
      this.refs.targets.refresh();
    }
  }

  componentDidMount() {
    if (this.props.params.processtaskID) {
      this.prepare_task(this.props.params.processtaskID);
    }
  }

  prepare_task(id) {
    ProcessTaskActions.get_task(id);
  }

  fetch_task() {
    var tid = this.props.params.processtaskID;
    ProcessTaskActions.fetchTask(tid);
  }

  task() {
    var tid = this.props.params.processtaskID;
    if (tid) return this.props.tasks[tid];
    return null;
  }

  close() {
    if (this.props.onClose) this.props.onClose();
  }

  userAdmin() {
    return this.props.user && this.props.user.level == 4;
  }

  confirm_delete() {
    bootbox.confirm("Really delete?", (ok) => {
      if (ok) {
        var g = this.task();
        ProcessTaskActions.delete(g.key);
        this.props.history.push("/app/analyze/settings");
      }
    });
  }

  render() {
    // TODO: Implement form
    // { name: 'id', label: "ID" },
    // { name: 'label', label: "Label", editable: true },
    // { name: 'interval', label: "Interval (secs)", editable: true, hint: "Task scheduled to run up to [interval] after new data is received." },
    // { name: 'rule_ids', label: "Rules", editable: true, editOnly: true, hint: "Comma separated list of rule IDs", inputType: "select", multiple: true, opts: rule_opts },
    // { name: 'time_start', label: "Start Time", editable: true },
    // { name: 'time_end', label: "End Time", editable: true },
    // { name: 'month_days', label: "Days of Month (1 - 31)", editOnly: true, editable: true, formFromValue: util.comma_join, hint: "Task will run if day matches either month day or week day, so either or both must be set. Comma separated list of ints." },
    // { name: 'week_days', label: "Days of Week", editOnly: true, editable: true, multiple: true, opts: AppConstants.WEEKDAYS, inputType: "select" },
    // { name: 'spec', label: "Spec", inputType: "textarea", editOnly: true, editable: true, hint: "JSON object which can contain a 'processers' Array of objects with props: analysis_key_pattern, calculation, column." }
    var task = this.task();
    var user = this.props.user;
    var form = this.state.form;
    var can_write = user ? user.level > AppConstants.USER_READ : false;
    var content;
    if (!task) {
      content = (<RefreshIndicator size={40} left={50} top={50} status="loading" />);
    } else {
      var _action_items = [];
      content = (
        <div>
          <h2>Process Task</h2>
          <TextField name="label" floatingLabelText="Label" value={form.label} fullWidth={true} />
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
