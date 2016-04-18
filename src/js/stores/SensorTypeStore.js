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

}

module.exports = alt.createStore(SensorTypeStore, 'SensorTypeStore');