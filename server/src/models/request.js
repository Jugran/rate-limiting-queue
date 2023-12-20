const axios = require('axios').default;
const nanoid = require('nanoid')

const nano = nanoid.customAlphabet(nanoid.urlAlphabet, 16);

class Request {
    constructor(url, method, body, headers, uuid, callbackURL) {
        this.id = nano();
        this.url = url;
        this.method = method;
        this.body = body;
        this.headers = headers;
        this.uuid = uuid;
        this.callbackURL = callbackURL;
        this.status = 'pending';
    }
    
    get data() {
        return {
            url: this.url,
            method: this.method,
            body: this.body,
            headers: this.headers,
            uuid: this.uuid
        };
    }

    completed() {
        this.status = 'completed';
    }

    failed() {
        this.status = 'failed';
    }

    rejected() {
        this.status = 'rejected';
    }

    /**
     * Calls the callback URL with status
     * @returns {Promise<any>}
     */
    callback() {
        return axios.post(this.callbackURL, {
            uuid: this.uuid,
            status: this.status,
            id: this.id
        });
    }
}

module.exports = Request