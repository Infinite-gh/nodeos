module.exports = async (args) =>{

    let repo = require('../../var/IPM/packages.json')

    const log = require('../log')

    const shell = require('shelljs')
    const fs = require('fs')

    const findInJson = require('../findinjson')

    const theRepo = findInJson(repo, args[2])
    
    // base class

    class install{
        constructor(pkg, repo){
            this.packageToInstall = pkg 
            this.repo = repo
        }
        async download(){
            shell.exec(`git clone ${findInJson(this.repo, this.packageToInstall)} ./OS/temp/IPM`)

            await log(`downloaded the package ${this.packageToInstall}.`, `IPM`, `install`)
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
            await fs.appendFile('./OS/var/IPM/installed.txt', this.packageToInstall, (err) =>{
                if(err){
                    console.log(`an error occured.`)
                }
            })

            await log(`installed package ${this.packageToInstall}`, `IPM`, `install`)
        }
    }

    const installSequence = async (args) =>{

        const daclass = new installPackage(args[2], repo)

        daclass.download()
        daclass.setup()

        log(`installing finished`, `IPM`, `install`)
    }


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