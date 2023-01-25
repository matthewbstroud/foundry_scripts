function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
await game.tables.getName('Random Encounter').draw().then((r) => {
    if (r.results.length == 0) {
        return;
    }

    let combat = r.results[0].text.includes("bump");
    if (!combat) {
        return;
    }
    let timeOfDay = prompt("Is it day(d) or night(n)?");
    timeOfDay = timeOfDay == "d" ? "Day" : "Night";
    game.tables.getName('Random Encounter - ' + timeOfDay).draw().then((sr) => {
        let sceneRoll = Number(sr.roll.result);
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
});