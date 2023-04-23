/*
createFireplace - turn an overlapping tile into a fireplace macro
to use: place a tile over a light and sfx and run this macro while the tile is selected.'
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/createFireplace.js
*/

let fireplaceTile = canvas.tiles.controlled[0];

if (!fireplaceTile) {
    ui.notifications.notify(`No background tile selected`);
    return;
}

let toggleFireplaceMacro = game.macros.getName("toggleFireplace");
if (!toggleFireplaceMacro) {
    ui.notifications.notify(`toggleFireplace macro not loaded`);
    return;
}
let tileBounds = {
    x: {
        min: fireplaceTile.data.x,
        max: fireplaceTile.data.x + fireplaceTile.data.width
    },
    y: {
        min: fireplaceTile.data.y,
        max: fireplaceTile.data.y + fireplaceTile.data.height
    }
};
let lights = canvas.scene.lights.filter(l => l.data.x >= tileBounds.x.min && l.data.x <= tileBounds.x.max && l.data.y >= tileBounds.y.min && l.data.y <= tileBounds.y.max);
if (lights.length != 1) {
    ui.notifications.notify(`Only a single light should exist in this tile!`);
    return;
}
let sounds = canvas.scene.sounds.filter(l => l.data.x >= tileBounds.x.min && l.data.x <= tileBounds.x.max && l.data.y >= tileBounds.y.min && l.data.y <= tileBounds.y.max);
if (sounds.length != 1) {
    ui.notifications.notify(`Only a single sound should exist in this tile!`);
    return;
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function createFireplace(fpName, tile, light, sound, macro) {
    light.setFlag("world", "fireplace", fpName);
    sound.setFlag("world", "fireplace", fpName);
    tile.document.update({
        "img": "/custom_icons/Fireplace_Icon.webp",
        "hidden": true,
        "locked": true,
        "flags.monks-active-tiles": {
            "active": true, 
            "record": false, 
            "restriction": "all", 
            "controlled": "gm", 
            "trigger": "dblclick", 
            "allowpaused": true, 
            "usealpha": false, 
            "pointer": false, 
            "pertoken": false, 
            "minrequired": 0, 
            "chance": 100, 
            "fileindex": 0, 
            "actions": [{ 
                "action": "runmacro", 
                "data": { 
                    "entity": { 
                        "id": macro.uuid, 
                        "name": macro.name 
                    }, 
                    "args": `"${fpName}"`, 
                    "runasgm": "gm" 
                },
                "id": uuidv4()
            }], 
            "files": []
        }
    });
}

createFireplace(uuidv4(), fireplaceTile, lights[0], sounds[0], toggleFireplaceMacro);
