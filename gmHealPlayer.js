/*
heal a player
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/gmHealPlayer.js
*/
debugger;
let actorID = args[0];
let healAmount = args[1];
let targetActor = game.actors.get(actorID);
if (!targetActor) {
    return;
}
let hp = targetActor.data.data?.attributes?.hp;


if (hp.value >= hp.max) {
    return;
}
let newAmount = hp.value + healAmount;
if (newAmount > hp.max) {
    newAmount = hp.max;
}
targetActor.update({ 'data.attributes.hp.value': newAmount });