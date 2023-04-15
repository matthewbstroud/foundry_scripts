/*
combatMusic - play combat music starting with a random selection
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/combatMusic.js
*/

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let mode = "toggle";
if (args && args.length == 1) {
    mode = args[0];
}

let combatPlaylist = game.playlists.getName("Combat");
if (combatPlaylist) {
    if (mode == "start" && combatPlaylist.playing) {
        return;
    }
    else if (combatPlaylist.playing) {
        combatPlaylist.stopAll();
        return;
    }
    let songs = combatPlaylist.playbackOrder;
    let songIndex = getRandomInt(0, songs.length);
    combatPlaylist.playNext(songs[songIndex]);
    combatPlaylist.playAll();
}