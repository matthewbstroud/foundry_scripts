let actors = canvas.scene.tokens.filter((token) => token.actor && token.actor.data.type == 'character').map(t => t.actor).sort(sortByName);
if (actors.length == 0) {
    ui.notifications.notify('There are no character tokens in this scene.');
    return;
}

var sessionEndSummaryHtml = `
<table>
  <tr>
    <th style="text-align:left">Character</th>
    <th style="text-align:right">Exp</th>
    <th style="text-align:right">HP (TEMP)</th>
    <th style="text-align:right">PP</th>
    <th style="text-align:right">GP</th>
    <th style="text-align:right">EP</th>
    <th style="text-align:right">SP</th>
    <th style="text-align:right">CP</th>
  </tr>`;

actors.forEach(actor => {
    sessionEndSummaryHtml += generateActorSummary(actor);
});
sessionEndSummaryHtml += `</table>`;


var folder = game.folders.getName("Session Summaries");

if (!folder) {
    ui.notifications.info("Please Create a Session Summaries folder under Journal Entries...");
    return;
}

await JournalEntry.create({
    name: `Session End Summary: ${(new Date()).toLocaleString()}`,
    content: sessionEndSummaryHtml,
    folder: folder.id
});

function generateActorSummary(actor) {
    return `
  <tr>
    <td style="text-align:left">${actor.name}</td>
    <td style="text-align:right">${actor.data.data.details.xp.value}</td>
    <td style="text-align:right">${actor.data.data.attributes.hp.value} (${toNumber(actor.data.data.attributes.hp.temp)})</td>
    <td style='text-align:right;color:#90A2B6'>${toNumber(actor.data.data.currency.pp)}</td>
    <td style='text-align:right;color:#B08C34'>${toNumber(actor.data.data.currency.gp)}</td>
    <td style='text-align:right;color:#617480'>${toNumber(actor.data.data.currency.ep)}</td>
    <td style='text-align:right;color:#717773'>${toNumber(actor.data.data.currency.sp)}</td>
    <td style='text-align:right;color:#9D5934'>${toNumber(actor.data.data.currency.cp)}</td>
  </tr>
`;
}

function toNumber(val) {
    if (!val || val == '') {
        return 0;
    }
    return Number(val);
}

function sortByName(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}