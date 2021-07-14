
const globalConfig = require('../var/globalConfig.json')
const config = require('./bootconfig.json')
const ISHconf = require(`../var/ISHconf.json`)

const fs = require('fs');
const log = require(`../${globalConfig.logPath}`)
    
const programs = new Map()

const cmds = fs.readdirSync(`./OS${ISHconf.PATH}`).filter(file => file.endsWith(`.js`));
for(const file of cmds){
    const cmd = require(`..${ISHconf.PATH}/${file}`);
        
    log(`found program ${cmd.name}`, `boot`, `loadprograms`)

    programs.set(cmd.name, cmd)
}

programs.get(config.loginManager.name).run(programs)