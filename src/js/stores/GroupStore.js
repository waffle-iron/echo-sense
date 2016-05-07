var alt = require('config/alt');
var GroupActions = require('actions/GroupActions');
import {findItemById, findIndexById} from 'utils/store-utils';
import {isEmpty} from 'lodash';
import router from 'config/router';
var toastr = require('toastr');
var util = require('utils/util');

class GroupStore {
    constructor() {
        this.bindActions(GroupActions);
        this.groups = {};
		this.exportPublicMethods({
			get_groups: this.get_groups
		});
    }

    onFetchGroups(res) {
        if (res.data && res.data.groups != null) {
            this.groups = util.lookupDict(res.data.groups, 'key');
        }
    }

    // Public

    get_groups() {
	    var groups = this.getState().groups;
	    if (isEmpty(groups)) {
		    GroupActions.fetchGroups()
	    	return {};
	    } else {
	    	return groups;
	    }
	}

	// Automatic

    manualUpdate(grp) {
    	console.log(grp);
    	this.groups[grp.key] = grp;
    }



}

module.exports = alt.createStore(GroupStore, 'GroupStore');