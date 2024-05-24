const SpotifyWebAPI = require('spotify-web-api-node');
const fetch = require('node-fetch');

// Create Api 
var spotifyApi = new SpotifyWebAPI();

const getToken = async () => {
    // Get client id and secret
    const client = {
        id: 'a0055798dcd840dda471c3e37d2eb337',
        secret: 'bf45e85bf1cb47fd90b9954f6214fd84'
    };
    console.log('Getting access token...');
    // Get access token from server
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${client.id}:${client.secret}`).toString('base64')}`
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    });

    if (!response.ok) {
        console.error('Failed to get token from server');
        console.error(response.headers);
        throw new Error('Failed to get token');
    }

    const json = await response.json();
    console.log('Access token: ' + json.access_token);
    return json.access_token;
};


spotifyApi.setAccessToken(getToken());

spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
    .then((data) => {
        console.log(data.body.items[0].images[0].url);

    })
    .catch((err) => {
        console.log('error');
        console.log(err);
    }
    );
