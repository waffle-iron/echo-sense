var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class TargetActions {

	constructor() {
		// Automatic action
		// this.generateActions('loadLocalUser', 'manualUpdate');
	}

	// Manual actions

	fetchTargets() {
	    get(this, "/api/target");
	}
}

module.exports = alt.createActions(TargetActions);