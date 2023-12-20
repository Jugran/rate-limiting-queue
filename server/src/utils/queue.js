const Request = require("../models/request");

class RequestQueue {
    constructor() {
        this.queue = [];
        this.start = -1;
        this._length = 0;
    }

    get length() {
        return this._length;
    }

    /**
     * Add to queue
     * @param {Request} request Request Object to add
     */
    add(request) {
        this._length++;
        this.queue.push(request);
        if (this.start === -1) {
            this.start = 0;
        }
    }

    /**
     * Remove from queue
     * @returns {Request}
     */
    dequeue() {
        if (this.queue.length === 0) {
            return;
        }
        // TODO: find a better off shelf implementation with O(1) dequeue
        this.start++;
        this._length--;

        return this.queue[this.start - 1];
    }
}

module.exports = RequestQueue