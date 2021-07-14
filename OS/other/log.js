module.exports = (loggedMsg, dir, file) =>{

    // stuff

    const fs = require('fs')
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        
        // current year

        let year = date_ob.getFullYear();
        
        // current hours

        let hours = date_ob.getHours();
        
        // current minutes
        let minutes = date_ob.getMinutes();
        
        // current seconds

        let seconds = date_ob.getSeconds();

        const stuff = 
`
V

${loggedMsg} 
(at ${year + "-" + date + "-" + month + " " + hours + ":" + minutes + ":" + seconds})

V
`
    fs.mkdir(`./OS/logs/${dir}`, (err) =>{
        
    })

    fs.appendFile(`./OS/logs/${dir}/${file}.txt`, stuff, (err) => {
        if(err) console.log(err)
    });

    console.log(`\n${stuff}`)
}