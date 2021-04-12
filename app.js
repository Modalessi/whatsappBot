const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
let {PythonShell} = require('python-shell')
const readline = require('readline');





const SESSION_FILE_PATH = './session.json';

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const helpMsg = `

🤖ZELINSKI BOT COMMANDS🤖


🌁   $s : 
send it with media (image, video or gif) 
to convert it into sticker 

 📷   $insta :
mention this command on instagram post link
or send the link in a following line to download posts (please wait as it takes some time)

 🐦   $twitter :
mention this command on twitter tweet link
or send the link in a following line to download tweet's video (please wait as it takes some time)

🎵  $sc :
mention this command on soundcloud link
or send the link in a following line to download it (please wait as it takes some time)

🤔    $choose:
send it with  items provided in every single line
to choose randomly 

❤️    $love :
Send it or mention a message with it and the bot will reply with a compliment audio 

🏡     $help :
to get this list

` ;

const client = new Client({
    puppeteer: {
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
    session: sessionData
})


client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr);

});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});


client.on('ready', () => {
    console.log('Bot is ready!');
});




client.on('message', async msg => {

    printMSG(msg)

    if (msg.body == '$hi') {
        msg.reply("yes sir !") ;
        




    } else if (msg.body.toLocaleLowerCase().includes("cs")) {
        msg.reply("computer science forever") ;




    } else if (msg.body.toLocaleLowerCase().includes("swe")) {
            msg.reply("computer science is better") ;




    } else if (msg.body == "$s") {
        creatSticker(msg) ;





    } else if (msg.body.startsWith("$choose")) {
        choose(msg) ;




    } else if (msg.body == "$help") {
        msg.reply(helpMsg);



    } else if ((msg.body.startsWith("$math")) && messageFromBoss(msg)) {
        msg.reply(doMath(msg.body), msg.from) ;




    } else if (msg.body == "$love") {
        sendMediaFileToMSG(msg, "love1.mp3")




    } else if (msg.body.startsWith("$insta")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/instaDownloader.py', null, function (err) {
            if (!err) {
                sendInstaVidos(msg) ;
            } else {
                msg.reply("عذرا حدث خطا ما")
            }
          });




    } else if (msg.body.startsWith("$twitter")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/twitterDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "twitterVideo.mp4")
            }
          });




    } else if (msg.body == "$sc") {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/soundDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "soundcloudFile.mp3") ;
            }
          });




    } else if (msg.body == "$yt") {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/youtubeDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "youtubeVideo.mp4") ;
            }
          });




    } else if (msg.body.startsWith("$ytmp3")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/youtubeDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                PythonShell.run("./pythonCode/youtubeToMp3.py", null, function (err) {
                    if (err) {
                        msg.reply("عذرا حدث خطا ما")
                    } else {
                        sendMediaFileToMSG(msg, "youtubeVideo.mp3") ;
                    }
                }) ;
            }
          });




    } else if (msg.body.startsWith("$startVote") && (messageFromBoss(msg))) {
        creatVote(msg.body) ;
        const voteMessage = creatVoteMessage()
        client.sendMessage(msg.from,voteMessage) ;




    } else if(msg.body == "$endVote" && (messageFromBoss(msg))) {
        const result = calculateVotesAndCreatMessage()
        client.sendMessage(msg.from,result) ;




    } else if(msg.body.startsWith("$startSpam") && (messageFromBoss(msg))) {
        const items = msg.body.split("\n") ;
        startSpam(msg,items[1], items[2]) ;



    } 
    
    if (msgIsVote(msg)) {
        votes.push(msg.body.toUpperCase()) ;
    }


});


// -MARK: Commands Functions 

async function creatSticker(msg) {
    if (msg.hasQuotedMsg) {
        const qm = await msg.getQuotedMessage()
        const attachmentData = await qm.downloadMedia();
        msg.reply(attachmentData,msg.from,{sendMediaAsSticker: true});
    } else {
        const attachmentData = await msg.downloadMedia();
        msg.reply(attachmentData,msg.from,{sendMediaAsSticker: true});
    }
}


function printMSG(msg) {
    console.log(`[${msg.from}] \n ${msg.body}`)
}


function choose(msg) {
    const random = randomLine(msg.body)
    msg.reply(random)
}


function messageFromBoss(msg) {
    if (msg.id["_serialized"].includes("509587069")) {
        return true ;
    } else {
        return false ;
    }
}

async function sendMediaFileToMSG(msg, fileName) {
    const media = MessageMedia.fromFilePath(`./media/${fileName}`)
    if (msg.hasQuotedMsg) {
        const qm = await msg.getQuotedMessage()
        qm.reply(media, msg.from)
    } else {
        msg.reply(media, msg.from)
    }
}

async function msgIsVote(msg) {
    if (msg.body.length == 1 && letters.includes(msg.body.toUpperCase())) {
        if (msg.hasQuotedMsg) {
            const qm = await msg.getQuotedMessage()
            if (qm.body.includes("🗳 GROUP VOTE 🗳")) {
                return true
            }
        }
    }

    return false
}

function randomLine(s) {
    const items = s.split("/n") ;
    items.shift()
    let ran = Math.floor((Math.random() * items.length)) ;

    return items[ran] ;
}

function doMath(s) {
    const splitted = s.split("\n") ;
    const eq = splitted[1] ;
    const res = eval(eq) ;
    return res.toString() ;
}


// -MARK: Votes Functions

let options = {} ;
let votes = [] ;
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "M", "N", "O", "P"] ;

function calculateVotesAndCreatMessage() {
    const result = {} ;
    const optionsLength = Object.keys(options).length
    for (let i = 0; i < optionsLength; i++) {
        const count = countVote(letters[i]) ;
        const percent = ((count / votes.length) * 100).toFixed(2)
        result[letters[i]] = percent ;
        console.log(result)
    }
    
    let resultMessage = `🗳 VOTE RESULT 🗳 ` ;

    const resutlLength = Object.keys(result).length

    for (let i = 0; i < resutlLength; i++) {
        let option = `\n\n-${options[letters[i]]}: %${result[letters[i]]} ` ;
        resultMessage += option
    }

    return resultMessage ;
}

function countVote(vote) {
    var count = 0;
    for(let i = 0; i < votes.length; i++){
        if(votes[i] === vote) {
            count += 1;
        }
    }
    console.log(count)
    return count ;
}

function creatVote(voteCommand) {
    votes = [] ;
    options = {} ;
    const items = voteCommand.split("\n") ;
    items.shift() ;

    for (let i = 0; i < items.length; i++) {
        options[letters[i]] = items[i]
        console.log(options)
    }

}


function creatVoteMessage() {
    let voteMessage = `🗳 GROUP VOTE 🗳` ;
    const optionsLength = Object.keys(options).length
    for (let i = 0; i < optionsLength; i++) {
        let option = `\n\nReply with ${letters[i]} to vote for: \n-${options[letters[i]]}`
        voteMessage += option
    }

    voteMessage += "\n\nsend $endVote to end vote and send results" ;
    return voteMessage
}


// -MARK: Social Media Functions

function getInstaShortcode(url) {
    const items = url.split("/")
    for (let i = 0; i < items.length; i++) {
        if (items[i].length == 11) {
            return items[i] ;
        }
    }
    return -1 ;
}

async function writeShortcode(msg) {
    let url = ""

    if (msg.hasQuotedMsg) {
        const qm = await msg.getQuotedMessage()
        url = msg.body.startsWith("$insta") ? getInstaShortcode(qm.body) : qm.body
    } else {
        const splitted = msg.body.split("\n") ;
        url = msg.body.startsWith("$insta") ? getInstaShortcode(splitted[1]) : splitted[1] ;
    }

    fs.writeFile(`shortcode.txt`, url, function(err) {
        if (err) {
            return -1 ;
        } else {
            return 1 ;
        }
    });
}

async function sendInstaVidos(msg) {
    let filesPaths = [] ;
    fs.readdir("./media/insta", function (err, files) {
        if (err) {
            msg.reply("عذرا حدث خطا ما")
        } else {
    
            files.forEach(function (file, index) {
                filesPaths.push(file) ;
            });

            for (let f of filesPaths) {
                const media = MessageMedia.fromFilePath(`./media/insta/${f}`)
                msg.reply(media) ;
            }
        }
    });
}

function startSpam(msg, num, text) {
    for (let i = 0; i < num; i++) {
        client.sendMessage(msg.from, text) ;
    }
}


client.initialize();


