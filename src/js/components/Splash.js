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

class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      case: null
    };
    this.CASES = {
      "smartmatatu": {
        title: "Smart Matatu - Driver Safety",
        photo: "/images/public/cases/smartmatatu_image.png",
        partners: ["UC Berkeley"],
        links: ["http://www.smartmatatu.com"],
        text: (
          <div>
            <p>Road traffic accidents cause 1.24 million deaths annually, many involving informal public transport. SmartMatatu aims to improve the safety of semi-formal public transport sectors globally, by providing a vehicle tracking system to align incentives between minibus owners and drivers.</p>
            <p>SmartMatatu leverages smart, dedicated vehicle tracking and driver quality measuring devices, connected to the Echo Sense cloud, to feed back real-time information from Nairobi&rsquo;s roads. Owners are notified of unsafe events, and vehicle productivity data, enabling them to make better decisions for their business, realign incentives for drivers, and ultimately improve public safety.</p>
          </div>
        )
      },
      "raincatcher": {
        title: "Water Tank Monitoring & Reporting",
        photo: "/images/public/cases/hmc_field.jpeg",
        partners: ["Harvey Mudd College", "Raincatcher.org"],
        links: ["http://raincatcher.org/"],
        text: (
          <div>
            <p>The Global Clinic Team at Harvey Mudd College has designed and constructed a monitoring device that can remotely report the water level inside a tank, the presence of water in the gutter, and whether the tank site is currently experiencing rain. These data can help RainCatcher determine whether their systems are functioning as expected, and detect maintenance issues such as broken taps, clogged gutters, and other potential problems. The monitoring device is powered by solar energy so as to be self ­sustaining and usable in any geographical location. The team has designed the system to last for ten years, the lifetime of RainCatcher’s systems.</p>
          </div>
        )
      }
    }
  }

  goto_case(case_id) {
    this.setState({case: case_id});
  }

  render() {
    let iconStyles = {
      fontSize: '64px'
    };
    var case_title;
    var case_content;
    if (this.state.case) {
      var c = this.CASES[this.state.case];
      case_title = c.title;
      case_content = (<div>

        <img src={ c.photo } hidden={!c.photo} />

        <label>Project Overview</label>
        { c.text }

        <div>
          <label>Partners</label>
          <ul>
          { c.partners.map(function(p, i) {
            return <li key={i}>{ p }</li>
          }) }
          </ul>
        </div>

        <div>
          <label>Links</label>
          <ul>
          { c.links.map(function(link, i) {
            return <li key={i}><a href={link} target="_blank">{link}</a></li>
          }) }
          </ul>
        </div>
      </div>);
    }
    return (
        <div id="splash">

          <Dialog title={case_title} open={this.state.case != null} onRequestClose={this.goto_case.bind(this, null)} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
            { case_content }
          </Dialog>

            <div className="camp">
              <div className="container-fluid">
                <div className="row" style={{paddingTop: "45px"}}>
                  <div className="col-sm-3 col-sm-offset-1">
                    <div className="center-block">
                      <img src="/images/logos/echo_sense_white_512.png" className="img-responsive" />
                    </div>
                  </div>
                  <div className="col-sm-7">
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

            <div className="cases row">
              <div className="col">
                <a className="illust" title="Case: Smart Matatu - Driver Safety" onClick={this.goto_case.bind(this, 'smartmatatu')}>
                  <span className="s1"></span>
                </a>
              </div>
              <div className="col">
                <a className="illust" title="Case: Water Tank Reporting" onClick={this.goto_case.bind(this, 'raincatcher')}>
                  <span className="s2"></span>
                </a>
              </div>
            </div>

            <div className="row">

              <div className="text-center col-md-12">

                <div style={{paddingTop: "20px", paddingBottom: "20px"}}>
                  <h2>Ready to Deploy an Echo Sense Solution?</h2>

                  <RaisedButton label="Contact Us" linkButton={true} href="mailto:sense@echomobile.org" primary={true} />
                </div>
              </div>

            </div>

        </div>

    )
  }
};

module.exports = Splash;
