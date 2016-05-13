'use strict';

var React = require('react');
var mui = require('material-ui'),
  RaisedButton = mui.RaisedButton,
  Paper = mui.Paper,
  FontIcon = mui.FontIcon,
  Dialog = mui.Dialog,
  TextField = mui.TextField;

var util = require('utils/util');
var bootstrap = require('bootstrap');

export default class Press extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.RELEASES = [
      { date: "May 13, 2016", file: "2016-05-13 EchoSenseLaunchPressRelease.pdf", title: "Echo Mobile Launches Open Source Sensor Platform"}
    ];
  }

  render() {
    var st = {
      backgroundImage: "url(/images/public/nodes_dark.png)"
    }
    return (
        <div>

          <div className="full-image" style={st}>
            <div className="container-fluid">
              <h1>Press</h1>
            </div>
          </div>

          <div className="container">
            <h3>Press Releases</h3>

            <ul style={{fontSize: "15px"}}>
              { this.RELEASES.map(function(r) {
                return <li><span className="label label-default">{ r.date }</span> <a href={"/static/press/"+r.file} target="_blank">{ r.title }</a></li>
              })}
            </ul>
          </div>

        </div>

    )
  }
};
