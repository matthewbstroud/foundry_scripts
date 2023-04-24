/*
function to update foundry macros with latest github code
*/
function reqListener() {
    if (this.status == 200) {
        if (this.responseText !== '0') {
            let urlParams = new URL(this.responseURL).searchParams;
            let macroID = urlParams.get('macroID');
            
            let newCommand = this.responseText;
            if (!newCommand || newCommand.length == 0) {
                console.log(`${this.responseURL} returned no content!`)
                return;
            }
            let macro = game.macros.get(macroID);
            if (macro){
                macro.update({
                    "command": newCommand
                });
                console.log(`macro=${macro.name} updated.`);
            }
        }
    }
    else{
        console.log(this.statusText);
        throw new Error(this.statusText);
    }

}

let targetMacros = game.macros.filter(m => m.name != "syncMacrosWithGithub" && m.command.search(/SyncUrl\=.+/) > 0);
if (!targetMacros || targetMacros.length == 0) {
    return;
}

for (let macro of targetMacros){
    let match = macro.command.match(/SyncUrl\=.+/);
    if (!match || match.length == 0){
        continue;
    }
    let syncUrl = match[0].split("=")[1];
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", `${syncUrl}?macroID=${macro.id}`);
    oReq.send();
    console.log(`Request sent for macro=${macro.name}`);
}