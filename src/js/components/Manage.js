var React = require('react');

var util = require('utils/util');

var AppConstants = require('constants/AppConstants');
var SimpleAdmin = require('components/SimpleAdmin');
var LoadStatus = require('components/LoadStatus');
var GroupActions = require('actions/GroupActions');
var GroupStore = require('stores/GroupStore');
var TargetActions = require('actions/TargetActions');
var TargetStore = require('stores/TargetStore');
var SensorTypeActions = require('actions/SensorTypeActions');
var SensorTypeStore = require('stores/SensorTypeStore');
import connectToStores from 'alt/utils/connectToStores';

@connectToStores
export default class Manage extends React.Component {
    static defaultProps = {};
    constructor(props) {
        super(props);
        this.state = {
            tab: "sensors"
        };
    }

    static getStores() {
        return [GroupStore, SensorTypeStore, TargetStore];
    }

    static getPropsFromStores() {
        var st = GroupStore.getState();
        st.sensor_types = SensorTypeStore.getState().sensor_types;
        st.targets = TargetStore.getState().targets;
        return st;
    }

    componentDidMount() {
        GroupActions.fetchGroups();
        SensorTypeActions.fetchTypes();
        TargetActions.fetchTargets();
    }

    gotoTab(tab) {
        this.setState({tab: tab});
    }

    render() {
        var that = this;
        var props;
        var tab = this.state.tab;
        var tabs = [
            {id: 'sensors', label: "Sensors"},
            {id: 'stypes', label: "Sensor Types"},
            {id: 'groups', label: "Groups"},
            {id: 'targets', label: "Targets"},
            {id: 'rules', label: "Rules"},
            {id: 'processes', label: "Process Tasks"},
        ];
        if (tab == "sensors") {
            var group_opts = util.flattenDict(this.props.groups).map(function(group, i, arr) {
                return { val: group.id, lab: group.name };
            });
            var type_opts = util.flattenDict(this.props.sensor_types).map(function(st, i, arr) {
                return { val: st.id, lab: st.name };
            });
            var target_opts = util.flattenDict(this.props.targets).map(function(target, i, arr) {
                return { val: target.id, lab: target.name };
            });
            props = {
                'url': "/api/sensor",
                'id': 'sa',
                'entity_name': "Sensors",
                'attributes': [
                    { name: 'kn', label: "Key Name", editable: true, fixed: true },
                    { name: 'name', label: "Name", editable: true },
                    { name: 'contacts', label: "Contacts", editable: true, inputType: 'textarea', editOnly: true, hint: "JSON object with keys as user alias and values as user ID" },
                    { name: 'sensortype_id', label: "Type", editable: true, inputType: "select", opts: type_opts,
                        fromValue: function(type_id) { return (that.props.sensor_types[type_id] != null) ? that.props.sensor_types[type_id].name : "-"; } },
                    { name: 'group_ids', label: "Groups", editable: true, editOnly: true, inputType: "select", multiple: true, opts: group_opts },
                    { name: 'target_id', label: "Target", editable: true, editOnly: false, inputType: "select", opts: target_opts, fromValue: function(target_id) { return (that.props.targets[target_id] != null) ? that.props.targets[target_id].name : "-"; } }
                ],
                'add_params': {},
                'unique_key': 'key',
                'max': 50,
                getListFromJSON: function(data) { return data.data.sensors; },
                getObjectFromJSON: function(data) { return data.data.sensor; }
            }
        } else if (tab == "stypes") {

            props = {
                'url': "/api/sensortype",
                'id': 'sa',
                'entity_name': "Sensor Types",
                'attributes': [
                    { name: 'id', label: "ID" },
                    { name: 'name', label: "Name", editable: true },
                    { name: 'alias', label: "Alias", editable: true },
                    { name: 'schema', label: "Schema", editable: true,
                        hint: "JSON object, e.g. {'length': {'unit': 'm', 'type': 'number'}}",
                        editOnly: true, inputType: "textarea" }
                ],
                'add_params': {},
                'unique_key': 'key',
                'max': 50,
                'detail_url': function(item) {
                    return "/admin/sensortype/"+item.key;
                },
                getListFromJSON: function(data) { return data.data.sensortypes; },
                getObjectFromJSON: function(data) { return data.data.sensortype; },
                onItemCreated: function(item) { SensorTypeActions.manualUpdate(item); }
            }
        } else if (tab == "rules") {
            var plimit_type_opts = [];
            AppConstants.RULE_PLIMIT_TYPES.forEach(function(op, i, arr) {
                if (!op.disabled) plimit_type_opts.push({ val: op.value, lab: op.label });
            });
            var trigger_opts = AppConstants.RULE_TRIGGERS.map(function(op, i, arr) {
                return { val: op.value, lab: op.label };
            });

            props = {
                'url': "/api/rule",
                'id': 'sa',
                'entity_name': "Rule",
                'attributes': [
                    { name: 'id', label: "ID" },
                    { name: 'name', label: "Name", editable: true },
                    { name: 'column', label: "Column", editable: true },
                    { name: 'trigger', label: "Trigger", editable: true, inputType: "select", opts: trigger_opts },
                    { name: 'duration', label: "Duration (ms)", editable: true,editOnly: true },
                    { name: 'buffer', label: "Buffer (ms)", editable: true,editOnly: true },
                    { name: 'plimit_type', label: "Period Limit Type", hint: "Type of Period (for period limit)", editable: true, editOnly: true, inputType: "select", opts: plimit_type_opts, defaultValue: -2 },
                    { name: 'plimit', label: "Period Limit", hint: "Allowed alarms per period", editable: true, editOnly: true },
                    { name: 'consecutive', label: "Consecutive", editable: true, editOnly: true },
                    { name: 'consecutive_limit', label: "Consecutive Limit (deactivate after)", editable: true, editOnly: true },
                    { name: 'value1', label: "Value 1", editable: true, editOnly: true },
                    { name: 'value2', label: "Value 2", editable: true, editOnly: true },
                    { name: 'value_complex', label: "Complex Value", editable: true, editOnly: true, inputType: 'textarea', hint: "JSON representation of complex rule values. See geojson.io for GeoJSON editor." },
                    { name: 'alert_contacts', label: "Alert Contacts (list of contact aliases)", editable: true, editOnly: true, formFromValue: util.comma_join },
                    { name: 'alert_message', label: "Alert Message", editable: true, editOnly: true },
                    { name: 'payment_contacts', label: "Payment Contacts (list of contact aliases)", editable: true, editOnly: true, formFromValue: util.comma_join },
                    { name: 'payment_amount', label: "Payment Amount (user currency)", editable: true, editOnly: true }
                ],
                'add_params': {},
                'unique_key': 'key',
                'max': 50,
                getListFromJSON: function(data) { return data.data.rules; },
                getObjectFromJSON: function(data) { return data.data.rule; }
            }
        } else if (tab == "groups") {

            props = {
                'url': "/api/group", // Duplicate fetch here and flux
                'id': 'sa',
                'entity_name': "Sensor Group",
                'attributes': [
                    { name: 'id', label: "ID" },
                    { name: 'name', label: "Name", editable: true },
                ],
                'add_params': {},
                'unique_key': 'key',
                'max': 50,
                getListFromJSON: function(data) { return data.data.groups; },
                getObjectFromJSON: function(data) { return data.data.group; },
                onItemCreated: function(item) { GroupActions.manualUpdate(item); }
            }

        } else if (tab == "targets") {
            var group_opts = util.flattenDict(this.props.groups).map(function(group, i, arr) {
                return { val: group.id, lab: group.name };
            });
            props = {
                'url': "/api/target",
                'id': 'sa',
                'entity_name': "Target",
                'attributes': [
                    { name: 'id', label: "ID" },
                    { name: 'name', label: "Name", editable: true },
                    { name: 'lat', label: "Latitude", editable: true },
                    { name: 'lon', label: "Longitude", editable: true },
                    { name: 'group_ids', label: "Groups", editable: true, editOnly: true, inputType: "select", multiple: true, opts: group_opts }
                ],
                'add_params': {},
                'unique_key': 'key',
                'max': 50,
                getListFromJSON: function(data) { return data.data.targets; },
                getObjectFromJSON: function(data) { return data.data.target; },
                onItemCreated: function(item) { TargetActions.manualUpdate(item); }
            }

        } else if (tab == "processes") {

            props = {
                'url': "/api/processtask",
                'id': 'sa',
                'entity_name': "Process Task",
                'attributes': [
                    { name: 'id', label: "ID" },
                    { name: 'label', label: "Label", editable: true },
                    { name: 'interval', label: "Interval (secs)", editable: true, hint: "Task scheduled to run up to [interval] after new data is received." },
                    { name: 'rule_ids', label: "Rules", editable: true, editOnly: true, hint: "Comma separated list of rule IDs", formFromValue: util.comma_join },
                    { name: 'time_start', label: "Start Time", editable: true },
                    { name: 'time_end', label: "End Time", editable: true },
                    { name: 'month_days', label: "Days of Month (1 - 31)", editOnly: true, editable: true, formFromValue: util.comma_join, hint: "Task will run if day matches either month day or week day, so either or both must be set. Comma separated list of ints." },
                    { name: 'week_days', label: "Days of Week (1:Mon - 7:Sun)", editOnly: true, formFromValue: util.comma_join, editable: true },
                    { name: 'spec', label: "Spec", inputType: "textarea", editOnly: true, editable: true, hint: "JSON object which can contain a 'processers' Array of objects with props: analysis_key_pattern, calculation, column." }
                ],
                'add_params': {},
                'unique_key': 'key',
                'max': 50,
                'detail_url': function(item) {
                    return "/admin/processtask/"+item.key;
                },
                getListFromJSON: function(data) { return data.data.processtasks; },
                getObjectFromJSON: function(data) { return data.data.processtask; }
            }

        }
        var _tabs = tabs.map(function(t, i, arr) {
            var here = this.state.tab == t.id;
            var cn = here ? "active" : "";
            return <li role="presentation" data-t={t.id} className={cn} key={"tab"+i}><a href="javascript:void(0)" onClick={this.gotoTab.bind(this, t.id)}>{t.label}</a></li>
        }, this);
        return (
            <div>

                <h2><i className="fa fa-wrench"></i> Manage</h2>

                <ul className="nav nav-pills">
                    { _tabs }
                </ul>

                <SimpleAdmin {...props} />

            </div>
        );
    }
};

module.exports = Manage;