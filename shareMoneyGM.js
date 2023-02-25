/*
Allow players to share a lump sum - GM logic
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/shareMoneyGM.js
*/
if (!args || args.length != 3) {
    ui.notifications.notify('Invalid arguments');
}
let sharer = game.actors.get(args[0]);

let sharerCurrency = sharer.data.data.currency;

let sharerTotalCP = (sharerCurrency.pp * 1000) + (sharerCurrency.gp * 100) + (sharerCurrency.ep * 50) + (sharerCurrency.sp * 10) + sharerCurrency.cp;

let sharees = args[1].map(a => game.actors.get(a));
if (sharees.length == 0) {
    ui.notifications.notify('You must target at least one player to share money with.');
    return;
}

let shareAmounts = args[2];

let actorCount = sharees.length + 1;
let permissionCheck = false;
if (game.user.isGM == true || game.user.isTrusted == true) { permissionCheck = true; }

shareCurrency(shareAmounts.PP, shareAmounts.GP, shareAmounts.EP, shareAmounts.SP, shareAmounts.CP);

function updateActorCurrency(targetActor, newTotalCP) {
    let newPP = Math.floor(newTotalCP / 1000);
    newTotalCP -= newPP * 1000;
    let newGP = Math.floor(newTotalCP / 100);
    newTotalCP -= newGP * 100;
    let newEP = Math.floor(newTotalCP / 50);
    newTotalCP -= newEP * 50;
    let newSP = Math.floor(newTotalCP / 10);
    newTotalCP -= newSP * 10;

    targetActor.update(
        {
            "data.currency.pp": newPP,
            "data.currency.gp": newGP,
            "data.currency.ep": newEP,
            "data.currency.sp": newSP,
            "data.currency.cp": newTotalCP
        });
}

function shareCurrency(totalPP, totalGP, totalEP, totalSP, totalCP) {
    let totalToShare = (totalPP * 1000) + (totalGP * 100) + (totalEP * 50) + (totalSP * 10) + totalCP

    if (totalToShare > sharerTotalCP) {
        ChatMessage.create({ content: `${sharer.name} doesn't have that much money!` });
        return;
    }
    let splitCP = Math.floor(totalToShare / actorCount);
    if (splitCP === 0) {
        ui.notifications.notify(`Cannot split ${totalToShare} copper between ${actorCount} people.`);
        return;
    }
    updateActorCurrency(sharer, sharerTotalCP - (totalToShare - splitCP));
    sharees.forEach(actor => {
        let actorCurrency = actor.data.data.currency;
        let actorCurrentCP = (actorCurrency.pp * 1000) + (actorCurrency.gp * 100) + (actorCurrency.ep * 50) + (actorCurrency.sp * 10) + actorCurrency.cp;
        let actorNewTotal = actorCurrentCP + splitCP;
        updateActorCurrency(actor, actorNewTotal);
    });
    let splitPP = Math.floor(splitCP / 1000);
    splitCP -= splitPP * 1000;
    let splitGP = Math.floor(splitCP / 100);
    splitCP -= splitGP * 100;
    let splitEP = Math.floor(splitCP / 50);
    splitCP -= splitEP * 50;
    let splitSP = Math.floor(splitCP / 10);
    splitCP -= splitSP * 10;

    let strOutput = "<b>Gave " + sharees.length + " players each</b>:<br />";
    if (splitPP > 0) { strOutput += "<span style='color:#90A2B6'>" + splitPP + "pp</span>"; if (splitGP > 0 || splitEP > 0 || splitSP > 0 || splitCP > 0) { strOutput += ", "; } }
    if (splitGP > 0) { strOutput += "<span style='color:#B08C34'>" + splitGP + "gp</span>"; if (splitEP > 0 || splitSP > 0 || splitCP > 0) { strOutput += ", "; } }
    if (splitEP > 0) { strOutput += "<span style='color:#617480'>" + splitEP + "ep</span>"; if (splitSP > 0 || splitCP > 0) { strOutput += ", "; } }
    if (splitSP > 0) { strOutput += "<span style='color:#717773'>" + splitSP + "sp</span>"; if (splitCP > 0) { strOutput += ", "; } }
    if (splitCP > 0) { strOutput += "<span style='color:#9D5934'>" + splitCP + "cp</span>"; }

    ChatMessage.create({ speaker: { alias: sharer.name }, content: strOutput });
};

let currencyTotals = `
<b>Currency Totals:</b><br />
<div style="display: flex; width: 100%; margin: 10px 0px 10px 0px">
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">PP:</label>
    <input type="number" id="pp" name="pp" />
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">GP:</label>
    <input type="number" id="gp" name="gp" />
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">EP:</label>
    <input type="number" id="ep" name="ep" />
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">SP:</label>
    <input type="number" id="sp" name="sp"/ >
    <label for="pp" style="white-space: nowrap; margin: 4px 10px 0px 10px;">CP:</label>
    <input type="number" id="cp" name="cp"/ >
</div>
`;
