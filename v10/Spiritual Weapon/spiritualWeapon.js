//SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/Spiritual%20Weapon/spiritualWeapon.js
//provided by siliconsaint for honeybadger's warpgate v1.5.0
//https://github.com/trioderegion/warpgate


const GM_MACRO = "spiritualWeapon_GM";

let gmMacro = game.macros.getName(GM_MACRO);

if (!gmMacro) {
    ui.notifications.notify(GM_MACRO);
    return;
}

let spiritualWeapon = `modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_200x200.webm`;
let crosshairConfig = {
    icon: spiritualWeapon,
    label: "Place Weapon"
};

let crosshairData = await warpgate.crosshairs.show(crosshairConfig);


gmMacro.execute(game.user.id, args[0].actor._id, args[0].tokenId, args[0].spellLevel, crosshairData.x, crosshairData.y);