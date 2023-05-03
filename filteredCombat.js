/*
remove invalid tokens before toggling combat
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/filteredCombat.js
*/

function shouldRelease(token) {
    const excludedFolders = ["Traps", "Loot", "Summons"];
    if (token.inCombat) {
        return true;
    }
    var folderName = token?.actor?.folder?.name ?? "root";
    if (excludedFolders.includes(folderName)) {
        return true;
    }
    if (token.actor.effects.filter(e => e.label == "Dead").length > 0) {
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
let combatMusicMacro = game.macros.getName("Combat Music");
if (!combatMusicMacro) {
    return;
}
combatMusicMacro.execute("start");
