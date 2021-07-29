const removedir = require('../removedir')

module.exports = async () =>{

    const shell = require('shelljs')
    const fs = require('fs')
    const fse = require('fs-extra')

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

            // move the dependencies file

            fs.rename(`./OS/temp/IPM/dependencies.txt`, `./OS/temp/.`, function (err) {
                if (err) console.log(`there was an error while installing the package`)
                else console.log('successfully moved dependencies file')
            })

            // install the dependencies

            await fs.readFile('./OS/temp/dependencies.txt', 'utf8', (err, data) =>{
                if(err){
                    console.log(`an error occured while loading dependencies for this package.`)
                }else{
                    shell.exec(`npm i ${data}`)
                }
            })

            // copy the package

            fse.copy(`./OS/temp/IPM/.`, `./OS/.`, {overwrite: true}, (err) =>{
                if(err){                 
                    console.log(`there was an error while installing this package`)      
                }else{
                    console.log("successfully copied the package files");
                }
            });

            // remove the garbaj

            // remove the temporary package files

            removedir(`./OS/temp/IPM`)
            
            // remove dependencies.txt

            await fs.unlink('./OS/temp/dependencies.txt', (err) =>{
                if(err) console.log(`there was an error while removing temporary package files`);
                console.log('successfully deleted the dependencies file');
            });

            // add the package to the installed list

            await fs.appendFile('./OS/var/IPM/installed.txt', this.packageToInstall, (err) =>{
                if(err){
                    console.log(`an error occured.`)
                }
            })

            await log(`installed package ${this.packageToInstall}`, `IPM`, `install`)
        }
    }

    // the one for upgrading the os

    class upgradeOs extends install{
        async setup(){
            fse.copy(`./OS/temp/IPM/OS/.`, './OS/.', {overwrite: true}, (err) =>{
                if(err) console.log(`there was an error while upgrading the OS`)
            })
            
            removedir(`./OS/temp/IPM`)

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