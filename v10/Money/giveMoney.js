/*
Distribute money across players in scene.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/Money/giveMoney.js
*/
debugger;
let sharees = canvas.scene.tokens.filter((token) => token.actor && token.actor.folder.name == "Players").map(t => t.actor);
if (sharees.length == 0) {
    ui.notifications.notify('There are no character tokens in this scene.');
    return;
}

let controlledActors = canvas.tokens.controlled.filter((token) => token.actor && token.actor.type == 'character').map(t => t.actor);
if (controlledActors.length > 0) {
    sharees = controlledActors;
}

let actorCount = sharees.length;
let permissionCheck = false;
if (game.user.isGM == true || game.user.isTrusted == true) { permissionCheck = true; }

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
            "system.currency.pp": newPP,
            "system.currency.gp": newGP,
            "system.currency.ep": newEP,
            "system.currency.sp": newSP,
            "system.currency.cp": newTotalCP
        });
}

function toNumber(val) {
    if (!val || val == '') {
        return 0;
    }
    return Number(val);
}

function getShareAmount(sharedCopper) {
    let splitPP = Math.floor(sharedCopper / 1000);
    sharedCopper -= splitPP * 1000;
    let splitGP = Math.floor(sharedCopper / 100);
    sharedCopper -= splitGP * 100;
    let splitEP = Math.floor(sharedCopper / 50);
    sharedCopper -= splitEP * 50;
    let splitSP = Math.floor(sharedCopper / 10);
    sharedCopper -= splitSP * 10;
    let strShareAmount = "";
    if (splitPP > 0) { strShareAmount += "<span style='color:#90A2B6'>" + splitPP + "pp</span>"; if (splitGP > 0 || splitEP > 0 || splitSP > 0 || sharedCopper > 0) { strShareAmount += ", "; } }
    if (splitGP > 0) { strShareAmount += "<span style='color:#B08C34'>" + splitGP + "gp</span>"; if (splitEP > 0 || splitSP > 0 || sharedCopper > 0) { strShareAmount += ", "; } }
    if (splitEP > 0) { strShareAmount += "<span style='color:#617480'>" + splitEP + "ep</span>"; if (splitSP > 0 || sharedCopper > 0) { strShareAmount += ", "; } }
    if (splitSP > 0) { strShareAmount += "<span style='color:#717773'>" + splitSP + "sp</span>"; if (sharedCopper > 0) { strShareAmount += ", "; } }
    if (sharedCopper > 0) { strShareAmount += "<span style='color:#9D5934'>" + sharedCopper + "cp</span>"; }
    return strShareAmount;
}

function giveCurrency(totalPP, totalGP, totalEP, totalSP, totalCP) {
    let totalToShare = (totalPP * 1000) + (totalGP * 100) + (totalEP * 50) + (totalSP * 10) + totalCP
    let splitCP = Math.floor(totalToShare / actorCount);
    if (splitCP === 0) {
        ui.notifications.notify(`Cannot split ${totalToShare} copper between ${actorCount} people.`);
        return;
    }

    let strOutput = `<b>Cha-ching!</b><br />`;
    let sharedAmount = getShareAmount(splitCP);
    sharees.forEach(actor => {
        let actorCurrency = actor.system.currency;
        let actorCurrentCP = (actorCurrency.pp * 1000) + (actorCurrency.gp * 100) + (actorCurrency.ep * 50) + (actorCurrency.sp * 10) + actorCurrency.cp;
        let actorNewTotal = actorCurrentCP + splitCP;
        updateActorCurrency(actor, actorNewTotal);
        strOutput += `${actor.name} received: ${sharedAmount}<br />`;
    });

    ChatMessage.create({ content: strOutput });
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

new Dialog({
    title: `Give Currency`,
    content: `
        <form>
            ${currencyTotals}
        </form>
    `,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Give`,
            callback: (html) => {
                let totalPP = toNumber(html.find('#pp').val());
                let totalGP = toNumber(html.find('#gp').val());
                let totalEP = toNumber(html.find('#ep').val());
                let totalSP = toNumber(html.find('#sp').val());
                let totalCP = toNumber(html.find('#cp').val());

                giveCurrency(Number(totalPP), Number(totalGP), Number(totalEP), Number(totalSP), Number(totalCP));
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}).render(true)