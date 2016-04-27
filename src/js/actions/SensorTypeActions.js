var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class SensorTypeActions {

	constructor() {
		// Automatic action
		this.generateActions('manualUpdate');
	}

	// Manual actions

	fetchTypes() {
	    get(this, "/api/sensortype");
	}
}

module.exports = alt.createActions(SensorTypeActions);