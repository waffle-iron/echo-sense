var React = require('react');
var Router = require('react-router');
var $ = require('jquery');
var DialogChooser = require('components/DialogChooser');
var LoadStatus = require('components/LoadStatus');
var AppConstants = require('constants/AppConstants');
var mui = require('material-ui');
var SensorContactEditor = require('components/SensorContactEditor');
var RefreshIndicator = mui.RefreshIndicator;
var RaisedButton = mui.RaisedButton;
var FlatButton = mui.FlatButton;
var IconButton = mui.IconButton;
var util = require('utils/util');
var toastr = require('toastr');
var bootbox = require('bootbox');
var UserStore = require('stores/UserStore');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var api = require('utils/api');
import connectToStores from 'alt/utils/connectToStores';
import history from 'config/history'

var Link = Router.Link;

@connectToStores
export default class SensorDetail extends React.Component {

  static defaultProps = { user: null };
  constructor(props) {
    super(props);
    this.PROCESS_STATUS_LABELS = ["","Never Run","OK","Warning","Error"];
    this.state = {
      sensor: null,
      loading: false,
      records: [],
      alarms: [],
      analyses: [],
      processers: [],
      dialogs: {
        chooser_open: false,
        rule_chooser_open: false
      }
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
    var newSensor = nextProps.params.sensorKn && (!this.props.params.sensorKn || nextProps.params.sensorKn != this.props.params.sensorKn);
    if (newSensor) {
      this.prepareSensor(nextProps.params.sensorKn);
    }
  }

  componentDidMount() {
    if (this.props.params.sensorKn) {
      this.prepareSensor(this.props.params.sensorKn);
    }
  }

  hide_show_dialog(id, open) {
    var dialogs = this.state.dialogs;
    dialogs[id] = open;
    this.setState({dialogs: dialogs});
  }

  prepareSensor(skn) {
    this.fetchData(skn);
  }

  fetchData(_skn) {
    var that = this;
    var sensorKn = _skn || this.props.params.sensorKn;
    if (sensorKn) {
      this.setState({loading: true, sensor: null});
      var data = {
        'with_records': 0,
        'with_processers': 1,
        'with_analyses': 4
      };
      $.getJSON("/api/sensor/"+sensorKn, data, function(res) {
        if (res.success) {
          that.setState({
            sensor: res.data.sensor,
            records: res.data.sensor.records,
            alarms: res.data.sensor.alarms,
            analyses: res.data.sensor.analyses,
            processers: res.data.sensor.processers,
            loading: false
          }, function() {
            util.printTimestampsNow(null, null, null, "UTC");
          });
        } else that.setState({loading:false});
      }, 'json');
    }
  }

  close() {
    if (this.props.onClose) this.props.onClose();
  }

  gotoDataViewer(opts) {
    var params = {
      kn: this.state.sensor.kn
    };
    if (opts != null) {
      util.mergeObject(params, opts);
    }
    history.replaceState(null, '/app/data', params);
  }

  userAdmin() {
    return this.props.user && this.props.user.level == 4;
  }

  handleAssociateClick() {
    this.hide_show_dialog('chooser_open', true);
  }

  associateProcesser(p) {
    var that = this;
    var data = {
      'key': p.key,
      'skey': this.state.sensor.key
    }
    $.post("/api/processtask/associate", data, function(res) {
      if (res.success) {
        var processers = that.state.processers;
        processers.push(res.data.spt);
        that.setState({processers: processers});
      }
    }, 'json');
  }

  runProcesser(spt) {
    bootbox.confirm('Really run '+spt.label+'?', function(result){
      if (result) {
        var that = this;
        var data = {
          'sptkey': spt.key
        }
        $.post("/api/processtask/run", data, function(res) {
          if (res.success) {
            toastr.info("Running...");
          }
        }, 'json');
      } else {

      }
    });
  }

  handle_clear_alarms() {
    this.hide_show_dialog('rule_chooser_open', true);
  }

  handle_clear_data() {
    this.delete_sensor_data();
  }

  delete_alarms(rule) {
    var that = this;
    if (rule != null) {
      var data = { rule_id: rule.id };
      $.post("/api/sensor/"+that.state.sensor.kn+"/action/delete_all_alarms", data, function(res) {
        if (res.success) {
          if (res.message) toastr.info(res.message);
          that.fetchData(null);
        }
      }, 'json');
    }
  }

  delete_sensor_data() {
    var that = this;
    api.post("/api/sensor/"+that.state.sensor.kn+"/action/delete_all_records", {}, function(res) {
      if (res.success) {
        if (res.message) toastr.info(res.message);
      }
    });
  }

  showAnalysisDetail(a) {
    bootbox.dialog({
        title: "Analysis " + a.kn,
        message: "<pre>"+JSON.stringify(a.columns)+"</pre>"
    });
  }

  showRecordDetail(r) {
    bootbox.dialog({
        title: "Data Point at " + util.printDate(r.ts),
        message: "<pre>"+JSON.stringify(r.columns)+"</pre>"
    });
  }

  handle_contacts_change(contacts_json) {
    console.log(contacts_json);
    var s = this.state.sensor;
    s.contacts = JSON.stringify(contacts_json);
    this.setState({sensor: s});
  }

  render() {
    var s = this.state.sensor;
    var user = this.props.user;
    var can_write = user ? user.level > AppConstants.USER_READ : false;
    var content;
    if (!s) {
      content = (<RefreshIndicator size={40} left={50} top={50} status="loading" />);
    } else {
      var _alarms = this.state.alarms.map(function(a, i, arr) {
        var buffer = AppConstants.DATA_WINDOW_BUFFER_MS;
        // var query = {
        //   'sta': a.ts_start - buffer,
        //   'end': a.ts_end + buffer
        // }
        return <li className="list-group-item" key={"a"+i}>
          <span className="title">{ a.rule_name }</span>
          <span className="sub" data-ts={a.ts_start}></span>
          <Link to={`/app/alarms/${s.kn}/${a.id}`}><i className="fa fa-warning"></i></Link>
        </li>
      }, this);
      var _analyses = this.state.analyses.map(function(a, i, arr) {
        return <li className="list-group-item" key={"an"+i}>
          <span className="title" title={ a.kn } onClick={this.showAnalysisDetail.bind(this, a)}>Analysis</span>
          <span className="sub" data-ts={a.ts_created}></span>
        </li>
      }, this);
      var _processers = this.state.processers.map(function(p, i, arr) {
        var detail = "Last run: " + util.printDate(p.ts_last_run);
        if (p.narrative_last_run) detail += " Narrative: " + p.narrative_last_run;
        return <li className="list-group-item" title={detail} key={"p"+i}>
          <span className="title">{ p.label }</span>
          <span className="sub">{ this.PROCESS_STATUS_LABELS[p.status_last_run] }</span>
          <a href="javascript:void(0)" className="right" hidden={!can_write} onClick={this.runProcesser.bind(this, p)}>Run</a>
          </li>
      }, this);
      var _action_items = [];
      if (can_write) _action_items.push(<MenuItem key="cl_alarms" primaryText="Clear Alarms" onClick={this.handle_clear_alarms.bind(this)} />);
      if (can_write) _action_items.push(<MenuItem key="cl_data" primaryText="Clear Data" onClick={this.handle_clear_data.bind(this)} />);
      if (can_write) _action_items.push(<MenuItem key="associate" primaryText="Associate Processer" onClick={this.handleAssociateClick.bind(this)} />);
      // Battery UI
      var _charging_icon;
      var batt_level_icon = parseInt(s.batt_level * 4);
      if (s.batt_charging) _charging_icon = <i className="fa fa-bolt"></i>
      var contacts_json = {};
      if (s.contacts != null) contacts_json = JSON.parse(s.contacts);
      content = (
        <div>
          <Link to="/app/sensors" className='close'><i className="fa fa-close"></i></Link>
          <h2>{ s.name } <IconButton iconClassName="fa fa-refresh" tooltip="Refresh" onClick={this.fetchData.bind(this, null)}/></h2>
          <div className="row">
            <div className="col-sm-6">
              <small>
                <b>Created:</b> <span data-ts={s.ts_created}></span><br/>
                <b>Updated:</b> <span data-ts={s.ts_updated}></span><br/>
                <span hidden={true}><b>Battery:</b> <span title={s.batt_charging ? "Charging" : "Not Charging"}><i className={"fa fa-battery-"+batt_level_icon}></i> { util.printPercent(s.batt_level) } { _charging_icon }</span></span>
              </small>
            </div>
            <div className="col-sm-3">
              <div hidden={_action_items.length == 0}>
                <IconMenu iconButtonElement={ <FlatButton label="Actions" /> } openDirection="bottom-right">
                  { _action_items }
                </IconMenu>
              </div>
            </div>
            <div className="col-sm-3">
              <RaisedButton secondary={true} linkButton={true} containerElement={ <Link to={`/app/data/${s.kn}`} /> } label="Data Viewer" />
            </div>
          </div>

          <div className="well">
            <div className="row">
              <div className="col-sm-6">
                <h4>Analyses</h4>
                <ul className="list-group">
                  { _analyses }
                </ul>
              </div>
              <div className="col-sm-6">
                <h4>Processers</h4>
                <ul className="list-group">
                  { _processers }
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <h3>Alarms</h3>
              <ul className="list-group">
                { _alarms }
              </ul>
            </div>

            <div className="col-sm-6">
              <h3>Contacts</h3>

              <SensorContactEditor contacts={contacts_json} onChange={this.handle_contacts_change.bind(this)} />
            </div>

          </div>

          <DialogChooser prompt="Choose a processer to associate with this sensor" url="/api/processtask" listProp="processtasks" ref="chooser" onItemChosen={this.associateProcesser.bind(this)} open={this.state.dialogs.chooser_open} onRequestClose={this.hide_show_dialog.bind(this, 'chooser_open', false)} />

          <DialogChooser prompt="Choose which alarm type to delete" url="/api/rule" listProp="rules" labelProp="name" onItemChosen={this.delete_alarms.bind(this)} open={this.state.dialogs.rule_chooser_open} onRequestClose={this.hide_show_dialog.bind(this, 'rule_chooser_open', false)} />
        </div>
      );
    }
    return (
      <div className="sensorDetail detailBox">
        { content }
      </div>
      );
  }
}

SensorDetail.contextTypes = {
  router: React.PropTypes.func
};
