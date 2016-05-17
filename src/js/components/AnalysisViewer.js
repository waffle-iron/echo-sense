var React = require('react');
var Router = require('react-router');

var $ = require('jquery');
var util = require('../utils/util');
var LoadStatus = require('./LoadStatus');
var EntityMap = require('./EntityMap');
var api = require('utils/api');
var GChart = require('./GChart');
var DateTimeField = require('react-bootstrap-datetimepicker');
var moment = require('moment');
var SensorTypeActions = require('actions/SensorTypeActions');
var SensorTypeStore = require('stores/SensorTypeStore');
var Select = require('react-select');
var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var Dialog = mui.Dialog;
var AutoComplete = mui.AutoComplete;
var RaisedButton = mui.RaisedButton;
var AppConstants = require('../constants/AppConstants');
var IconMenu = mui.IconMenu;
var MenuItem = mui.MenuItem;
var toastr = require('toastr');
import {changeHandler} from 'utils/component-utils';
import connectToStores from 'alt/utils/connectToStores';

@connectToStores
@changeHandler
export default class AnalysisViewer extends React.Component {
    static defaultProps = { user: null };

    constructor(props) {
        super(props);
        this.MIN_CHART_DURATION = 1000*60; // 1 minute
        this.state = {
            analyses: [],
            loading: false,
            suggested_columns: [],
            form: {
                limit: 50
            }
        };
    }

    static getStores() {
        return [SensorTypeStore];
    }
    static getPropsFromStores() {
        var st = SensorTypeStore.getState();
        return st;
    }

    componentDidMount() {
        if (Object.keys(this.props.sensor_types).length == 0) SensorTypeActions.fetchTypes();
    }

    componentWillReceiveProps(nextProps) {
        // var prior_col = this._vis_column();
        // var gc_needs_update = prior_col != nextProps.location.query.col && this.refs.chart != null;
        // if (gc_needs_update) {
        //     this.refreshChart();
        // }
    }
    componentDidUpdate(prevProps, prevState) {
        // Gchart needs update?
    }

    fetchData() {
        var form = this.state.form;
        var that = this;
        var skn = this.props.location.query.skn;
        this.refreshChart();
        if (form.sensortype_id || skn) {
            this.setState({loading: true});
            var data = {
                'sensortype_id': form.sensortype_id,
                'with_props': 1,
                'max': form.limit,
            };
            if (skn) data['sensor_kn'] = skn;
            api.get("/api/analysis", data, function(res) {
                if (res.success) {
                    var analyses = res.data.analyses;
                    console.log("Got "+analyses.length+" analyses");
                    var suggested_columns = that.state.suggested_columns;
                    if (analyses.length > 0) {
                        for (var i=0; i<10 && i<analyses.length; i++) {
                            var cols = analyses[i].columns;
                            var colnames = Object.keys(cols);
                            colnames.forEach(function(colname) {
                                if (suggested_columns.indexOf(colname) == -1) {
                                    suggested_columns.push(colname);
                                }
                            });
                        }
                    }
                    that.setState({analyses: analyses, loading: false, suggested_columns: suggested_columns }, function() {
                        // that.refreshChart();
                    });
                } else that.setState({loading: false});
            });
        }
    }

    refreshChart() {
        if (this.refs.chart != null) this.refs.chart.fullInitialize();
    }

    _column() {
        return this.props.location.query.col;
    }

    render() {
        var _visualization;
        var form = this.state.form;
        var analyses = this.state.analyses;
        var skn = this.props.location.query.skn;
        if (analyses.length > 0) {
            var chartColumns = [
                {type: 'string', label: 'Sensor Key', id: 'sensor'},
                {type: 'string', label: 'Value', id: 'value'},
                {type: 'string', role: 'tooltip'},
                {type: 'date', label: 'Start', id: 'start'},
                {type: 'date', label: 'End', id: 'end'}
            ];
            var chartData = this.state.analyses.map(function(a, i, arr) {
                var value = "--";
                if (form.col) {
                    var colval = a.columns[form.col];
                    if (colval) value = colval.toString();
                }
                var start = new Date(a.ts_created);
                var ts_updated = a.ts_updated;
                // Google viz can't handle same start/end
                if (ts_updated == null || ts_updated <= a.ts_created) ts_updated = ts_updated + this.MIN_CHART_DURATION;
                var end = new Date(ts_updated);
                var akn = a.kn;
                return [a.sensor_kn, value, akn, start, end];
            }, this);
            _visualization = (
                <div>
                    <p>The below timeline shows sensors in rows, and bars indicate individual analysis objects. Bars span from the date of creation to the date of last update.</p>
                    <GChart title="Analysis Timeline" columns={chartColumns} data={chartData} ref="chart" type="Timeline" height="600" />
                </div>
            );
        }

        var _sensor_types = util.flattenDict(this.props.sensor_types).map(function(st) {
            return { value: st.id, label: st.name };
        });

        var _limits = [
            { value: 10, label: 10 },
            { value: 50, label: 50 },
            { value: 150, label: 150 }
        ];

        return (
            <div>

                <h1>Analysis Viewer</h1>

                <div className="well">
                    <div className="row">
                        <div className="col-sm-6">

                            <div className="form-group" hidden={skn==null}>
                                <label>Sensor</label><br/>
                                <span>{ skn }</span>
                            </div>

                            <div className="form-group" hidden={skn!=null}>
                                <label>Sensor Type</label>
                                <Select
                                    simpleValue
                                    value={form.sensortype_id}
                                    options={_sensor_types}
                                    onChange={this.changeHandlerVal.bind(this, 'form', 'sensortype_id')} />
                            </div>

                            <div className="form-group">
                                <label>Limit</label>
                                <Select
                                    simpleValue
                                    value={form.limit}
                                    options={_limits}
                                    onChange={this.changeHandlerVal.bind(this, 'form', 'limit')} />
                            </div>

                            <RaisedButton label="Reload" onClick={this.fetchData.bind(this)} />

                        </div>

                        <div className="col-sm-6">

                            <label>Show Column Data</label><br/>
                            <AutoComplete
                                hintText="Column Data"
                                searchText={form.col}
                                dataSource={this.state.suggested_columns}
                                onNewRequest={this.changeHandlerVal.bind(this, 'form', 'col')}
                                onChange={this.changeHandlerVal.bind(this, 'form', 'col')}
                                onUpdateInput={this.changeHandlerVal.bind(this, 'form', 'col')} />

                            <RaisedButton label="Update" onClick={this.refreshChart.bind(this)} />
                        </div>

                    </div>
                </div>

                { _visualization }

                <LoadStatus loading={this.state.loading} empty={this.state.analyses.length == 0}/>

            </div>
        );
    }
}
