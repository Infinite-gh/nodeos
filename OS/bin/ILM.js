module.exports = {
    name: "ILM",
    desc: "log into InfiniteCMD (no, this isn't ZenOS)",
    usage: "(set it in bootconfig)",
    run: (programs) =>{
        const fs = require('fs')
        const readline = require("readline");
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const globalConfig = require('../var/globalConfig.json')

        const log = require(`../${globalConfig.logPath}`)
    
        const users = new Map()

        const usrs = fs.readdirSync(`./OS/var/users`).filter(file => file.endsWith(`.js`));
        for(const file of usrs){
            const cmd = require(`../var/users/${file}`);
            
            log(`found user ${cmd.name}`, `boot`, `loadprograms`)

            users.set(cmd.name, cmd)
        }
            
        
        rl.question('please enter the username: ', (answer1) => {
            rl.question('please enter the password: ', (answer2) => {
                var pswd = users.get(answer1).password
                if(pswd === answer2){
                    programs.get(`ISH`).run(users, users.get(answer1), rl)
                }
            });
        });
    }
}