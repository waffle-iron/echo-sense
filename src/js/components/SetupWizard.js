'use strict';

var React = require('react');
var Router = require('react-router');

var FetchedList = require('components/FetchedList');
var SensorDetail = require('components/SensorDetail');
var SensorTypeSchemaEditor = require('components/SensorTypeSchemaEditor');
var $ = require('jquery');
var util = require('utils/util');
var mapc = require('utils/map_common');
var api = require('utils/api');
var AppConstants = require('constants/AppConstants');
var mui = require('material-ui'),
  FlatButton = mui.FlatButton,
  RaisedButton = mui.RaisedButton,
  List = mui.List,
  TextField = mui.TextField,
  Card = mui.Card,
  Subheader = mui.Subheader,
  CardTitle = mui.CardTitle,
  ListItem = mui.ListItem;

var IconMenu = mui.IconMenu;
var MenuItem = mui.MenuItem;

var Link = Router.Link;
import history from 'config/history'
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

export default class SetupWizard extends React.Component {
  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      // We populate these as user fills form
      // Then at end, we sync each to server in a loop
      objects: {
        sensor: {},
        sensortype: {},
        group: {},
        target: {},
        rule: {},
        processtask: {}
      },
      sync_step: -1 // Not syncing
    };
    this.SYNC_ORDER = ['group', 'target', 'sensortype', 'sensor', 'rule', 'processtask'];
    this.STEPS = [
      { label: "Create a Group" },
      { label: "Create a Target" },
      { label: "Create a Sensor" },
      { label: "Add a Rule" },
      { label: "Configure Processing" }
    ];
  }

  save_object(obj_name) {
    var api_uri = {
      group: "/api/group",
      target: "/api/target",
      sensortype: "/api/sensortype",
      sensor: "/api/sensor",
      rule: "/api/rule",
      processtask: "/api/processtask"
    }[obj_name];
    var obj = this.state.objects[obj_name];
    if (obj && api_uri) {
      api.post(api_uri, {}, function(res) {

      });
    }
  }

  save_all_data() {
    var that = this;
    this.setState({sync_step: 0});
    this.SYNC_ORDER.forEach(function(obj_name) {
      that.save_object(obj_name);
    });
  }

  eventChangeObj(obj_name, prop, e) {
    var val = e.target.value;
    this.changeObj(obj_name, prop, val);
  }

  changeObj(obj_name, prop, value) {
    console.log(obj_name + "." + prop + " -> " + value);
    var objects = this.state.objects;
    objects[obj_name][prop] = value;
    this.setState({objects: objects});
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= this.STEPS.length - 1,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        // group
        var obj = this.state.objects.group;
        return (
          <div>
            <p>Start by creating a group to help organize our sensors and targets</p>

            <TextField fullWidth={true} floatingLabelText="Name"  value={obj.name} onChange={this.eventChangeObj.bind(this, 'group', 'name')} />
          </div>
        );
      case 1:
        // target
        var obj = this.state.objects.target;
        return (
          <div>
            <div>Now create a target.</div>
            <div>{ AppConstants.OBJECT_TIPS.TARGET }</div>

            <TextField fullWidth={true} floatingLabelText="Name"  value={obj.name} onChange={this.eventChangeObj.bind(this, 'group', 'name')} />
          </div>
        );
      case 2:
        // sensor & sensortype
        var st = this.state.objects.sensortype;
        var s = this.state.objects.sensor;
        return (
          <div>

            <p>Now we need to define a sensor, and what it measures.</p>

            <Subheader>Type</Subheader>

            <TextField fullWidth={true} floatingLabelText="Type Name" value={st.name} onChange={this.eventChangeObj.bind(this, 'sensortype', 'name')} />

            <SensorTypeSchemaEditor onSchemaUpdate={this.changeObj.bind(this, 'sensortype', 'schema')} value={st.schema} />

            <Subheader>Sensor</Subheader>

            <TextField fullWidth={true} floatingLabelText="Sensor Name" value={s.name} onChange={this.eventChangeObj.bind(this, 'sensor', 'name')} />

          </div>
        );
      case 3:
        // rule
        var obj = this.state.objects.rule;
        return (
          <div>

            <p>Now create a rule -- a condition for incoming data that when met will trigger some event.</p>

            <TextField fullWidth={true} floatingLabelText="Rule Name" value={obj.name} onChange={this.eventChangeObj.bind(this, 'rule', 'name')} />

          </div>
        );
      case 4:
        // processtask
        var obj = this.state.objects.processtask;
        return (
          <div>

            <p>Finally, we configure how data processing will operate.</p>

            <TextField fullWidth={true} floatingLabelText="Processing interval (seconds)" value={obj.interval} onChange={this.eventChangeObj.bind(this, 'processtask', 'interval')} />

          </div>
        );
      default:
        return '??';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    var step = this.STEPS[stepIndex];
    return (
      <div>

        <h1>Setup</h1>

        <p className="lead">Lets get things set up.</p>

        <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
          <Stepper activeStep={stepIndex}>
            { this.STEPS.map(function(step, i) {
              return (
                <Step>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
                )
            }) }
          </Stepper>
          <div style={contentStyle}>
            {finished ? <RaisedButton onClick={this.save_all_data} label="Finish & Save" primary={true} /> :
            (
              <div>

                <p>{this.getStepContent(stepIndex)}</p>

                <div style={{marginTop: 12}}>
                  <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    onTouchTap={this.handlePrev}
                    style={{marginRight: 12}} />
                  <RaisedButton
                    label="Next"
                    primary={true}
                    onTouchTap={this.handleNext} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
