module.exports = async () =>{

    const shell = require('shelljs')

    const log = require('../log')
    
    shell.exec(`git clone https://github.com/Infinite-gh/ICMD-repo ./OS/temp/IPM`)
    await shell.exec(`rm ./OS/var/IPM/packages.json`)
    await shell.exec(`rm ./OS/var/IPM/packagelist.txt`)
    await shell.exec(`mv ./OS/temp/IPM/packages.json ./OS/var/IPM/.`)
    await shell.exec(`mv ./OS/temp/IPM/packagelist.txt ./OS/var/IPM/.`)
    await shell.exec(`rm -rf ./OS/temp/IPM`)

    await log(`updated the repository`, `IPM`, `refresh`)
}