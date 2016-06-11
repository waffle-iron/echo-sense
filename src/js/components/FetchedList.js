var React = require('react');

var mui = require('material-ui');
var api = require('utils/api');
var RefreshIndicator = mui.RefreshIndicator;
var IconButton = mui.IconButton;
var $ = require('jquery');

export default class FetchedList extends React.Component {
  static defaultProps = {
    url: null,
    params: {},
    listProp: 'items',
    labelProp: 'label',
    autofetch: false,
    renderItem: null // Function
  };

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false
    };
  }

  componentWillReceiveProps(nextProps) {
  }
  componentDidUpdate(prevProps, prevState) {
  }
  componentDidMount() {
    if (this.props.autofetch) this.fetchData();
  }

  fetchData() {
    var that = this;
    if (this.props.url) {
      api.get(this.props.url, this.props.params, function(res) {
        if (res.success) {
          that.setState({items: res.data[that.props.listProp]})
        }
      });
    }
  }

  handleItemClick(i) {
    if (this.props.onItemClick) this.props.onItemClick(i);
  }

  refresh() {
    this.fetchData();
  }

  remove_item_by_key(key, _keyProp) {
    var keyProp = _keyProp || "key";
    var items = this.state.items;
    for (var i=0; i<items.length; i++) {
      var _item = items[i];
      if (_item) {
        var keyval = _item[keyProp];
        if (keyval == key) {
          // Match
          items.splice(i, 1);
          break;
        }
      }
    }
    this.setState({items: items});
  }

  render() {
    var _items = this.state.items.map(function(item, i, arr) {
      if (this.props.renderItem != null) return this.props.renderItem(item);
      else {
        var name = item[this.props.labelProp] || "Unnamed";
        return <li className="list-group-item" key={i}>
          <a href="javascript:void(0)" className="title" onClick={this.handleItemClick.bind(this, item)}>{ name }</a>
          </li>
      }
    }, this);
    var ristatus = this.state.loading ? "loading" : "hide";
    var empty = this.state.items.length == 0;
    return (
      <div>
        <RefreshIndicator status={ristatus} size={50} top={50} left={50} />
        <IconButton iconClassName="material-icons" onClick={this.refresh.bind(this)}>refresh</IconButton>
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
}
