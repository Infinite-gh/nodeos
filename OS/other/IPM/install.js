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

    // installing the required files

    const downloadsequence = async (args) =>{

        shell.exec(`git clone ${DJ(repo, args[2])} ./OS/temp/IPM`)
        await shell.exec(`mv ./OS/temp/IPM/dependencies.txt ./OS/temp/.`)
        await fs.readFile('./OS/temp/dependencies.txt', 'utf8', (err, data) =>{
            if(err){
                console.log(`an error occured while loading dependencies for this package.`)
            }else{
                shell.exec(`npm i ${data}`)
            }
        })

        await log(`downloaded the package and installed required dependencies.`, `IPM`, `install`)

    }

    // after downloading the required files

    const preparationsequence = async (args) =>{

        shell.exec(`cp ./OS/temp/IPM/. ./OS/. -r`)
        await shell.exec(`rm -rf ./OS/temp/IPM`)
        await shell.exec(`rm -rf ./OS/temp/dependencies.txt`)

        await log(`installed package ${args[2]}`, `IPM`, `install`)

        await fs.appendFile('./OS/var/IPM/installed.txt', `${args[2]} `, (err) =>{
            if(err){
                console.log(`an error occured`)
            }
        })
    }

    const installSequence = async (args) =>{

        downloadsequence(args)
        preparationsequence(args)

        log(`installing finished`, `IPM`, `install`)
    }

    const theRepo = DJ(repo, args[2])

    switch(theRepo){

        case "404":
            log(`can't find ${args[2]} in the repository.`, 'IPM', 'install')
        break;

        default:
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
        break;

    }
}