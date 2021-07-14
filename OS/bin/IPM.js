module.exports = {
    name: "IPM",
    desc: "infinite package manager prototype",
    usage: "IPM [name of the package/help]",
    run: (args, line, user, programs) =>{

        const log = require('../other/log')

        const fs = require('fs');
        const shell = require('shelljs')

        const repo = require('../var/IPM/packages.json')
        
        if(!args[0]){
            console.log(`please run this command with a package name or help`)
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

                if(args[1] === `update`){
                    shell.exec(`git clone https://github.com/Infinite-gh/ICMD-repo ./OS/temp/IPM`)
                    shell.exec(`rm ./OS/var/IPM/packages.json`)
                    shell.exec(`mv ./OS/temp/IPM/packages.json ./OS/var/IPM/.`)
                    shell.exec(`rm -rf ./OS/temp/IPM`)
                }else{

                    const theRepo = DJ(repo, args[1])

                    if(theRepo === `404`){
                        log(`can't find ${args[1]} in the repository.`, 'IPM', 'pkgmanager')
                    }else{
                        shell.exec(`git clone ${DJ(repo, args[1])} ./OS/temp/IPM`)
                        shell.exec(`mv ./OS/temp/IPM/dependencies.txt ./OS/temp/.`)
                        fs.readFile('./OS/temp/dependencies.txt', 'utf8', (err, data) =>{
                            if(err){
                                console.log(`an error occured while loading dependencies for this package.`)
                            }else{
                                shell.exec(`npm i ${data}`)
                            }
                        })
                        shell.exec(`cp ./OS/temp/IPM/. ./OS/. -r`)
                        shell.exec(`rm -rf ./OS/temp/IPM`)
                        shell.exec(`rm -rf ./OS/temp/dependencies.txt`)
                    }
                }
            }
        }
    }
}
