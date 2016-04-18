var React = require('react');

var mui = require('material-ui');
var api = require('utils/api');
var RefreshIndicator = mui.RefreshIndicator;
var $ = require('jquery');

var FetchedList = React.createClass({displayName: 'FetchedList',
  getDefaultProps: function() {
    return {
      url: null,
      params: {},
      listProp: 'items',
      labelProp: 'label',
      autofetch: false,
      renderItem: null // Function
    };
  },
  getInitialState: function() {
    return {
      items: [],
      loading: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
  },
  componentDidUpdate: function(prevProps, prevState) {
  },
  componentDidMount: function() {
    if (this.props.autofetch) this.fetchData();
  },
  fetchData: function() {
    var that = this;
    if (this.props.url) {
      api.get(this.props.url, this.props.params, function(res) {
        if (res.success) {
          that.setState({items: res.data[that.props.listProp]})
        }
      });
    }
  },
  handleItemClick: function(i) {
    if (this.props.onItemClick) this.props.onItemClick(i);
  },
  refresh: function() {
    console.log("FetchedList:refresh");
    this.fetchData();
  },
  render: function() {
    var _items = this.state.items.map(function(item, i, arr) {
      if (this.props.renderItem != null) return this.props.renderItem(item);
      else {
        var name = item[this.props.labelProp] || "Unnamed";
        return <li className="list-group-item">
          <a href="javascript:void(0)" className="title" onClick={this.handleItemClick.bind(this, item)}>{ name }</a>
          </li>
      }
    }, this);
    var ristatus = this.state.loading ? "loading" : "hide";
    var empty = this.state.items.length == 0;
    return (
      <div>
        <RefreshIndicator status={ristatus} size={50} top={50} left={50} />
        <ul className="list-group" hidden={empty}>
          { _items }
        </ul>
        <div hidden={!empty}>
          <div className="empty">
            <i className="fa fa-warning"></i><br/>
            <span>Nothing to show</span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FetchedList;