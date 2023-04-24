/*
Sync portent resource.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/Portent/syncPortentDice.js
*/

let actor = args[0].actor;

if (!actor.flags.ddbimporter) {
    return;
}

let actorResources = actor.flags.ddbimporter.resources;

let diceResource = "";
if (actorResources.primary = "Portent") {
    diceResource = "primary";  
}
else if (actorResources.secondary = "Portent") {
    diceResource = "secondary";  
}
else if (actorResources.tertiary = "Portent") {
    diceResource = "tertiary";  
}

if (diceResource == "") {
    return;
}
let portent = actor.items.getName("Portent");
let currentUses = parseInt(portent.system.uses.value) - 1;
if (currentUses < 0) {
    return;
}
portent.update({ "uses.value": currentUses});
actor.update({ [`system.resources.${diceResource}.value`]: currentUses });