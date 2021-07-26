module.exports = {
    name: "ILM",
    desc: "log into InfiniteCMD (no, this isn't ZenOS)",
    version: "beta 0.0.1",
    usage: "(set it in bootconfig)",
    run: (programs) =>{

        // dependencies 

        const fs = require('fs')
        const readline = require("readline");
        
        // readline

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const globalConfig = require('../var/globalConfig.json')

        const log = require(`../${globalConfig.logPath}`)

        // get users
    
        const users = new Map()

        const usrs = fs.readdirSync(`./OS/var/users`).filter(file => file.endsWith(`.js`));
        for(const file of usrs){
            const cmd = require(`../var/users/${file}`);
            
            log(`found user ${cmd.name}`, `boot`, `loadprograms`)

            users.set(cmd.name, cmd)
        }
        
        // log in

        const login = () =>{
            rl.question('please enter the username: ', (answer1) => {
                rl.question('please enter the password: ', (answer2) => {
    
                    // check if the user exists
    
                    if(!users.get(answer1)){
    
                        console.log(`can't find a user named ${answer1}`)
                        login()
                    
                    }else{
    
                        // check if the password is correct 
                        
                        var pswd = users.get(answer1).password
                        if(pswd === answer2){
                            programs.get(`ISH`).run(users, users.get(answer1), rl)
                        }else{

                            console.log(`incorrect password`)
                            login()
                            
                        }
                    }
                });
            });
        }

        login()
    }
}