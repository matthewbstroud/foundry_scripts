if (canvas.tokens.controlled.length != 1) {
    ui.notifications.notify('Only one token can be selected to share currency.');
    return;
}

if (!actor || actor.data.type != 'character') {
    ui.notifications.notify('Only a player character can be selected to share currency.');
    return;
}

let gmShareMacro = game.macros.getName('Share Money (GM)');

if (!gmShareMacro) {
    ui.notifications.notify('Share Money (GM) not found!');
    return;
}

let sharer = actor;
let sharerCurrency = sharer.data.data.currency;

let sharerTotalCP = (sharerCurrency.pp * 1000) + (sharerCurrency.gp * 100) + (sharerCurrency.ep * 50) + (sharerCurrency.sp * 10) + sharerCurrency.cp;

let sharees = canvas.scene.tokens.filter((token) => token.actor && token.actor.data.type == 'character' && token.actor.id != actor.id).map(t => t.actor);
if (sharees.length == 0) {
    ui.notifications.notify('You must target at least one player to share money with.');
    return;
}

let actorCount = sharees.length + 1;

function toNumber(val) {
    if (!val || val == '') {
        return 0;
    }
    return Number(val);
}

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
    title: `Distribute Currency`,
    content: `
        <form>
            ${currencyTotals}
        </form>
    `,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Distribute`,
            callback: (html) => {
                let totalPP = toNumber(html.find('#pp').val());
                let totalGP = toNumber(html.find('#gp').val());
                let totalEP = toNumber(html.find('#ep').val());
                let totalSP = toNumber(html.find('#sp').val());
                let totalCP = toNumber(html.find('#cp').val());

                var shareAmounts = {
                    'PP': totalPP,
                    'GP': totalGP,
                    'EP': totalEP,
                    'SP': totalSP,
                    'CP': totalCP
                };

                gmShareMacro.execute(sharer.id, sharees.map(s => s.id), shareAmounts);
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}).render(true)