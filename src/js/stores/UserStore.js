var alt = require('config/alt');
var UserActions = require('actions/UserActions');
import {findItemById, findIndexById} from 'utils/store-utils';
import router from 'config/router';
var toastr = require('toastr');
import history from 'config/history'
const USER_STORAGE_KEY = 'echosenseUser';

class UserStore {
    constructor() {
        this.bindActions(UserActions);
        this.user = null;
        this.error = null;
    }

    storeUser(user) {
        this.user = user;
        this.error = null;
        console.log("Stored user "+user.email);
        // api.updateToken(user.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }

    loadLocalUser() {
        var user;
        try {
            user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        } finally {
            if (user) {
                console.log("Successfully loaded user " + user.email);
                this.storeUser(user);
            }
        }
    }

    clearUser() {
        this.user = null;
        // api.updateToken(null);
        localStorage.removeItem(USER_STORAGE_KEY);
    }

    onLogin(data) {
        if (data.ok) {
            this.storeUser(data.user);
            history.replaceState(null, '/app');
        } else {
            this.clearUser();
            this.error = data.error;
        }
    }

    onLogout(data) {
        if (data.success) {
            this.clearUser();
            this.error = null;
            toastr.success("You're logged out!");
            history.replaceState(null, '/public');
        }
    }

    onUpdate(data) {
        if (data.success) {
            this.storeUser(data.data.user);
            toastr.success("Saved!! ");
        }
    }

    manualUpdate(user) {
        this.storeUser(user);
    }
}

module.exports = alt.createStore(UserStore, 'UserStore');