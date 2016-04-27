var React = require('react');

var Site = require('components/Site');
var App = require('components/App');
var Public = require('components/Public');
var Admin = require('components/Admin');
var Root = require('components/Root');

var Login = require('components/Login');
var Splash = require('components/Splash');
var Targets = require('components/Targets');
var Groups = require('components/Groups');
var Sensors = require('components/Sensors');
var Reports = require('components/Reports');
var SensorDetail = require('components/SensorDetail');
var AlarmDetail = require('components/AlarmDetail');
var RecordDetail = require('components/RecordDetail');
var AnalysisDetail = require('components/AnalysisDetail');
var TargetDetail = require('components/TargetDetail');
var GroupDetail = require('components/GroupDetail');
var Manage = require('components/Manage');
var DataViewer = require('components/DataViewer');
var ProfileEditor = require('components/ProfileEditor');
var Logs = require('components/Logs');

// Admin
var AdminManage = require('components/AdminManage');
var AdminSpoof = require('components/AdminSpoof');

var NotFound = require('components/NotFound');

var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var IndexRoute = Router.IndexRoute;

module.exports = (
  <Route component={Site} path="/">
    <IndexRoute component={Root} />
    <Route path="app" component={App}>
      <Route path="sensors" component={Sensors}>
        <Route path=":sensorKn" component={SensorDetail} />
      </Route>
      <Route path="targets" component={Targets}>
        <Route path=":targetID" component={TargetDetail} />
      </Route>
      <Route path="groups" component={Groups}>
        <Route path=":groupID" component={GroupDetail} />
      </Route>
      <Route path="reports" component={Reports} />
      <Route path="alarms/:sensorKn/:aid" component={AlarmDetail} />
      <Route path="analysis/:analysisKn" component={AnalysisDetail} />
      <Route path="data/:sensorKn" component={DataViewer} />
      <Route path="data/:sensorKn/record/:recordKn" component={RecordDetail} />
      <Route path="manage" component={Manage}/>
      <Route path="profile" component={ProfileEditor}/>
      <Route path="logs" component={Logs}/>
      <Route path="admin" component={Admin}>
        <Route path="manage" component={AdminManage}/>
        <Route path="spoof" component={AdminSpoof}/>
      </Route>
      <IndexRoute component={Sensors} />
      <Route path="*" component={NotFound}/>
    </Route>
    <Route path="public" component={Public}>
      <Route path="splash" component={Splash}/>
      <Route path="login" component={Login}/>
      <IndexRoute component={Splash} />
    </Route>

  </Route>
);