var alt = require('config/alt');
import api from 'utils/api';
import {clone} from 'lodash';
import {get} from 'utils/action-utils';

class SensorTypeActions {

	constructor() {
		// Automatic action
		this.generateActions('manualUpdate', 'get_sensor_type');
	}

	// Manual actions

	fetchTypes() {
	    get(this, "/api/sensortype");
	}

	fetchType(type_id) {
	    get(this, `/api/sensortype/${type_id}`);
	}
}

module.exports = alt.createActions(SensorTypeActions);