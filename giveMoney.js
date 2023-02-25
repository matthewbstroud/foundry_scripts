/*
Distribute money across players in scene.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/giveMoney.js
*/
let sharees = canvas.scene.tokens.filter((token) => token.actor && token.actor.data.type == 'character').map(t => t.actor);
if (sharees.length == 0) {
    ui.notifications.notify('There are no character tokens in this scene.');
    return;
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
            "data.currency.pp": newPP,
            "data.currency.gp": newGP,
            "data.currency.ep": newEP,
            "data.currency.sp": newSP,
            "data.currency.cp": newTotalCP
        });
}

function toNumber(val) {
    if (!val || val == '') {
        return 0;
    }
    return Number(val);
}

function giveCurrency(totalPP, totalGP, totalEP, totalSP, totalCP) {
    let totalToShare = (totalPP * 1000) + (totalGP * 100) + (totalEP * 50) + (totalSP * 10) + totalCP
    let splitCP = Math.floor(totalToShare / actorCount);
    if (splitCP === 0) {
        ui.notifications.notify(`Cannot split ${totalToShare} copper between ${actorCount} people.`);
        return;
    }
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