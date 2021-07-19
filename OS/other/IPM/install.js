module.exports = async (args) =>{

    let repo = require('../../var/IPM/packages.json')

    const log = require('../log')

    const shell = require('shelljs')
    const fs = require('fs')

    const DJ = (json, value) =>{
        const jsons = JSON.stringify(json)
        var objectValue = JSON.parse(jsons);
        if(!objectValue){
            return `404`
        }else{
            return objectValue[value]
        }
    }

    const installSequence = async (args) =>{
        shell.exec(`git clone ${DJ(repo, args[2])} ./OS/temp/IPM`)
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

        await fs.appendFile('./OS/var/IPM/installed.txt', args[2], (err) =>{

        })
    }

    const theRepo = DJ(repo, args[2])

    if(theRepo === `404`){
        log(`can't find ${args[2]} in the repository.`, 'IPM', 'pkgmanager')
    }else{

        fs.readFile('./OS/var/IPM/installed.txt', 'utf8', (err, data) =>{
            if(err){
                console.log(`there was an error reading list of installed packages. maybe create /var/IPM/installed.txt?`)
            }
            if(data.includes(args[2])){
                console.log(`package "${args[2]}" is already installed.`)
            }else{
                installSequence(args)
            }
        })
    }
}