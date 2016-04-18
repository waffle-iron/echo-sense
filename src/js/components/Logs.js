var React = require('react');
var Router = require('react-router');

var FetchedList = require('components/FetchedList');
var LoadStatus = require('components/LoadStatus');
var util = require('utils/util');
var AppConstants = require('constants/AppConstants');

import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
var Link = Router.Link;

var Logs = React.createClass({displayName: 'Logs',
  getDefaultProps: function() {
    return {
    };
  },
  getInitialState: function() {
    return {
      section: "sensors"
    };
  },
  componentDidMount: function() {

  },
  renderSensor: function(s) {
    return (
      <li className="list-group-item">
        <Link to={`/app/sensors/${s.kn}`} className="title">{ s.name }</Link>
        <span className="sub">Last Update: <span data-ts={s.ts_updated}></span></span>
      </li>
      );
  },
  renderProcesser: function(p) {
    return (
      <li className="list-group-item">
        <span className="title">{ p.label }</span>
        <span className="sub">Last Run: <span data-ts={p.ts_last_run}></span></span>
      </li>
      );
  },
  renderAlarm: function(a) {
    return (
      <li className="list-group-item">
        <Link to={`/app/alarms/${a.sensor_kn}/${a.id}`} className="title">{ a.rule_name }</Link>
        <span className="sub ital">{ a.sensor_name }</span>
        <span className="sub" data-ts={a.ts_start}></span>
      </li>
      );
  },
  renderAPILog: function(al) {
    return (
      <li className="list-group-item">
        <span className="title">{ al.path }</span>
        <span className="label label-default">{ al.method }</span>
        <span className="sub">{ al.status }</span>
        <span data-ts={al.ts}></span>
      </li>
      );
  },

  renderPayment: function(pmnt) {
    var title = pmnt.amount + " " + pmnt.currency
    var status_text = util.findItemById(AppConstants.PAYMENT_STATUSES, pmnt.status, 'value').label;
    var user_text = pmnt.user ? (pmnt.user.name || pmnt.user.phone) : "--";
    return (
      <li className="list-group-item">
        <span className="title">{ title }</span>
        <span className="label label-default">{ status_text }</span>
        <span className="sub right">{ user_text }</span>
        <span data-ts={pmnt.ts_created}></span>
      </li>
      );
  },

  renderAnalysis: function(a) {
    return (
      <li className="list-group-item">
        <Link to={`/app/analysis/${a.kn}`} className="title">{ a.kn }</Link>
        <span className="sub">{ a.sensor_id }</span>
        <span data-ts={a.ts_updated}></span>
      </li>
      );
  },

  section_change(e, index, section) {
    this.setState({section: section});
  },

  render: function() {
    var sensor_update_cutoff = util.nowTimestamp() - 1000*60*30; // last 30 mins
    var content;
    var sec = this.state.section;
    if (sec == "sensors") content = <FetchedList key="sensor" url="/api/sensor" params={{updated_since: sensor_update_cutoff}} listProp="sensors" renderItem={this.renderSensor} autofetch={true}/>
    else if (sec == "process_tasks") content = <FetchedList key="pt" url="/api/sensorprocesstask" listProp="sensorprocesstasks" renderItem={this.renderProcesser} autofetch={true}/>
    else if (sec == "alarms") content = <FetchedList key="alarm" url="/api/alarm" params={{ with_props: "sensor_name" }} listProp="alarms" renderItem={this.renderAlarm} autofetch={true} />
    else if (sec == "apilogs") content = <FetchedList key="apilog" url="/api/apilog" ref="fl_logs" listProp="logs" renderItem={this.renderAPILog} autofetch={true} />
    else if (sec == "payments") content = <FetchedList key="payment" url="/api/payment" params={{with_user: 1}} listProp="payments" renderItem={this.renderPayment} autofetch={true} />
    else if (sec == "analyses") content = <FetchedList key="analysis" url="/api/analysis" params={{with_props: 1}} listProp="analyses" renderItem={this.renderAnalysis.bind(this)} autofetch={true} />
    return (
        <div>
          <h2><i className="fa fa-list-ul"></i> Logs</h2>

          <DropDownMenu value={this.state.section} onChange={this.section_change.bind(this)}>
            <MenuItem value="sensors" primaryText="Sensors"/>
            <MenuItem value="process_tasks" primaryText="Process Tasks"/>
            <MenuItem value="alarms" primaryText="Alarms"/>
            <MenuItem value="apilogs" primaryText="API Logs"/>
            <MenuItem value="payments" primaryText="Payments"/>
            <MenuItem value="analyses" primaryText="Analyses"/>
          </DropDownMenu>

          <div className="vpad">
          { content }
          </div>

        </div>
    );
  }
});

module.exports = Logs;