/*
Load a random encounter.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/rewireMonksActiveTiles.js
*/
canvas.scene.tiles.filter(t => t.data.flags["monks-active-tiles"].actions.length > 0).forEach(tile => {
    var tileData = JSON.stringify(tile.data.flags['monks-active-tiles']);
    tileData = tileData.replace(/Scene\.\w+/g, canvas.scene.uuid);
    tile.update({
        'flags.monks-active-tiles': JSON.parse(tileData)
    });
});
