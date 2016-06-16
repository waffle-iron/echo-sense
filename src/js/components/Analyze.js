'use strict';

var React = require('react');
var Router = require('react-router');
var util = require('utils/util');
var mui = require('material-ui'),
  FlatButton = mui.FlatButton,
  FontIcon = mui.FontIcon,
  MenuItem = mui.MenuItem;
import history from 'config/history'

export default class Analyze extends React.Component {
  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  section_change(section) {
    history.pushState(null, `/app/processing/${section}`)
  }

  render() {
    return (
      <div>
        <h1><FontIcon className="material-icons">show_chart</FontIcon> Processing</h1>

        <FlatButton label="Settings" onClick={this.section_change.bind(this, 'settings')} />
        <FlatButton label="Rules" onClick={this.section_change.bind(this, 'rules')} />
        <FlatButton label="Viewer" onClick={this.section_change.bind(this, 'viewer')} />

        <div>
          { this.props.children }
        </div>
      </div>
    );
  }
}
