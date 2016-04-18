var $ = require('jquery');
var UserActions = require('actions/UserActions');

var api = {

	post: function(url, data, success) {
		$.post(url, data, function(res, status, jqxhr) {
			var status = jqxhr.status;
			if (success) success(res);
		}, 'json').fail(function(jqxhr) {
			var status = jqxhr.status;
			if (status == 401) UserActions.logout();
		});
	},

	get: function(url, data, success) {
		$.getJSON(url, data, function(res, _status, jqxhr) {
			var status = jqxhr.status;
			if (success) success(res);
		}).fail(function(jqxhr) {
			var status = jqxhr.status;
			if (status == 401) UserActions.logout();
		});
	}

}

export default api;