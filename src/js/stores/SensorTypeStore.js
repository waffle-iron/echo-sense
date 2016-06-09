var alt = require('config/alt');
var SensorTypeActions = require('actions/SensorTypeActions');
import {findItemById, findIndexById} from 'utils/store-utils';
import router from 'config/router';
var toastr = require('toastr');
var util = require('utils/util');

class SensorTypeStore {
    constructor() {
        this.bindActions(SensorTypeActions);
        this.sensor_types = {};
    }

    onFetchTypes(res) {
        if (res.data && res.data.sensortypes != null) {
            this.sensor_types = util.lookupDict(res.data.sensortypes, 'id');
        }
    }

    onFetchType(res) {
        if (res.data && res.data.sensortype != null) {
            var st = res.data.sensortype;
            this.sensor_types[st.id] = st;
        }
    }

    // Automatic

    manualUpdate(st) {
    	this.sensor_types[st.id] = st;
    }

    get_sensor_type(type_id) {
        var type = this.sensor_types[type_id];
        if (!type) {
            // Fetch
            SensorTypeActions.fetchType(type_id);
        }
        return type;
    }


}

module.exports = alt.createStore(SensorTypeStore, 'SensorTypeStore');