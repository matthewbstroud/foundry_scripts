
const GM_MACRO = "removeToken_GM";
let gmMacro = game.macros.getName(GM_MACRO);

if (!gmMacro) {
    ui.notifications.notify(`${GM_MACRO} not found!`);
    return;
}

let weaponToken = canvas.scene.tokens.getName(`Spiritual Weapon of ${actor.name}`);

if (!weaponToken) {
    return;
}

gmMacro.execute(weaponToken.id);