var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class SensorActions {

	constructor() {
		// Automatic action
		this.generateActions('manualUpdate', 'get_sensors_by_key_names');
	}

	// Manual actions

	fetchSensors(key_names) {
		var data = {};
		if (key_names != null) data.key_names = key_names.join(',');
	    get(this, "/api/sensor", data);
	}

}

module.exports = alt.createActions(SensorActions);