module.exports = async () =>{

    const shell = require('shelljs')
    const fs = require('fs')

    let repo = require('../../var/IPM/packages.json')
    const mainConfig = require('../../var/IPM/mainconfig.json')

    // check the installed packages and update them

    fs.readFile('./OS/var/IPM/installed.txt', (err, data) =>{
        if(err){
            console.log(`there was an error`)
        }else{

            const a = `${data}`
            
            const b = a.split(" ")
            
            b.forEach(package =>{
                installSequence(package)
            })

            if(mainConfig.OSreinstall === true){
                modifiedfullinstall(`update`)
            }else{
                console.log(`updating the full OS is disabled.`)
            }
        }
    })

    const log = require('../log')

    // the name is self-descriptive

    const findInJson = (json, value) =>{
        const jsons = JSON.stringify(json)
        var objectValue = JSON.parse(jsons);
        if(!objectValue){
            return `404`
        }else{
            return objectValue[value]
        }
    }

    // installing the required files

    const downloadsequence = async (package) =>{

        shell.exec(`git clone ${findInJson(repo, package)} ./OS/temp/IPM`)
        await shell.exec(`mv ./OS/temp/IPM/dependencies.txt ./OS/temp/.`)
        await fs.readFile('./OS/temp/dependencies.txt', 'utf8', (err, data) =>{
            if(err){
                console.log(`an error occured while loading dependencies for this package.`)
            }else{
                shell.exec(`npm i ${data}`)
            }
        })

        await log(`downloaded the package ${package} and installed required dependencies.`, `IPM`, `update`)

    }

    // modified for just the OS reinstall

    const modifiedDownload = async (package) =>{

        shell.exec(`git clone ${findInJson(repo, package)} ./OS/temp/IPM`)
        await fs.readFile('./OS/temp/dependencies.txt', 'utf8', (err, data) =>{
            if(err){
                console.log(`an error occured while loading dependencies for this package.`)
            }else{
                shell.exec(`npm i ${data}`)
            }
        })

        await log(`downloaded the package ${package} and installed required dependencies.`, `IPM`, `update`)

    }

    // after downloading the required files

    const preparationsequence = async (package) =>{

        shell.exec(`cp ./OS/temp/IPM/. ./OS/. -r`)
        await shell.exec(`rm -rf ./OS/temp/IPM`)
        await shell.exec(`rm -rf ./OS/temp/dependencies.txt`)

        await log(`updated package ${package}`, `IPM`, `update`)
    }

    // modified for just the OS reinstall

    const modifiedPrep = async (package) =>{

        shell.exec(`cp ./OS/temp/IPM/OS. ./OS/. -r`)
        await shell.exec(`rm -rf ./OS/temp/IPM`)

        await log(`updated package ${package}`, `IPM`, `update`)
    }

    // full sequence

    const installSequence = async (package) =>{

        downloadsequence(package)
        preparationsequence(package)

        log(`installing finished`, `IPM`, `update`)
    }
    
    // modified for just the OS reinstall

    const modifiedfullinstall = async (package) =>{

        modifiedDownload(package)
        await modifiedPrep(package)

        await log(`installing finished`, `IPM`, `update`)
    }

    await log(`updated all the packages`, `IPM`, `update`)
}