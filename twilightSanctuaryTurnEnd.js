/*
end of turn automation for twilight sanctuary, requires midi-qol and event macros
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/twilightSanctuaryTurnEnd.js
*/

const twilightUtil = {
    REMOVABLE_EFFECTS: /(charmed|feared|frightened)/gi,
    getDistance: function _getDistance(source, target) {
        let sourceTokens = source.getActiveTokens();
        let targetTokens = target.getActiveTokens();
        if (!sourceTokens || sourceTokens.length > 1) {
            ui.notifications.notify(`${source.name} can only have 1 active token in the scene!`);
            return 50;
        }
        if (!targetTokens || targetTokens.length > 1) {
            ui.notifications.notify(`${target.name} can only have 1 active token in the scene!`);
            return 50;
        }
        let distance = canvas.dimensions.distance;
        return distance * Math.round(canvas.grid.measureDistance(sourceTokens[0].center, targetTokens[0].center) / distance);
    },
    getUserChoice: async function _createDialog(actor) {
        let buttons = [
            {
                label: "Heal Temp HP",
                value: "heal"
            }
        ];

        buttons = buttons.concat(
            actor.effects.contents
                .filter(e => e.data.label.match(REMOVABLE_EFFECTS))
                .map(e => ({ label: `Remove: ${e.data.label}`, value: e.id })));
        return await warpgate.buttonDialog(
            {
                buttons,
                title: "Twilight Sanctuary"
            },
            'column'
        );
    },
    applyTempHP: async function _applyTempHP(caster, target){
        let current_tempHP = target.data.data?.attributes?.hp?.temp;
    
        // Roll Twilight Sanctuary temporary hit points
        let healRoll = new Roll('1d6 + @classes.cleric.levels', caster.getRollData()).evaluate({ async: false });
    
        healRoll.toMessage({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            flavor: "Twilight Sanctuary - Temp HP"
        });
        debugger;
        // Check if new roll is higher than old temp HP
        console.log(healRoll);
        let new_tempHP = parseInt(healRoll.total);
    
        if (current_tempHP && current_tempHP <= new_tempHP) {
            return;
        }
    
        token.actor.update({ 'data.attributes.hp.temp': new_tempHP });
    },
    removeEffect: async function _removeEffect(target, effectID) {
        return target.effects.get(effectID)?.delete();
    }
};

let caster = origin.parent;

if (caster.data.data.attributes.hp <= 0) {
    return;
}

if (twilightUtil.getDistance(caster, actor) > 30) {
    return;
}

let choice = await twilightUtil.getUserChoice(actor);
switch(choice) {
    case "heal":
        twilightUtil.applyTempHP(caster, actor);
        break;
    default:
        twilightUtil.removeEffect(actor, choice);
}


//canvas.scene.tokens.filter(token  => token.actor && token.actor.data.type == 'character' && token.actor.effects.contents.filter(e => e.data.origin.startsWith(`Actor.n21cvOAbggJAcIwL`).length > 0)).map(t => t.actor.effects.contents.filter(e => e.data.origin.startsWith(`Actor.n21cvOAbggJAcIwL`)))