const bodyParser = require('body-parser');
const express = require('express');
const axios = require("axios");

global.kkbox = require('./src/api/KKBOX');
const kkbox = global.kkbox;

const port = Number(process.env.PORT) || 5000;

kkbox.initToken();
const server = express();

const verify = (req, _, buf) => {
    req.rawBody = buf.toString();
};
server.use(bodyParser.json({ verify }));
server.use(bodyParser.urlencoded({ extended: false, verify }));

server.get('/api/events', (req, res) => {
    const q_map = { 'tp':'台北', 'ntp':'新北', 'ty':'桃園', 'tc':'台中', 'tn':'台南', 'kh':'高雄' };
    const url = new URL('https://api.kkbox.com/v1.1/events');
    url.searchParams.set('territory', 'TW');
    var city = (q_map[req.query.city] == undefined) ? '台北' : q_map[req.query.city];
    url.searchParams.set('q', city);

    return axios.get(url.toString(), {
        headers: {
            'Authorization': `Bearer ${kkbox.access_token}`
        }
    }).then(function(resp) {
        res.json(resp.data);
    }).catch(function(error) {
        console.error('Error:', error);
    });
});

server.use(express.static('public'));

server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
});

