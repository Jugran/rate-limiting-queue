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

}

module.exports = RequestStore