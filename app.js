const qr = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const fs = require('fs').promises;
const ImageUpscale = require("./ImageUpscale");

let setAway = false;

const client = new Client({
    puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        authStrategy: new LocalAuth({ clientId: "client-1" })
    }
});

client.initialize();

client.on('qr', (qr) => {
    console.log('QR RECEIVED: ', qr);
    qr.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    const command = msg.body.toLowerCase();

    if (command.startsWith('!')) {
        console.log(`Message: ${command} sent by ${msg.from}`);
    }

    // ping command
    if (command == '!ping') {
        msg.reply('pong');
    }

    // help command
    if (command == '!help') {
        msg.reply(`List of Available Commands:\n !ping`);
    }

    // Away command
    if (setAway == true) {
        msg.reply("I'm currently away and I'll get back to you as soon as possible. \nHave a good day :)  !")
    }

    // Image to high resolution file
    if (command == "hr" && msg.hasMedia) {
        try {
            console.log("Received Image");

            const media = await msg.downloadMedia();
            const fileName = `${Date.now()}.png`;

            // write file
            await fs.writeFile(fileName, Buffer.from(media.data, 'base64'));
            console.log(fileName);

            const OutputFileName = `Processed_${fileName}`
            await ImageUpscale(fileName, OutputFileName);

            const processedfileImage = MessageMedia.fromFilePath(OutputFileName, { type: 'image/png' });
            await client.sendMessage(msg.from, processedfileImage, { sendMediaAsDocument: true, caption: 'Processed Document' });

            // const uploadMedia = new MessageMedia('image/png', processedImageFile.toString('base64'));
            await fs.unlink(fileName);
        } catch (err) {
            console.error(err);
        }
    }



});


client.on('message_create', (msg) => {
    // Fired on all message creations, including your own 
    const command = msg.body;

    if (msg.fromMe && command == "!ping") {
        client.sendMessage("917827743670@c.us", "Got it");
    }

    if (msg.fromMe && command == "!away") {
        setAway = setAway ? false : true;
        client.sendMessage("917827743670@c.us", `Away is set to ${setAway}`);
    }
});


client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});