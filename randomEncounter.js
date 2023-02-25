/*
Load a random encounter.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/randomEncounter.js
*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadRandomScene(timeOfDay) {
    game.tables.getName('Random Encounter - ' + timeOfDay).draw().then((sr) => {
        if (sr.results.length > 0) {
            let result = /^[^\(]+/.exec(sr.results[0].text);
            if (result.length == 1) {
                let sceneName = result[0].trim();
                let scene = game.scenes.getName(sceneName);
                scene.view();
                game.scenes.preload(scene.id, true);
                let combatPlaylist = game.playlists.getName("Combat");
                if (combatPlaylist) {
                    let songs = combatPlaylist.playbackOrder;
                    let songIndex = getRandomInt(0, songs.length);
                    combatPlaylist.playNext(songs[songIndex]);
                    combatPlaylist.playAll();
                }
            }
        }
    });
}
await game.tables.getName('Random Encounter').draw().then((r) => {
    if (r.results.length == 0) {
        return;
    }

    let combat = r.results[0].text.includes("bump");
    if (!combat) {
        return;
    }

    new Dialog({
        title: "Time of Day",
        content: "Select Day or Night",
        buttons: {
            button1: {
                label: "Day",
                callback: () => { loadRandomScene("Day") },
                icon: `<i class="fas fa-check"></i>`
            },
            button2: {
                label: "Night",
                callback: () => { loadRandomScene("Night") },
                icon: `<i class="fas fa-times"></i>`
            }
        },
        default: "button1"
    }).render(true);
});