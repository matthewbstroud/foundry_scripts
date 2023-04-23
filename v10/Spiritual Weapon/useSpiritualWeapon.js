/*
Use or cast spiritual weapon
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/Spiritual%20Weapon/useSpiritualWeapon.js
*/

if (canvas.tokens.controlled.length != 1) {
    ui.notifications.notify(`Please select a single actor!`);
    return;
}
let targetActor = canvas.tokens.controlled[0].actor;
let weaponActor = null;

if (!targetActor || (targetActor.type == "npc" && !targetActor.name.includes("Spiritual Weapon"))) {
    ui.notifications.notify(`Please select a player!`);
    return;
}
else if (targetActor.name.includes("Spiritual Weapon")){
    weaponActor = targetActor;
}
if (!weaponActor){
    const summonType = 'Spiritual Weapon';
    let weaponName = `${summonType} of ${targetActor.name}`;
    let weaponToken = canvas.scene.tokens.getName(weaponName);
    if (weaponToken) {
        weaponActor = weaponToken.actor;
    }
}

if (weaponActor) {
    let attack = weaponActor.items.getName("Attack");
    if (attack) {
        attack.roll();
        return;
    }
    return;
}

let spiritualWeaponSpell = targetActor?.items.getName("Spiritual Weapon (F)");
if (!spiritualWeaponSpell) {
    ui.notifications.notify(`${targetActor.name} doesn't know Spiritual Weapon!`);
    return;
}

spiritualWeaponSpell.roll();