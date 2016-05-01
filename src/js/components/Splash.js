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

                    <RaisedButton label="Contribute on Github" href="https://github.com/echomobi/echo-sense" linkButton={true} />

                    <p className="lead" style={{marginTop: "10px"}}>Or...</p>

                    <ul style={{fontSize: "22px"}}>
                      <li>Read the Echo Sense documentation <a href="/docs/index.html">here</a></li>
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
                <p className="ftr sub">Designed for implementation across a wide variety of sectors. Use out of the box, or easily customize as needed.</p>
              </div>
              <div className="col-sm-4">
                <FontIcon className="material-icons" style={iconStyles}>language</FontIcon>
                <h2 className="text-center">Designed for Development</h2>
                <p className="ftr sub">Built in East Africa with development requirements in mind.</p>
              </div>
              <div className="col-sm-4">
                <FontIcon className="material-icons" style={iconStyles}>code</FontIcon>
                <h2 className="text-center">Open Source</h2>

                <p className="ftr sub">MIT Licensed -- Use and extend freely.</p>

              </div>
            </div>

            <h1 className='text-center'>How It Works</h1>

            <div className="row">
              <div className="col-md-5 col-md-offset-1">
                <img src='/images/public/3sensors.png' width="100%" />
              </div>
              <div className="col-md-5">
                <span className="badge badge-default step-number">1</span>
                <p className="ftr">Choose and deploy sensor hardware in the field.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 col-md-offset-1">
                <span className="badge badge-default step-number">2</span>
                <p className="ftr">Spin up a Sense instance, and configure sensors with measurement fields and on-the-fly processing settings.</p>
                <p className="ftr sub">Also establish rules (e.g. a water level threshold, speed ceiling, or temperature window), and automate alerts to key stakeholders when
                rule conditions are met.</p>
              </div>
              <div className="col-md-5">
                <img src='/images/public/screenshots/edit_sensor.png' width="100%" />
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 col-md-offset-1">
                <img src='/images/public/screenshots/data.png' width="100%" />
              </div>
              <div className="col-md-5">
                <span className="badge badge-default step-number">3</span>
                <p className="ftr">Produce charts based on raw or processed data on demand.</p>
              </div>
            </div>


            <div className="row">
              <div className="col-md-5 col-md-offset-1">
                <span className="badge badge-default step-number">4</span>
                <p className="ftr">Integrate custom applications or other MIS software with the Sense API to make
                usage of Sense data even more seamless.</p>
              </div>
              <div className="col-md-5">
                <img src='/images/public/screenshots/map.png' width="100%" />
              </div>
            </div>

        </div>

    )
  }
};

module.exports = Splash;
