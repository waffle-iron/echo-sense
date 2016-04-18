var React = require('react');

var util = require('../utils/util');

var MyDialog = React.createClass({displayName: 'MyDialog',
  getInitialState: function() {
    return { open: false, spinner: false };
  },
  getDefaultProps: function() {
    return {
      title: null,
      addClass: null,
      negative: { text: "Cancel", class:"negative" },
      positive_buttons: [] // Array of objects with text and either link attribute or function attribute
    };
  },
  componentDidMount: function() {
    var that = this;
    util.addEvent(document, "keypress", function(e) {
      e = e || window.event;
      if (e.keyCode==27) { // ESC
        that.hide();
      }
    });
  },
  startSpinner: function() {
    this.setState({spinner: true});
  },
  stopSpinner: function() {
    this.setState({spinner: false});
  },
  show: function(callback) {
    this.setState({open: true, spinner: false}, function() {
      if (callback) callback();
    });
  },
  hide: function() {
    this.setState({open: false, spinner: false});
    if (this.props.onClose) this.props.onClose();
  },
  buttonClick: function(b) {
    if (b) {
      if (b.link) window.location = b.link;
      else if (b.fn) b.fn();
      else this.hide();
    } else this.hide();
  },
  render: function() {
    var dialogClasses = '_popup';
    if (this.state.open) dialogClasses += ' open';
    if (this.props.addClass != null) dialogClasses += ' ' + this.props.addClass;
    var title = this.props.title ? (<h1>{this.props.title}</h1>) : '';
    var buttons = [];
    if (this.props.negative) {
      buttons.push(this.props.negative);
    }
    if (this.props.positive_buttons.length > 0) {
      this.props.positive_buttons.forEach(function(b, i, arr) {
        if (b) {
          b.class='positive';
          if (b.addClass) b.class += ' ' + b.addClass;
          buttons.push(b);
        }
      });
    }
    buttons = buttons.map(function(b, i, arr) {
      var classes = b.class || "";
      return <a href='javascript:void(null)' key={b.text} onClick={this.buttonClick.bind(this, b)} className={classes}>{b.text}</a>
    }, this);
    var buttonSec = null;
    if (buttons) buttonSec = (<div className="buttons">{ buttons }</div>);
    return (
      <div className={dialogClasses}>
        <a href='javascript:void(0)' onClick={this.hide} className='close hover_rotate'><i className='fa fa-close'></i></a>
        {title} <img src='/images/oval.svg' className='md_loader' hidden={!this.state.spinner}/>
        <div className="content">
        { this.props.children }
        </div>
        { buttonSec }
      </div>
    );
  }
});

module.exports = MyDialog;