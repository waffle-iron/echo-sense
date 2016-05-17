var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class RuleActions {

	constructor() {
		// Automatic action
		this.generateActions('manualUpdate');
	}

	// Manual actions

	fetchRules() {
	    get(this, "/api/rule");
	}
}

module.exports = alt.createActions(RuleActions);