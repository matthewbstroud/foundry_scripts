let allActorsInScene = canvas.scene.tokens.filter((token) => token.actor && token.actor.data.type == 'character').map(t => t.actor);
let controlledActors = canvas.tokens.controlled.filter((token) => token.actor && token.actor.data.type == 'character').map(t => t.actor);

if ((!allActorsInScene || allActorsInScene.length == 0) && (!controlledActors || controlledActors.length == 0)) {
    ui.notifications.notify('There are no player characters in this scene.');
    return;
}

let permissionCheck = false;

if (game.user.isGM == true || game.user.isTrusted == true) { permissionCheck = true; }

if (!permissionCheck) {
    ui.notifications.notify('You do not have permission to run this macro.');
    return;
}

function updateActorCurrency(targetActor, newTotalCP) {
    var newAmounts = reduceCurrency(newTotalCP);
    targetActor.update(
        {
            "data.currency.pp": newAmounts.pp,
            "data.currency.gp": newAmounts.gp,
            "data.currency.ep": newAmounts.ep,
            "data.currency.sp": newAmounts.sp,
            "data.currency.cp": newAmounts.cp
        });
}

function getTotalCopper(actor) {
    let targetCurrency = actor.data.data.currency;
    return (targetCurrency.pp * 1000) + (targetCurrency.gp * 100) + (targetCurrency.ep * 50) + (targetCurrency.sp * 10) + targetCurrency.cp;
}

function toNumber(val) {
    if (!val || val == '') {
        return 0;
    }
    return Number(val);
}

function reduceCurrency(copper) {
    let newPP = Math.floor(copper / 1000);
    copper -= newPP * 1000;
    let newGP = Math.floor(copper / 100);
    copper -= newGP * 100;
    let newEP = Math.floor(copper / 50);
    copper -= newEP * 50;
    let newSP = Math.floor(copper / 10);
    copper -= newSP * 10;
    return ({ pp: newPP, gp: newGP, ep: newEP, sp: newSP, cp: copper });
}

function removeCurrency(totalPP, totalGP, totalEP, totalSP, totalCP) {
    let totalToRemove = (totalPP * 1000) + (totalGP * 100) + (totalEP * 50) + (totalSP * 10) + totalCP;
    let targetActors = controlledActors;
    if (!targetActors || targetActors.length === 0) {
        // if no controlled actors take a distributed amount from the 
        // player characters in the scene
        targetActors = allActorsInScene;
        totalToRemove = Math.floor(totalToRemove / targetActors.length);
        if (totalToRemove <= 0) {
            ui.notifications.notify(`Shared take amount is zero.`);
            return;
        }
    }

    let actorsAndCash = targetActors.map(a => ({ actor: a, totalCopper: getTotalCopper(a) }));

    // validated each character has enough money
    actorsAndCash.forEach(t => {
        if (t.totalCopper < totalToRemove) {
            ChatMessage.create({ content: `${t.actor.name} doesn't have enough money!` });
            return;
        }
    });

    let amountsTaken = reduceCurrency(totalToRemove);
    let strOutput = "";
    // remove the money
    actorsAndCash.forEach(t => {
        updateActorCurrency(t.actor, (t.totalCopper - totalToRemove))
        strOutput += "<b>Money taken from  " + t.actor.name + "</b>:<br />";
        if (amountsTaken.pp > 0) { strOutput += "<span style='color:#90A2B6'>" + amountsTaken.pp + "pp</span>"; if (amountsTaken.gp > 0 || amountsTaken.ep > 0 || amountsTaken.sp > 0 || amountsTaken.cp > 0) { strOutput += ", "; } }
        if (amountsTaken.gp > 0) { strOutput += "<span style='color:#B08C34'>" + amountsTaken.gp + "gp</span>"; if (amountsTaken.ep > 0 || amountsTaken.sp > 0 || amountsTaken.cp > 0) { strOutput += ", "; } }
        if (amountsTaken.ep > 0) { strOutput += "<span style='color:#617480'>" + amountsTaken.ep + "ep</span>"; if (amountsTaken.sp > 0 || amountsTaken.cp > 0) { strOutput += ", "; } }
        if (amountsTaken.sp > 0) { strOutput += "<span style='color:#717773'>" + amountsTaken.sp + "sp</span>"; if (amountsTaken.cp > 0) { strOutput += ", "; } }
        if (amountsTaken.cp > 0) { strOutput += "<span style='color:#9D5934'>" + amountsTaken.cp + "cp</span>"; }
        strOutput += "<br />";
    });

    ChatMessage.create({ content: strOutput });
}

const currencyTotals = `
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
    title: `Take Currency`,
    content: `
        <form>
            ${currencyTotals}
        </form>
    `,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Take`,
            callback: (html) => {
                let totalPP = toNumber(html.find('#pp').val());
                let totalGP = toNumber(html.find('#gp').val());
                let totalEP = toNumber(html.find('#ep').val());
                let totalSP = toNumber(html.find('#sp').val());
                let totalCP = toNumber(html.find('#cp').val());

                removeCurrency(Number(totalPP), Number(totalGP), Number(totalEP), Number(totalSP), Number(totalCP));
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}).render(true)