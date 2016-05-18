export default {
  removeItemsById: function(collection, id_list, _id_prop) {
    var id_prop = _id_prop || "id";
    return collection.filter(function(x) { return id_list.indexOf(x[id_prop]) == -1; } )
  },
  findItemById: function(collection, id) {
    return collection.find(x => x._id === id);
  },
  findIndexById: function(collection, id) {
    var index;
    collection.find((x, i) => {
      index = i;
      return x._id === id;
    });
    return index;
  }
};