'use strict';

var React = require('react');
var mui = require('material-ui'),
  RaisedButton = mui.RaisedButton,
  Paper = mui.Paper,
  FontIcon = mui.FontIcon,
  TextField = mui.TextField;

var util = require('utils/util');
var bootstrap = require('bootstrap');

class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let iconStyles = {
      fontSize: '64px'
    };
    return (
        <div id="splash" >

            <div className="camp">
              <div className="container-fluid">
                <div className="row" style={{paddingTop: "45px"}}>
                  <div className="col-sm-6">
                    <div className="text-center">
                      <img src="/images/logos/echo_sense_white_512.png" width="300" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <h1>A sensor data analysis platform built for quick deployment in the Google cloud</h1>
                    <h2>Get up and running today, or start developing.</h2>
                    <ul style={{fontSize: "15px"}}>
                      <li>Source on <a href="https://bitbucket.org/echomobile/echo-sense"><i className="fa fa-bitbucket"></i> Bitbucket</a></li>
                      <li>Documentation <a href="/docs/index.html">here</a></li>
                      <li>Talk to our team at <a href="mailto:sense@echomobile.org">sense@echomobile.org</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row clearfix text-center" style={{paddingTop: "30px"}}>
              <div className="col-sm-4">
                <FontIcon className="material-icons" style={iconStyles}>all_out</FontIcon>
                <h2 className="text-center">Flexible Setup</h2>
              </div>
              <div className="col-sm-4">
                <FontIcon className="material-icons" style={iconStyles}>language</FontIcon>
                <h2 className="text-center">Designed for Development</h2>
              </div>
              <div className="col-sm-4">
                <FontIcon className="material-icons" style={iconStyles}>code</FontIcon>
                <h2 className="text-center">Open Source</h2>
              </div>
            </div>

        </div>

    )
  }
};

module.exports = Splash;
