const SpotifyWebAPI = require('spotify-web-api-node');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

// Create Spotify API instance
const spotifyApi = new SpotifyWebAPI();

const spotify = {
    credentials: async (file) => {
        try {
            const filePath = path.join(__dirname, file);
            const data = await fs.readFile(filePath);
            const client = JSON.parse(data);
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
                throw new Error('Failed to get token');
            }

            const json = await response.json();
            console.log('Access token: ' + json.access_token);

            spotifyApi.setAccessToken(json.access_token);
            return json.access_token;
        } catch (err) {
            console.error('Failed to load client credentials:', err);
            throw err;
        }
    },
    artistAlbums: async (artistId) => {
        try {
            const data = await spotifyApi.getArtistAlbums(artistId);
            console.log(data.body.items[0].images[0].url);
        } catch (err) {
            console.error('Error fetching artist albums:', err);
        }
    }
};

module.exports = spotify;


async function main() {
    try {
        const token = await spotify.credentials('client.json');
        console.log(token);
        spotify.artistAlbums('43ZHCT0cAZBISjO8DG9PnE');
    } catch (err) {
        console.error(err);
    }
}

main();
