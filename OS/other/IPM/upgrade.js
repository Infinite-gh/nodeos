module.exports = async () =>{

    const shell = require('shelljs')
    const fs = require('fs')

    let repo = require('../../var/IPM/packages.json')
    const mainConfig = require('../../var/IPM/mainconfig.json')

    const findInJson = require('../findinjson')
    const log = require('../log')

    // base class

    class install{
        constructor(pkg, repo){
            this.packageToInstall = pkg 
            this.repo = repo
        }
        async download(){
            shell.exec(`git clone ${findInJson(this.repo, this.packageToInstall)} ./OS/temp/IPM`)

            await log(`downloaded the package ${this.packageToInstall}.`, `IPM`, `update`)
        }
    }

    // the one for installing packages

    class installPackage extends install{
        async setup(){

            shell.exec(`mv ./OS/temp/IPM/dependencies.txt ./OS/temp/.`)
            await fs.readFile('./OS/temp/dependencies.txt', 'utf8', (err, data) =>{
                if(err){
                    console.log(`an error occured while loading dependencies for this package.`)
                }else{
                    shell.exec(`npm i ${data}`)
                }
            })
            await shell.exec(`cp ./OS/temp/IPM/. ./OS/. -r`)
            await shell.exec(`rm -rf ./OS/temp/IPM`)
            await shell.exec(`rm -rf ./OS/temp/dependencies.txt`)

            await log(`updated package ${this.packageToInstall}`, `IPM`, `update`)
        }
    }

    // the one for upgrading the os

    class upgradeOs extends install{
        async setup(){
            shell.exec(`cp ./OS/temp/IPM/OS. ./OS/. -r`)
            await shell.exec(`rm -rf ./OS/temp/IPM`)

            await log(`updated the OS`, `IPM`, `update`)
        }
    }

    // check the installed packages and update them

    fs.readFile('./OS/var/IPM/installed.txt', (err, data) =>{
        if(err){
            console.log(`there was an error`)
        }else{

            const a = `${data}`
            
            const b = a.split(" ")
            
            b.forEach(package =>{
                updatepackages(package)
            })

            if(mainConfig.OSreinstall === true){
                updateOS()
            }else{
                console.log(`updating the full OS is disabled.`)
            }
        }
    })

    // install scripts

    const updateOS = async () =>{
        const update = new upgradeOs(`update`, repo)
        update.download()
        await update.setup()
    }

    const updatepackages = async (package) =>{
        const thefunctions = new installPackage(package, repo)
        thefunctions.download()
        await thefunctions.setup()
    }

    await log(`updated all the packages`, `IPM`, `update`)
}