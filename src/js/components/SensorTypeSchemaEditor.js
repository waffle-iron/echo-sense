'use strict';

var React = require('react');
var mui = require('material-ui'),
  RaisedButton = mui.RaisedButton,
  IconButton = mui.IconButton,
  TextField = mui.TextField,
  FlatButton = mui.FlatButton;

var util = require('utils/util');
var toastr = require('toastr');
var api = require('utils/api');
import {changeHandler} from 'utils/component-utils';

@changeHandler
export default class SensorTypeSchemaEditor extends React.Component {
  static defaultProps = {
    schema: {}
  }
  constructor(props) {
    super(props);
    this.state = {
      form: {}
    };
  }

  edit_column_event(colname, prop, e) {
    var val = e.target.value;
    this.edit_column(colname, prop, val);
  }

  edit_column(colname, prop, val) {
    var schema = this.props.schema;
    var col = schema[colname];
    if (col) {
      if (prop == 'name') {
        col[val] = col;
        delete col[prop];
      } else {
        col[prop] = val;
      }
      this.schemaUpdate(schema);
    }
  }

  schemaUpdate(schema) {
    if (this.props.onSchemaUpdate) this.props.onSchemaUpdate(schema);
  }

  remove_column(colname) {
    var schema = this.props.schema;
    delete schema[colname];
    this.schemaUpdate(schema);
  }

  add_column() {
    var colname = this.state.form.new_colname;
    if (colname) {
      var schema = this.props.schema;
      schema[colname] = {};
      this.schemaUpdate(schema);
    }
  }

  render_column(colname, col) {
    return (
      <li key={colname}>
        <span><input type="text" className="form-control" value={colname} onChange={this.edit_column_event.bind(this, colname, 'name')} disabled /></span>
        <span><input type="text" className="form-control" value={col.unit || ''} onChange={this.edit_column_event.bind(this, colname, 'unit')} /></span>
        <span><input type="text" className="form-control" value={col.type || ''} onChange={this.edit_column_event.bind(this, colname, 'type')} /></span>
        <span><IconButton iconClassName="material-icons" onClick={this.remove_column.bind(this, colname)} tooltip="Remove Column">trash</IconButton></span>
      </li>
    );
  }

  render() {
    var form = this.state.form;
    var schema = this.props.schema;
    var _list = [];
    for (var colname in schema) {
      if (schema.hasOwnProperty(colname)) {
        var col = schema[colname];
        _list.push(this.render_column(colname, col));
      }
    }
    return (
        <div>
          <div className="form-inline">
            <ul>
             { _list }
            </ul>
          </div>

          <TextField onChange={this.changeHandler.bind(this, 'form', 'new_colname')} value={form.new_colname} />
          <RaisedButton label="Add Column" onClick={this.add_column.bind(this)} />
        </div>
    )
  }
}
