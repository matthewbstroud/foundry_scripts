/*
remove invalid tokens before toggling combat
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/filteredCombat.js
*/

function shouldRelease(token) {
    if (token.inCombat){
        return true;
    }
    if (token.actor.folder.name == "Traps") {
        return true;
    }
    if (token.actor.folder.name == "Loot") {
        return true;
    }
    if (token.actor.effects.filter(e => e.data.label == "Dead").length > 0) {
        return true;
    }
    
    return false;
}

let tokensToRelease = canvas.tokens.controlled.filter(t => shouldRelease(t));
tokensToRelease.forEach(t => {
    t.release();
});

await canvas.tokens.toggleCombat();
await game.combat.rollNPC();