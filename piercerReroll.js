if (!["mwak", "rwak", "msak", "rsak"].includes(args[0].item.data.actionType)) return {};
if (args[0].hitTargets.length < 1) return {};

const PIERCER_REROLL = "Piercer: Reroll Damage";

token = canvas.tokens.get(args[0].tokenId);
actor = token.actor;
if (!actor || !token || args[0].hitTargets.length < 1) return {};

let hasPiercer = actor.data.items.find(item => item.name == PIERCER_REROLL);
if (!hasPiercer) return {};

let isCritical = args[0].isCritical; 
let damageFormula = args[0].damageRoll.formula + "";
if (damageFormula.toLowerCase().indexOf('piercing') == -1) return {};
let target = canvas.tokens.get(args[0].hitTargets[0].id ?? args[0].hitTargets[0]._id);
if (!target) MidiQOL.error("Piercer damage reroll macro failed");

if (game.combat) {
    const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn / 100}`;
    const lastTime = actor.getFlag("midi-qol", "piercerRerollTime");
    // always allow on a crit
    if (combatTime === lastTime && !isCritical) {
        MidiQOL.warn("Piercer Reroll Macro: Already done a piercer damage reroll this turn");
        return {};
    }
}
var dieRolls = [];
// get the damage roll results
var terms = args[0].damageRoll.terms;
for (i = 0; i < terms.length; i++) {
    if (isNaN(terms[i].faces)) continue;
    if (terms[i].options.flavor != "piercing") continue;
    for (var j = 0; j < terms[i].results.length; j++) {
        var roll = {};

        roll.die = terms[i].faces;
        roll.result = terms[i].results[j].result;
        roll.ratio = roll.result / roll.die;
        if (roll.ratio < 0.5) {
            dieRolls.push(roll); // only include dice below half of the max result
        }
    }
}

function piercerSortRolls(a, b) {
    // sort rolls by die size and then 
    if ((b.die - a.die) != 0) {
        return b.die - a.die;
    }
    return a.ratio - b.ratio;
}
dieRolls.sort(piercerSortRolls);
if (dieRolls.length == 0) return {};
let dialog = new Promise((resolve, reject) => {
    new Dialog({
        title: "Piercer Reroll",
        content: `<p>Use Piercer Reroll to replace ${dieRolls[0].result} on a 1d${dieRolls[0].die}?`,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Confirm",
                callback: () => resolve(true)
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
                callback: () => { resolve(false) }
            }
        },
        default: "two"
    }).render(true);
});
let usePiercerReroll = await dialog;
if (!usePiercerReroll) return {};

if (game.combat) {
    const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn / 100}`;
    const lastTime = actor.getFlag("midi-qol", "piercerRerollTime");
    if (combatTime !== lastTime) {
        await actor.setFlag("midi-qol", "piercerRerollTime", combatTime)
    }
}
var rollData = `1d${dieRolls[0].die}[piercing] - ${dieRolls[0].result}`;
return { damageRoll: rollData, flavor: "Piercer Reroll Added Damage" };