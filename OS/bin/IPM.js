module.exports = {
    name: "IPM",
    desc: "infinite package manager prototype",
    usage: "IPM [name of the package/help]",
    run: async (args, line, user, programs) =>{
        
        const update = require('../other/IPM/update')
        const install = require('../other/IPM/install')
        
        if(!args[1]){
            console.log(`please run install help or update`)
        }else{
            if(args[1] === `help`){
                console.log(`commands\nIPM update => update the repository\nIPM [package name] => install [package name]\n`)
            }else{

                const DJ = (json, value) =>{
                    const jsons = JSON.stringify(json)
                    var objectValue = JSON.parse(jsons);
                    if(!objectValue){
                        return `404`
                    }else{
                        return objectValue[value]
                    }
                }

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
                }
            }
        }
    }
}