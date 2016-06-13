var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class GroupActions {

	constructor() {
		// Automatic action
		this.generateActions('manualUpdate', 'get_group');
	}

	// Manual actions

	fetchGroups() {
	    get(this, "/api/group");
	}

	fetchGroup(id) {
	    get(this, `/api/group/${id}`);
	}

	update(data) {
	    api.post("/api/group", data, (res) => {
	    	this.dispatch(res);
	    });
	}

	delete(key) {
	    api.post("/api/group/delete", {key: key}, (res) => {
	    	this.dispatch(res);
	    });
	}

}

module.exports = alt.createActions(GroupActions);