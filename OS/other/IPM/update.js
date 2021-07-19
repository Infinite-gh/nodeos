module.exports = () =>{

    const shell = require('shelljs')
    
    shell.exec(`git clone https://github.com/Infinite-gh/ICMD-repo ./OS/temp/IPM`)
    shell.exec(`rm ./OS/var/IPM/packages.json`)
    shell.exec(`rm ./OS/var/IPM/packagelist.txt`)
    shell.exec(`mv ./OS/temp/IPM/packages.json ./OS/var/IPM/.`)
    shell.exec(`mv ./OS/temp/IPM/packagelist.txt ./OS/var/IPM/.`)
    shell.exec(`rm -rf ./OS/temp/IPM`)
}