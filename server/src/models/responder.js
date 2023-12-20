const RequestQueue = require("../utils/queue");
const RequestStore = require("../utils/store");
const Request = require("./request");

class Responder {
    constructor() {
        this.queue = new RequestQueue();
        this.store = new RequestStore();
    }

    newRequest(url, method, body, headers, uuid, callbackURL) {
        const req = new Request(url, method, body, headers, uuid, callbackURL);
        this.store.add(req);
        this.queue.add(req);

        return req;
    }

    getAllRequests(uuid) {
        return this.store.getUserRequests(uuid);
    }

    getUsageStats(uuid) {
        const userRequests = this.store.getUserRequests(uuid);
        const stats = {
            total: 0,
            requests: [],
            completed: 0,
            failed: 0,
            pending: 0,
            rejected: 0,
            cancelled: 0
        }

        const allRequests  = userRequests.map(reqId => this.store.getRequest(reqId));

        stats.total = allRequests.length;
        stats.requests = allRequests

        allRequests.forEach(req => {
            switch (req.status) {
                case 'completed':
                    stats.completed++;
                    break;
                case 'failed':
                    stats.failed++;
                    break;
                case 'pending':
                    stats.pending++;
                    break;
                case 'rejected':
                    stats.rejected++;
                    break;
                case 'cancelled':
                    stats.cancelled++;
                    break;
            }
        })

        return stats;
    }

    getRequestStatus(id) {
        const req = this.store.getRequest(id);
        if (req) {
            return req.status;
        }
        return null;
    }

    cancelRequest(id) {
        // cancel execution
    }
}


module.exports = Responder
