var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class GroupActions {

	constructor() {
		// Automatic action
		this.generateActions('manualUpdate');
	}

	// Manual actions

	fetchGroups() {
	    get(this, "/api/group");
	}
}

module.exports = alt.createActions(GroupActions);