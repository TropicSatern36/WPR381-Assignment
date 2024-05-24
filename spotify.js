//import Spotify Api module
const SpotifyWebAPI = require('spotify-web-api-node');
// import general api interaction module
const fetch = require('node-fetch');
// import file system module and file path module
const fs = require('fs').promises;
const path = require('path');

// Create Spotify API instance
const spotifyApi = new SpotifyWebAPI();

const spotify = {
    // Initialize Spotify credentials for Api
    credentials: async (file) => {
        try {
            // Load json file with credentials
            const filePath = path.join(__dirname, file);
            const data = await fs.readFile(filePath);
            const client = JSON.parse(data);
            
            console.log('Getting access token...');
            // Get access token from server using fetch request
            // curl -X POST "https://accounts.spotify.com/api/token" \
            //      -H "Content-Type: application/x-www-form-urlencoded" \
            //      -d "grant_type=client_credentials&client_id=00000&client_secret=00000"
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
            // Error reporting
            if (!response.ok) {
                console.error('Failed to get token from server');
                throw new Error('Failed to get token');
            }
            // Get json object containing token information
            const json = await response.json();
            console.log('Access token: ' + json.access_token);

            // Write token to console
            spotifyApi.setAccessToken(json.access_token);
            // return token for external use if ever required
            return json.access_token;
        } catch (err) {
            //Report error
            console.error('Failed to load client credentials:', err);
            throw err;
        }
    },
    searchTrack: async (search) => {
        try {
            const data = await spotifyApi.searchTracks(search);
            console.log(data.body.tracks.total + " Results ");
            const tracks = data.body.tracks.items.map(track =>{
                return {
                    name: track.name,
                    artist: track.artists.map(artist =>artist.name).join(', '),
                    preview_url: track.preview_url,
                    album:{
                        name: track.album.name,
                        cover: track.album.images.length > 0? track.album.images[0].url : "No cover image available",
                        url: track.album.external_urls.spotify
                    }
                };
            });
            return tracks
        } catch (err) {
            console.error('Error fetching tracks:', err);
            return [];
        }
    }
};

module.exports = spotify;

