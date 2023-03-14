
/*
Macro will delete chat messages newer that specified timespan.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/deleteChatMessages.js
*/

function deleteChatMessages(minutesBack) {
    let cutoffTimestamp = (new Date()).getTime() - (minutesBack * 60000);
    let messagesToDelete = game.messages.filter(m => m.data.timestamp >= cutoffTimestamp);
    messagesToDelete.forEach(m => {
        console.log(`Deleting message ${m.id} with timestamp: ${m.data.timestamp}.`);
        m.delete();
    });
}

function toNumber(val) {
    if (!val || val == '') {
        return 0;
    }
    return Number(val);
}

let formHtml = `
<b>How far back?:</b><br />
<div style="display: flex; width: 100%; margin: 10px 0px 10px 0px">
    <label for="minutes_back" style="white-space: nowrap; margin: 4px 10px 0px 10px;">Minutes:</label>
    <input type="number" value="0" id="minutes_back" name="minutes_back" />
</div>
`;

new Dialog({
    title: `Delete Chat Messages`,
    content: `
        <form>
            ${formHtml}
        </form>
    `,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Delete`,
            callback: (html) => {
                let minutes = toNumber(html.find('#minutes_back').val());
                deleteChatMessages(minutes);
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}, { width: 500 }).render(true)