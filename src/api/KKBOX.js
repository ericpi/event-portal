const config = require('../../config')
const axios = require("axios");
const qs = require('qs');
const { Auth, Api } = require('@kkbox/kkbox-js-sdk')

class KKBOX {
    constructor() {
        this.id = config.kkbox.id;
        this.secret = config.kkbox.secret;
    }

    async initToken() {
        if(config.kkbox.token == undefined) {
            console.log("No Access Token Config!");
        } else {
            this.access_token = config.kkbox.token;
        }
    }

    getApi() {
        return (async () => {
            const auth = new Auth(this.id, this.secret)
            const accessToken = await auth
                .clientCredentialsFlow
                .fetchAccessToken()
                .then(response => {
                    return response.data.access_token
                })
            return new Api(accessToken)
        })()
    }

    fetchTracks(tracks) {
        const url = new URL('https://api.kkbox.com/v1.1/tracks');
        url.searchParams.set('territory', 'TW');
        url.searchParams.set('ids', tracks.map(track => track.id));

        return axios.get(url.toString(), {
            headers: {
                'Authorization': `Bearer ${this.access_token}`
            }
        })
            .then(response => response.data.data)
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

module.exports = new KKBOX()
