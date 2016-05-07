var $ = require('jquery');
var AppConstants = require('constants/AppConstants');

var api = {

	post: function(url, data, success) {
		$.post(url, data, function(res, status, jqxhr) {
			var status = jqxhr.status;
			if (success) success(res);
		}, 'json').fail(function(jqxhr) {
			var status = jqxhr.status;
			if (status == 401) {
				window.location = "/";
				localStorage.removeItem(AppConstants.USER_STORAGE_KEY);
			}
		});
	},

	get: function(url, data, success) {
		$.getJSON(url, data, function(res, _status, jqxhr) {
			var status = jqxhr.status;
			if (success) success(res);
		}).fail(function(jqxhr) {
			var status = jqxhr.status;
			if (status == 401) {
				window.location = "/";
				localStorage.removeItem(AppConstants.USER_STORAGE_KEY);
			}
		});
	}

}

export default api;