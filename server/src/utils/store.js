const Request = require("../models/request");

class RequestStore {
    constructor() {
        this.requests = {};
        this.userMap = {};
        this._length = 0;
    }

    get length() {
        return this._length;
    }

    /**
     * Add to store
     * @param {Request} request Request Object to add
     */
    add(request) {
        this.requests[request.id] = request;
        this._length++;

        // add to user request map
        if (!this.userMap[request.uuid]) {
            this.userMap[request.uuid] = [];
        }
        this.userMap[request.uuid].push(request.id);
    }

    /**
     * Remove from store
     * @param {Request} request
     * @returns {Request}
     */
    remove(requestId) {
        const req = this.requests[requestId];
        delete this.requests[requestId];
        // delete from user request map
        this.userMap[req.uuid] = this.userMap[req.uuid].filter(id => id !== requestId);

        this._length--;
        return req;
    }

    updateStatus(id, status) {
        console.log(`Updating status for ${id} to ${status}`);
        const req = this.requests[id];
        req.status = status;
    }

    /**
     * fetch from store
     * @param {string} requestId
     * @returns {Request | null}
     */
    getRequest(id) {
        return this.requests[id] ?? null;
    }

    /**
     * fetch all user requests from store
     * @param {string} uuid
     * @returns {Request[]}
     */
    getUserRequests(uuid) {
        return this.userMap[uuid] ?? [];
    }

    /**
     * Get a users requests in last 1 minute
     * @param {string} uuid
     * @returns {number}
     */
    getActiveUserRequestCount(uuid) {
        const userRequests = this.getUserRequests(uuid);
        const now = new Date().getTime();
        
        const requests = userRequests.filter(request => {
            if (request.status === 'rejected') {
                // rejected requests are not counted
                return false;
            }
            return now - request.timestamp < 60000
        });

        return requests.length;
    }

}

module.exports = RequestStore