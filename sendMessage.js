const qr = require('qrcode-terminal');
const { Client,LocalAuth } = require('whatsapp-web.js');

// Get Params
var params = {  }
process.argv.slice(2).forEach(arg=>{
    var [key,value] =arg.split("=")
    params[key] = value || true
})

if(!params.number || !params.msg)
{
    console.log("Phone number or msg missing! Try Again")
    console.log(`Usage: number="911234590859" msg="Your message here" }`);
    process.exit(0)
}


//  const client = new Client();
//  Create Client with LocalAuth
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-1" })  
});

//Define Sleep/Wait
const wait = (msec) => new Promise((resolve, _) => {
    setTimeout(resolve, msec);
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED: ', qr);
    qr.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Client is ready!');

    const msg = await client.sendMessage(`${params.number}@c.us`, params.msg)
    console.log(msg);
    await wait(10000);
    client.destroy();
});

client.on('message', msg => {

    console.log("FROM: ", msg.from);
    console.log("Received: ", msg.body);

    if (msg.body == '!ping') {
        msg.reply('pong');
    }

});

client.initialize();