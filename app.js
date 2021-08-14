const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
let {PythonShell} = require('python-shell')
const readline = require('readline');
const request = require('request');
const xf = require('xfetch-js');
const sagiri = require('sagiri');
const {Builder, By, Key, until} = require('selenium-webdriver');
require('dotenv').config({path:'environmentVariables.env'})
const fetch = require('node-fetch') ;


const SESSION_FILE_PATH = './session.json';

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// remove when uploade to github
let responses = []
const dirtyWords = []
const kfoMsg = "كفوك الطيب الي على طيب رباك يامحزمي اليمين الي مايعري ياعصبه الراس وقت الليالي المعاسير انشهد انك محزم ظفر وقت الشدايد يالمحزم المليان السنافي الوافي الطحطوح كايد أبو الظفرات عطيب الضرايب حامي الممالك السبع والوريث الشرعي غيهب المدات ساس القوم المحزم المليان الصنديد راعي الفزعات طلق المحيا راس القوم راعي الاوله طير شلوى سليل المجد والامجاد";

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

📺   $yt : 
mention this command on youtube video link
or send the link in a following line to download video (please wait as it takes some time)

🤔    $choose:
send it with  items provided in every single line
to choose randomly 

🇯🇵 $anime : 
send it with anime image or mention anime image with it and the bot will reply with information
about that image

🏡     $help :
to get this list

` ;

const client = new Client({
    puppeteer: {
        executablePath: process.env.ChromePath,
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
    getDirtyWords() 
    readResponse()  
    console.log('Bot is ready!');
});


async function enteractWithMessage(msg) {

    if (msg.hasMedia) {
        const media = await msg.downloadMedia() 
        console.log(media.mimetype)
    }
    
    if (msg.body == '$hi') {
        msg.reply("yes sir !") ;
        




    } else if (msg.body.startsWith("$trim") || msg.body.startsWith("$short")) {
        urlTrim(msg)
      
        
        
        
    } else if (msg.body.startsWith("$statics") && messageFromBoss(msg)) {
        authors = {}
        const chat = await msg.getChat()
        const items = msg.body.split("\n") ;
        console.log(items[1]) ;
        calaulateStatics(chat, msg, items[1])


    } else if (msg.body.toLocaleLowerCase().includes("cs")) {
        msg.reply("computer science forever") ;




    } else if (msg.body.toLocaleLowerCase().includes("swe")) {
        msg.reply("computer science is better") ;




    } else if (msg.body.split().includes("كفو")) {
        msg.reply(kfoMsg) ;
    
        
    
    
    } else if (msg.body == "$s") {
        creatSticker(msg) ;





    } else if (msg.body.startsWith("$choose")) {
        choose(msg) ;




    } else if (msg.body == "$help") {
        msg.reply(helpMsg);



    // remove when uploade to github
    } else if (doesContainDirtyWord(msg)) {
        msg.reply("الله يهديك")





    } else if ((msg.body.startsWith("$math")) && messageFromBoss(msg)) {
        msg.reply(doMath(msg.body), msg.from) ;




    } else if (msg.body.startsWith("$insta")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/instaDownloader.py', null, function (err) {
            if (!err) {
                sendInstaVidos(msg) ;
            } else {
                console.log(err)
                msg.reply("عذرا حدث خطا ما")
            }
          });




    } else if (msg.body.startsWith("$twitter")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/twitterDownloader.py', null, function (err) {
            if (err) {
                console.log(err)
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "twitterVideo.mp4")
            }
          });




    } else if (msg.body == "$yt") {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/youtubeDownloader.py', null, function (err) {
            if (err) {
                console.log(err)
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "youtubeVideo.mp4") ;
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



    } else  if (msg.body == "$anime") {
        saucenaoAPI(msg)
    
    
    
    
    
    } else if (msg.body.startsWith("$zajel")) {
        sendZajel(msg)
    
    
    
    } else if (msg.body.startsWith("$re") && messageFromBoss(msg)) {
        createTriggerWordResponse(msg)
    }
    
    
    if (await msgIsVote(msg)) {
        votes.push(msg.body.toUpperCase()) ;
    
    
    
    }

    if (await msgIsVote(msg)) {
        votes.push(msg.body.toUpperCase()) ;
    }

    // check(msg)
    checkOria(msg)
}


client.on('message', async msg => {
    printMSG(msg) ;
    enteractWithMessage(msg) ;
    isResponse(msg);
});


client.on('group_join', async notification => {
    // User has joined or been added to the group.
    console.log('join', notification);

    if (notification.author.startsWith("967")) {
        const group = await notification.getChat()
        const contact = await notification.getContact()
        kick(group, contact)
    } else {
        const media = MessageMedia.fromFilePath(`./media/welcom.jpeg`)
        notification.reply(media, {sendMediaAsSticker: true});
    }

});



// -MARK: Commands Functions 


async function sendZajel(msg) {
    if (!msg.hasQuotedMsg) {
        msg.reply("there is no quoted message to send")
        return
    }
    
    const quotedMsg = await msg.getQuotedMessage() ;
    let number = msg.body.split('\n')[1];
    let message = quotedMsg.body
    // check if string contains specific character    
    if (number.includes("@")) {
        // remove character from string
        number = number.replace(/@/g, '')
    }
    number = `${number}@c.us`;
    client.sendMessage(number, message);
}


async function saucenaoAPI(msg) {
    let media = {}
    if (msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage() ;
        media = await quotedMsg.downloadMedia();
    } else {
        media = await msg.downloadMedia()
    }
    
    const apiKey = "b94b2c183e71903683209c37356cb60b7fa06739"

    const saucenao = sagiri(apiKey);


    fs.writeFile("anime.jpeg", media.data, "base64", async function(err) {
        if (err) {console.log(err)}

        const imageFileStream = fs.createReadStream("anime.jpeg")

        const result = await saucenao(imageFileStream)


        const first = result[0]
        const raw = first["raw"]
        const data = raw["data"]

        console.log(first)

        const similarity = raw["similarity"]
        const imageURL = first["thumbnail"]
        const source = data["ext_urls"]
        const anime = data["source"]
        const episode = data["part"]
        const time = data["est_time"]
        const title = data["title"]
        const authorName = data["author_name"]
        const authorURL = data["author_url"]
        

        const stream = request(imageURL).pipe(fs.createWriteStream(`anime.jpeg`))
        stream.on("finish", function() {
            let info = ``

            if (source) {
                info += `source: ${source} \n`
            }
            if (anime) {
                info += `anime: ${anime} \n`
            } 
            if (episode) {
                info += `episode: ${episode} \n`
            }
            if (time != undefined) {
                info += `title: ${title} \n`
            }
            if (authorName) {
                info += `author name: ${authorName} \n`
            }
            if (authorURL) {
                info += `author url: ${authorURL} \n`
            }

            const media = MessageMedia.fromFilePath("anime.jpeg")

            client.sendMessage(msg.from, media, {caption : info})

        })


    })

}

async function kick(group ,contact) {
    console.log(contact.id)
    const toRemove = [`${contact.id._serialized}`]
    const res = await group.removeParticipants(toRemove)

    console.log(res)
    group.sendMessage(`${contact.pushname} has been kicked`)
}

function getBlackList() {
    const readInterface = readline.createInterface({
        input: fs.createReadStream('BlackList.txt'),
        console: false 
    });

    readInterface.on("line", function(line) {
        blackList[line.split(";")[0]] = parseInt(line.split(";")[1])
    }) ;
}

async function addToBlackList(msg, num) {
    const qm = await msg.getQuotedMessage()
    const contact = await qm.getContact()
    fs.appendFile("BlackList.txt", `${contact.number};${num}\n`, function(err) {
        if (err) {
            msg.reply(`error : \n ${err}`)
        } else {
            msg.reply(`added to blacklist successfully`)
            getBlackList()
        }
    }) ;
}


let authors = {}
let contacts = []
async function calaulateStatics(group, msg, count) {


    if (group.isGroup) {
        console.log("doing the magic")
        const msgs = await group.fetchMessages({limit: count})
        // console.log(msgs)

        let counter = 0 ;

        msgs.forEach(async function (m) {

            const contact = await m.getContact();
            contacts.push(contact) 
            // console.log(contact)
            if (authors[contact.pushname]) {
                authors[contact.pushname] += 1 ;
                // console.log(`count ${authors[contact.pushname]} for ${contact.pushname}`)  
            } else {
                authors[contact.pushname] = 1 ;
                // console.log(`added ${contact.number}`)
            }
            
            counter += 1 ;
            // console.log(counter)
            if (counter == count) {
                sendStaticsMessage(group,count ,msg) ;
            }

        }) ;

    } else {
        console.log("not a group")
        return ;
    }
}

function sendStaticsMessage(chat,count,msg) {
    let staticsMessage = `📊 Statics for last ${count} messages 📊 `

    Object.keys(authors).forEach(function(key) {
        console.log(key)
        staticsMessage += `\n\n@${key}: ${authors[key]} messages`
    });
    
    // chat.sendMessage(staticsMessage, {mentions: contacts}) ;
    console.log(staticsMessage) ;
}

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


async function printMSG(msg) {
    const contact = await msg.getContact()
    console.log(`[${contact.pushname}] \n ${msg.body}`) 
}


function choose(msg) {
    const random = randomLine(msg.body)
    msg.reply(random)
}

// remove before uploding to github
function getDirtyWords() {


    const readInterface = readline.createInterface({
        input: fs.createReadStream('dirtyWords.txt'),
        console: false 
    });

    readInterface.on("line", function(line) {
        dirtyWords.push(line) ;
    }) ;

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
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

function randomLine(s) {
    const items = s.split("\n") ;
    items.shift()
    let ran = Math.floor((Math.random() * items.length)) ;
    return items[ran] ;
}

function doesContainDirtyWord(msg) {
    const text = msg.body.split(" ") ;
    for (index = 0; index < dirtyWords.length; index++) {
        if (text.includes(dirtyWords[index])) {
            return true
        } 
    } 
    return false
}

function doMath(s) {
    const splitted = s.split("\n") ;
    const eq = splitted[1] ;
    const res = eval(eq) ;
    return res.toString() ;
}


async function urlTrim(msg) {  
    console.log("inside function")
    const url = msg.body.split("\n")[1];
    
    const options = {
        method: 'POST',
        url: 'https://utrim.xyz/api/trim',
        headers: {
            'x-api-key' : String(process.env.APIKEY),
        },
        json: {
            "url": url
          }
      };
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
          console.log(body)
          if (body.status === "success") msg.reply(body.data.link)
          else if (body.status === "fail") msg.reply("Unvalid link.")
      });
    
}


// -MARK: Votes Functions

let options = {} ;
let votes = [] ;
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "M", "N", "O", "P"] ;

function calculateVotesAndCreatMessage() {
    const result = {} ;
    console.log(votes)
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

async function createTriggerWordResponse(msg) {
    if (!msg.hasQuotedMsg) {
        msg.reply("you need to mention a message to be a response")
        return
    }
    
    const quotedMsg = await msg.getQuotedMessage() ;
    
    if (quotedMsg.hasMedia) {
        const media = await quotedMsg.downloadMedia() ;
        let extenstion = ""
        
        if (media.mimetype == "image/jpeg") {
            extenstion = "jpg"
        } else if (media.mimetype == "image/png") {
            extenstion = "png"
        } else if (media.mimetype == "video/mp4") {
            extenstion = "mp4"
        } else if (media.mimetype == "audio/ogg; codecs=opus") {
            extenstion = "mp3"
        } else  {
            msg.reply("sorry this media is not supported yet")
            return
        }
        
        const triggerWord = msg.body.split("\n")[1] ;
        
        fs.writeFile(`./responses/${triggerWord}.${extenstion}`, media.data, "base64", async function(err) {
            const response = new Object() ;
            response.triggerWord = triggerWord ;
            response.isMedia = true ;
            response.mediaType = extenstion
            response.response = ""
            responses.push(response) ;
            msg.reply("تمت اضافة الرد")
            saveResponses()
        })
    } else {
        const triggerWord = msg.body.split("\n")[1] ;
        const response = new Object() ;
        response.triggerWord = triggerWord ;
        response.isMedia = false ;
        response.mediaType = ""
        response.response = quotedMsg.body
        responses.push(response) ;
        msg.reply("تمت اضافة الرد")
        saveResponses()
    }
    
}


async function isResponse(msg) {
    console.log(responses)
    responses.forEach(async function (response) {
     console.log("checking")
      if (response.triggerWord == msg.body) {
          if (response.isMedia) {
            const media = MessageMedia.fromFilePath(`./responses/${response.triggerWord}.${response.mediaType}`)
            if (msg.hasQuotedMsg) {
                const qm = await msg.getQuotedMessage()
                qm.reply(media, msg.from)
            } else {
                msg.reply(media, msg.from)
            }
          } else {
            if (msg.hasQuotedMsg) {
                const qm = await msg.getQuotedMessage()
                qm.reply(response.response)
            } else {
                msg.reply(response.response)
            }
          }
      }
    })   
}

async function saveResponses() {
    fs.writeFile("./responses/data.json", JSON.stringify(responses), function(err) {
        console.log("reponses Saved")
    })
}

async function readResponse() {
    fs.readFile('./responses/data.json', (err, data) => {
        if (err) throw err;
        responses = JSON.parse(data);
        console.log(responses);
    });
}
    

client.initialize();

