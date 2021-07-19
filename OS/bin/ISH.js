module.exports = {
    name: "ISH",
    desc: "infinite terminal shell",
    usage: "ISH",
    run: (users, user, rl) =>{

        const fs = require('fs')
        const setupPS1 = require('../other/setupps1ISH')

        // load config

        const config = require('../var/ISHconf.json')

        rl.setPrompt(setupPS1(config.PS1, user.name));

        const log = require('../other/log.js')
        
        // a little "hello"

        console.log(`\nHEY YOU! yes, you! \ntype help for a list of commands\n`)

        rl.prompt();

        // actual cmdline
        
        rl.on("line", function(line){

            // load programs

            let programs = new Map()

            let cmds = fs.readdirSync(`./OS${config.PATH}`).filter(file => file.endsWith(`.js`));
            for(const file of cmds){
                const cmd = require(`..${config.PATH}/${file}`);
                    
                programs.set(cmd.name, cmd)
            }

            // set up the ps1 again

            rl.setPrompt(setupPS1(config.PS1, user.name, users));

            // history logging

            log(`entered ${line} into the cmd.`, 'ISH', 'history')

            // normal command handler stuff

            const args = line.split(" ")

            const command = programs.get(args[0])

            // if i didn't put this here, bot would crash on unexistent commands

            if(command){
                if(programs.has(args[0])){
                    programs.get(`${args[0]}`).run(args, line, user, programs, rl)
                }else{
                    log(`called out unexistent command ${args[0]}`)
                }
            }else{

            }
      
            // make it work 

            rl.prompt();

        }).on("close", function() {

            // a little thing

            log(`ended a session.`, 'sessionmanager', 'sessions')
            process.exit(0);
        })
    }
}