/*
applyAdhocDamage - used to quickly create damage of any type and amount and apply it to the selected players.'
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/applyAdhocDamage.js
*/


let adHocDamage = {
    damageButtons: function _damageButtons() {
        return [
            {
                "label": "🧪 Acid",
                "value": "acid"
            },
            {
                "label": "🔨 Bludgeoning",
                "value": "bludgeoning"
            },
            {
                "label": "❄️ Cold",
                "value": "cold"
            },
            {
                "label": "🔥 Fire",
                "value": "fire"
            },
            {
                "label": "🛡 Force",
                "value": "force"
            },
            {
                "label": "⚡ Lightning",
                "value": "lightning"
            },
            {
                "label": "☠️ Necrotic",
                "value": "necrotic"
            },
            {
                "label": "🏹 Piercing",
                "value": "piercing"
            },
            {
                "label": "🤮 Poison",
                "value": "poison"
            },
            {
                "label": "😱 Psychic",
                "value": "psychic"
            },
            {
                "label": "☀ Radiant",
                "value": "radiant"
            },
            {
                "label": "⚔ Slashing",
                "value": "slashing"
            },
            {
                "label": "🌩 Thunder",
                "value": "thunder"
            }
        ];
    },
    releaseInvalidTokens: function _releaseInvalidTokens() {
        function shouldRelease(token) {
            const excludedFolders = ["Traps", "Loot", "Summons"];
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
    },
    createButtonDialog: async function _createButtonDialog(title, buttons, direction) {
        let selected = await warpgate.buttonDialog(
            {
                buttons,
                title
            },
            direction
        );
        return selected;
    },
    getDamageType: async function _getDamageType() {
        return await this.createButtonDialog("Select Damage Type", this.damageButtons(), 'column');
    },
    getDamageDice: async function _getDamageDice() {
        let diceButtons = ['d4', 'd6', 'd8', 'd10', 'd20', 'd100'];
        return await this.createButtonDialog("Select Damage Dice", diceButtons.map(v => ({ label: v, value: v })), 'column');
    },
    getDiceCount: async function _getDiceCount() {
        let numberButtons = [];
        for (let i = 1; i <= 20; i++) {
            numberButtons.push({ label: `${i}`, value: i });
        }
        return await this.createButtonDialog("How Many Dice?", numberButtons, 'row');
    },
    getSortedNames: function _getSortedNames(targets) {
        let sortedNames = targets.map(t => t.name).sort();
        let targetNames = sortedNames.slice(0, sortedNames.length - 1).join(`, `);
        if (sortedNames.length > 1) {
            targetNames += ` and ${sortedNames[sortedNames.length - 1]} have`;
        }
        else {
            targetNames = `${sortedNames[0]} has`;
        }
        return targetNames;
    }
};

// release tokens that shouldn't take damage
adHocDamage.releaseInvalidTokens();
// get the tokens remaining
let targets = canvas.tokens.controlled;
if (!targets || targets.length == 0) {
    ui.notifications.notify(`No valid tokens selected!`);
    return;
}

let damageType = await adHocDamage.getDamageType();
if (!damageType) {
    return;
}
let damageDice = await adHocDamage.getDamageDice();
if (!damageDice) {
    return;
}
let diceCount = await adHocDamage.getDiceCount();
if (!diceCount) {
    return;
}
const damageRoll = await new Roll(`${diceCount}${damageDice}[${damageType}]`).evaluate({ async: true })
damageRoll.toMessage({ flavor: `${adHocDamage.getSortedNames(targets)} been struck with ${CONFIG.DND5E.damageTypes[damageType]} damage!` });
await MidiQOL.applyTokenDamage([{ type: `${damageType}`, damage: damageRoll.total }], damageRoll.total, new Set(targets), null, new Set(), { forceApply: false });
