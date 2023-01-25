if (canvas.tokens.controlled.length != 1) {
    ui.notifications.notify('Only one token can be selected to remove currency.');
    return;
}

let targetActor = canvas.tokens.controlled[0].actor;
let targetCurrency = targetActor.data.data.currency;

let targetTotalCP = (targetCurrency.pp * 1000) + (targetCurrency.gp * 100) + (targetCurrency.ep * 50) + (targetCurrency.sp * 10) + targetCurrency.cp;

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
 
function removeCurrency(totalPP, totalGP, totalEP, totalSP, totalCP)
{
    let totalToRemove = (totalPP * 1000) + (totalGP * 100) + (totalEP * 50) + (totalSP * 10) + totalCP

    if (totalToRemove > targetTotalCP) {
        ChatMessage.create({content: `${targetActor.name} doesn't have that much money!`});
        return;
    }
    updateActorCurrency(targetActor, targetTotalCP - totalToRemove);
    let strOutput = "<b>Money taken from  " + targetActor.name + "</b>:<br />";
    if (totalPP > 0) { strOutput += "<span style='color:#90A2B6'>" + totalPP + "pp</span>"; if (totalGP > 0 || totalEP > 0 || totalSP > 0 || totalCP > 0) { strOutput += ", "; } }
    if (totalGP > 0) { strOutput += "<span style='color:#B08C34'>" + totalGP + "gp</span>"; if (totalEP > 0 || totalSP > 0 || totalCP > 0) { strOutput += ", "; } }
    if (totalEP > 0) { strOutput += "<span style='color:#617480'>" + totalEP + "ep</span>"; if (totalSP > 0 || totalCP > 0) { strOutput += ", "; } }
    if (totalSP > 0) { strOutput += "<span style='color:#717773'>" + totalSP + "sp</span>"; if (totalCP > 0) { strOutput += ", "; } }
    if (totalCP > 0) { strOutput += "<span style='color:#9D5934'>" + totalCP + "cp</span>"; }
    
    ChatMessage.create({content: strOutput});
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
                let totalPP = html.find('#pp').val();
                let totalGP = html.find('#gp').val();
                let totalEP = html.find('#ep').val();
                let totalSP = html.find('#sp').val();
                let totalCP = html.find('#cp').val();
                
                if (totalPP == null || Number.isInteger(+totalPP) == false) { totalPP = 0; }
                if (totalGP == null || Number.isInteger(+totalGP) == false) { totalGP = 0; }
                if (totalEP == null || Number.isInteger(+totalEP) == false) { totalEP = 0; }
                if (totalSP == null || Number.isInteger(+totalSP) == false) { totalSP = 0; }
                if (totalCP == null || Number.isInteger(+totalCP) == false) { totalCP = 0; }
                
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