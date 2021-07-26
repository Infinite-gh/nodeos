const upgrade = require('../other/IPM/upgrade')

module.exports = {
    name: "IPM",
    desc: "infinite package manager prototype",
    version: "beta 0.0.2",
    usage: "IPM [refresh/install/help]",
    run: async (args, line, user, programs) =>{

        const log = require('../other/log')
         
        // get the functions
        
        const update = require('../other/IPM/update')
        const install = require('../other/IPM/install')

        // check if the user has inputed any arguments
        
        if(!args[1]){
            console.log(`please run install help or refresh`)
        }else{

            // check what operation does the user want to do

            switch(args[1]){

                case "refresh":
                    update()
                break;

                case "r":
                    update()
                break;

                case "install":
                    install(args)
                break;
                    
                case "i":
                    install(args)
                break;

                case "help":
                    console.log(`commands\nIPM refresh => refresh the repository\nIPM install [package name] => install [package name]\nIPM update => update all the installed packages`)
                break;

                case "h":
                    console.log(`commands\nIPM refresh => refresh the repository\nIPM install [package name] => install [package name]\nIPM update => update all the installed packages`)
                break;

                case "update":
                    upgrade()
                break;

                case "u":
                    upgrade()
                break;
                
                default:
                    console.log(`can't find a function of IPM ${args[1]}`, `IPM`, `manager`)
                break;
            }

            await log(`(IPM) used ${args[1]}`, `IPM`, `manager`)
        }
    }
}