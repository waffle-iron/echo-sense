var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class ProcessTaskActions {

	constructor() {
		// Automatic action
		this.generateActions('manualUpdate', 'get_task', 'get_tasks');
	}

	// Manual actions

	fetchTasks() {
	    get(this, "/api/processtask");
	}


	fetchTask(id) {
	    get(this, `/api/processtask/${id}`);
	}

	update(data) {
	    api.post("/api/processtask", data, (res) => {
	    	this.dispatch(res);
	    });
	}

	delete(key) {
	    api.post("/api/processtask/delete", {key: key}, (res) => {
	    	this.dispatch(res);
	    });
	}

}

module.exports = alt.createActions(ProcessTaskActions);