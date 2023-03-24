/*
Reload a bow or crossbow.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/reloadRangedWeapon.js
*/

// canvas.tokens.controlled[0].actor.items.filter(i => i.data.type == "consumable" && i.data.data.quantity > 0 && i.data.data.actionType == "rwak" && i.name.toLowerCase().includes("arrow"))

let reloader = {
    getEqippedRangedWeapons: function _getEqippedRangedWeapons(target) {
        return target.items.filter(i => i.data.data.equipped == true && i.data.type == "weapon" && i.data.data.actionType == "rwak");
    },
    getAmmo: function _getAmmo(target, weapon) {
        let ammoType = "unknown";
        switch (weapon.data.data.baseItem) {
            case "longbow":
            case "shortbow":
                ammoType = "arrow";
                break;
            case "crossbow":
                ammoType = "bolt";
                break;
            case "sling":
                ammoType = "bullet";
                break;
        }
        if (ammoType == "unknown") {
            return [];
        }
        return target.items.filter(i => i.data.type == "consumable" && i.data.data.quantity > 0 && i.data.data.actionType == "rwak" && i.name.toLowerCase().includes(ammoType));
    },
    loadWeapon: async function _loadWeapon(weapon, ammo){
        weapon.update(
            { 
                "data.consume.type": "ammo",
                "data.consume.target": ammo.id,
                "data.consume.amount": 1
            }
        );
        
    },
    createButtonDialog: async function _createButtonDialog(title, buttons) {
        let selected = await warpgate.buttonDialog(
            {
                buttons,
                title
            },
            'column'
        );
        return selected;
    }
};

var controlledActors = canvas.tokens.controlled.filter((token) => token.actor && token.actor.data.type == 'character').map(t => t.actor)
if (controlledActors.length != 1) {
    ui.notifications.notify(`You must select a single player token!`);
    return;
}
var controlledActor = controlledActors[0];
var equippedRangeWeapons = reloader.getEqippedRangedWeapons(controlledActor);

if (equippedRangeWeapons.length < 1) {
    ui.notifications.notify(`${controlledActor.name} has no equipped ranged weapons!`);
    return;
}

var selectedWeaponID = await reloader.createButtonDialog("Select Weapon", equippedRangeWeapons.map(w => ({label: w.name, value: w.id})));
if (!selectedWeaponID) {
    return;
}
var selectedWeapon = equippedRangeWeapons.find(w => w.id == selectedWeaponID);
var availableAmmo = reloader.getAmmo(controlledActor, selectedWeapon);

if (availableAmmo.length < 1) {
    ui.notifications.notify(`${controlledActor.name} has no available ammo for ${selectedWeapon.name}!`);
    return;
}

var selectedAmmoID = await reloader.createButtonDialog("Select Ammo", availableAmmo.map(a => ({label: `${a.name} (${a.data.data.quantity})`, value: a.id})));
if (!selectedAmmoID) {
    return;
}
var selectedAmmo = availableAmmo.find(a => a.id == selectedAmmoID);

reloader.loadWeapon(selectedWeapon, selectedAmmo);
ChatMessage.create({ speaker: { alias: controlledActor.name }, content: `Loads ${selectedAmmo.name} into ${selectedWeapon.name}...` });