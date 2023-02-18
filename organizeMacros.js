/*
This script will organize macros into folders by user.  It will remove any actor macros that are no
longer accesible by any user.
*/
const PLAYER_MACROS_FOLDER = "Player Macros";

var playersFolder = game.folders.getName(PLAYER_MACROS_FOLDER);

if (!playersFolder) {
    playersFolder = await Folder.create({ "name": PLAYER_MACROS_FOLDER, "type": "Macro" });
}


let actorMacros = game.macros.filter(m => m.data.scope == "actor" && !m.data.parent);
for (var i=0; i < actorMacros.length; i++) {

    if (actorMacros[i].data.permission > 0) {
        continue;
    }
    let newPermissions = removeInvalidPermissions(actorMacros[i]);
    if (Object.keys(newPermissions).length == 1) {
        // remove macro
        console.log(`Delete ${actorMacros[i].data.name}`);
        actorMacros[i].delete();
        continue;
    }

    let user = game.users.get(actorMacros[i].data.author);
    if (!user) {
        continue;
    }
    console.log(user.name);
    let playerFolder = playersFolder.getSubfolders().find(f => f.name == user.name);
    if (!playerFolder) {
        playerFolder = await Folder.create({ "name": user.name, "type": "Macro", "parent": playersFolder.id });
    }
    if (!playerFolder) {
        ui.notifications.notify(`Cannot create folder for user ${user.name}.`);
        continue;
    }
    actorMacros[i].update({"folder": playerFolder.id});
}

function removeInvalidPermissions(macro) {
    let newPermissionData = deepCopy(macro.data.permission);
    for (let [k, v] of Object.entries(newPermissionData)) {
        if (k === "default") {
            continue;
        }
        if (!game.users.get(k)) {
            // remove permission for user not in game
            delete newPermissionData[k];
        }
    }
    return newPermissionData;
}

function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}