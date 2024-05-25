const spotify = require("./spotify");

async function main(search) {
    try {
        await spotify.credentials('client.json');
        let tracks = await spotify.searchTrack(search);

        tracks.forEach((track) => {
            console.log("Name: \n\t" + track.name);
            console.log("Artist:\n\t" + track.artist);
            console.log("Preview:\n\t" + track.preview_url);
            console.log("Album:\n\t" + track.album.name);
            console.log("Cover:\n\t\t" + track.album.cover);
            console.log("Link:\n\t\t" + track.album.url);

        });
    } catch (err) {
        console.error(err);
    }
}

main('Diggy Diggy Hole');
