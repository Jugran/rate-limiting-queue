const express = require('express');
const Responder = require('./src/models/responder');
const app = express();

app.use(express.json());

const responder = new Responder();

app.post('/echo', (req, res) => {
    console.log(`Body:  ${JSON.stringify(req.body, null, 4)}`);
    return res.status(200).send({ "echo": req.body ?? {} });
})

app.post('/request/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    const request = responder.newRequest(req.baseUrl,
        req.method,
        req.body?.payload,
        req.headers,
        uuid,
        req.body?.callbackURL
    );
    return res.status(200).send({ "id": request.id, status: request.status });
})

app.get('/request/status/:id', (req, res) => {
    const id = req.params.id;
    const status = responder.getRequestStatus(id);
    return res.status(200).send({ id, status });
})

app.get('/user/requests/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    const requests = responder.getAllRequests(uuid);
    return res.status(200).send({ requests });
})


app.get('/user/stats/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    const stats = responder.getUsageStats(uuid);
    return res.status(200).send({ stats });
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is up on port", PORT);
});



