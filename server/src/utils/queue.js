const Request = require("../models/request");
const fastq = require('fastq');


const MAX_WORKERS = 1;

async function worker(arg, cb) {
    console.log('Processing req', arg.id);

    await new Promise(resolve => setTimeout(resolve, 1000));

    arg.completed();
    cb(null, arg);
}

class RequestQueue {
    constructor() {
        this.queue = fastq(worker, MAX_WORKERS);
    }

    get length() {
        return this.queue.length;
    }

    /**
     * Add to queue
     * @param {Request} request Request Object to add
     */
    add(request, cb) {
        this.queue.push(request, cb);
    }
}

module.exports = RequestQueue