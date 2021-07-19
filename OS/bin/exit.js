module.exports = {
    name: "exit",
    desc: "shut down the node.os",
    usage: "exit",
    run: () =>{
        
        const log = require('../other/log')

        log(`ended a session.`, 'sessionmanager', 'sessions')
        process.exit()
    }
}