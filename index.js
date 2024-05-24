const spotify = require("./spotify");




async function main() {
    try {
        await spotify.credentials('client.json');
        let tracks = await spotify.searchTrack('Love');

        tracks.forEach((track) => {
            console.error("Name: \n\t" + track.name);
            console.log("Artist:\n\t" + track.artist);
            console.log("Album:\n\t" + track.album.name);
            console.log("Cover:\n\t\t" + track.album.cover);
            console.log("Link:\n\t\t" + track.album.url);

        });
    } catch (err) {
        console.error(err);
    }
}

main();
