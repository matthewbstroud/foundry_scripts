/*
Sync superiority dice resource.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/syncSuperiorityDice.js
*/
let actor = args[0].actor;

if (!actor.data.flags.ddbimporter) {
    return;
}

let actorResources = actor.flags.ddbimporter.resources;

let diceResource = "";
if (actorResources.primary = "Superiority Dice") {
    diceResource = "primary";  
}
else if (actorResources.secondary = "Superiority Dice") {
    diceResource = "secondary";  
}
else if (actorResources.tertiary = "Superiority Dice") {
    diceResource = "tertiary";  
}

if (diceResource == "") {
    return;
}
let currentDice = actor.items.getName("Superiority Dice").system.uses.value;
actor.update({[`system.resources.${diceResource}.value`]: currentDice});