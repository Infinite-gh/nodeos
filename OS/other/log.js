module.exports = (loggedMsg, dir, file) =>{

    // stuff

    const setupPs1 = require('./setupps1ISH')
    const fs = require('fs')
    const config = require('../var/log.json')

    const stuff = 
`
${setupPs1(config.start)}
${setupPs1(loggedMsg)} 
${setupPs1(config.footer)}
${setupPs1(config.end)}
`
    fs.mkdir(`./OS/logs/${dir}`, (err) =>{
        
    })

    fs.appendFile(`./OS/logs/${dir}/${file}.txt`, stuff, (err) => {
        if(err) console.log(err)
    });

    console.log(`\n${stuff}`)
}