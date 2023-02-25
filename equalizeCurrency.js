/*
D&D 5th edition According to the Player's Handbook (5e) (2014), p.143, 
the exchange rate of coins is: 
1 silver = 10 copper 1 electrum = 5 silver 1 gold = 10 silver 1 platinum = 10 gold

Macro will generate 5 taroka card tiles on the current scene.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/equalizeCurrency.js
*/

let actors = canvas.tokens.controlled.map(({ actor }) => actor);
let actorCount = actors.length;

if (actorCount <= 0 || !(game.user.isGM || game.user.isTrusted == true)) {
    return;
}

let currentCash = actors.map(a => a.data.data.currency);

let totalPP = 0;
let totalGP = 0;
let totalEP = 0;
let totalSP = 0;
let totalCP = 0;

currentCash.forEach(currency => {
    totalCP += currency.pp * 1000;
    totalCP += currency.gp * 100;
    totalCP += currency.ep * 50;
    totalCP += currency.sp * 10;
    totalCP += currency.cp;
});

let splitCP = Math.floor(totalCP / actorCount);


let splitPP = Math.floor(splitCP / 1000);
splitCP -= splitPP * 1000;
let splitGP = Math.floor(splitCP / 100);
splitCP -= splitGP * 100;
let splitEP = Math.floor(splitCP / 50);
splitCP -= splitEP * 50;
let splitSP = Math.floor(splitCP / 10);
splitCP -= splitSP * 10;

actors.forEach(actor => {
    actor.update(
        {
            "data.currency.pp": splitPP,
            "data.currency.gp": splitGP,
            "data.currency.ep": splitEP,
            "data.currency.sp": splitSP,
            "data.currency.cp": splitCP
        });
});

let message = `Each character now has PP: ${splitPP} GP:${splitGP} EP:${splitEP} SP:${splitSP} CP:${splitCP}`;

ChatMessage.create({
    content: message,
    type: CONST.CHAT_MESSAGE_TYPES.OOC
});