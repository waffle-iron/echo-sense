'use strict';

var React = require('react');
var Router = require('react-router');

var EntityMap = require('components/EntityMap');
var SensorDetail = require('components/SensorDetail');
var $ = require('jquery');
var util = require('utils/util');
var api = require('utils/api');
var mapc = require('utils/map_common');
var RouteHandler = Router.RouteHandler;
var FetchedList = require('components/FetchedList');
var api = require('utils/api');
var toastr = require('toastr');
var mui = require('material-ui'),
  FlatButton = mui.FlatButton,
  DatePicker = mui.DatePicker,
  TimePicker = mui.TimePicker;

import {Tabs, Tab} from 'material-ui/Tabs';

import {changeHandler} from 'utils/component-utils';

var IconMenu = mui.IconMenu;
var MenuItem = mui.MenuItem;

var Link = Router.Link;

@changeHandler
export default class Reports extends React.Component {
  static defaultProps = { user: null };

  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      form: {},
      loading: false
    };
  }
  componentDidMount() {
    this.fetchReports();
  }
  componentDidUpdate(prevProps, prevState) {
    var detailOpenClose = (prevProps.params.sensorKn == null) != (this.props.params.sensorKn == null);
    if (detailOpenClose) this.refs.map.resize();
  }
  fetchReports() {
    var that = this;
    this.setState({loading: true});
    var data = {
    };
    api.get("/api/report", data, function(res) {
      if (res.success) {
        var reports = res.data.reports;
        that.setState({reports: reports, loading: false });
      } else that.setState({loading: false});
    });
  }
  generate_report(type_int) {
    var data = {
      type: type_int
    };
    api.post("/api/report/generate", data, function(res) {
      toastr.info("Generating...");
    })
  }
  download(r) {
    if (r.serve_url) window.open(r.serve_url,'_blank');
  }
  renderReport(r) {
    return (
      <li className="list-group-item">
        <span className="title">{ r.title }</span>
        <a href="javascript:void(0)" onClick={this.download.bind(this, r)}>Download</a>
        <span className="sub right" data-ts={r.ts_created}></span>
      </li>
      )
  }

  render() {
    var form = this.state.form;
    return (
      <div>
        <h1>Reports</h1>
        <FetchedList url="/api/report" listProp="reports" renderItem={this.renderReport} autofetch={true}/>

        <h1>Generate Report</h1>
        <Tabs>
          <Tab label="Alarms">

            <div className="row">
              <div className="col-sm-6">
                <DatePicker onChange={this.changeHandler.bind(this, 'form', 'start')} value={form.start} autoOk={true} hintText="form" />
              </div>
              <div className="col-sm-6">
                <DatePicker onChange={this.changeHandler.bind(this, 'form', 'end')} value={form.end} autoOk={true} hintText="End" />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
              </div>
            </div>

            <FlatButton label="Generate" onClick={this.generate_report.bind(this, 2)} />
          </Tab>

          <Tab label="Analyses">

            <div className="row">
              <div className="col-sm-6">
                <DatePicker onChange={this.changeHandler.bind(this, 'form', 'start')} value={form.start} autoOk={true} hintText="form" />
              </div>
              <div className="col-sm-6">
                <DatePicker onChange={this.changeHandler.bind(this, 'form', 'end')} value={form.end} autoOk={true} hintText="End" />
              </div>
            </div>

            <FlatButton label="Generate" onClick={this.generate_report.bind(this, 3)} />
          </Tab>
        </Tabs>
      </div>
    );
  }
};
