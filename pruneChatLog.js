
/*
Macro will delete chat messages older than a week.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/pruneChatLog.js
*/

function deleteChatMessages(startDate) {
    let cutoffTimestamp = startDate.getTime();
    let messagesToDelete = game.messages.filter(m => m.data.timestamp < cutoffTimestamp);
    let timestamps = Array.from(messagesToDelete.map(m => m.data.timestamp));
    console.log(`Will delete ${timestamps.length} starting at ${new Date(Math.max.apply(Math, timestamps))}`);
    messagesToDelete.forEach(m => {
        m.delete();
    });
}


var startDate = new Date();
startDate.setDate(startDate.getDate() - 7);
console.log(`Start date = ${startDate}`)
deleteChatMessages(startDate);
