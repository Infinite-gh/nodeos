module.exports = async (args) =>{

    let repo = require('../../var/IPM/packages.json')

    const log = require('../log')

    const shell = require('shelljs')
    const fs = require('fs')
    const fse = require('fs-extra')

    const findInJson = require('../findinjson')
    const rmdir = require('../removedir')

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

            fse.copySync(`./OS/temp/IPM/.`, `./OS/.`, {overwrite: true}, (err) =>{
                if(err){                 
                    console.log(`there was an error while installing this package`)      
                }else{
                    console.log("successfully copied the package files");
                }
            });

            // remove the garbaj

            // remove the temporary package files

            rmdir(`./OS/temp/IPM`)
            
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