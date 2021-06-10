const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
let {PythonShell} = require('python-shell')
const readline = require('readline');
const request = require('request');
const xf = require('xfetch-js');
const sagiri = require('sagiri');
// const { range } = require('lodash');
// const { addConsoleHandler } = require('selenium-webdriver/lib/logging');





const SESSION_FILE_PATH = './session.json';

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// remove when uploade to github
const dirtyWords = []
const blackList = {}
const oriaList = []

let batteryInfo ;

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

😂 $joke : 
send it and the bot will reply with a random joke

🙋🏻 $ask :
send it with a question provided in a new line and the bot will answer you

🇯🇵 $anime : 
send it with anime image or mention anime image with and the bot will repy with information
about that image

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
    // remove when uploade to github
    getBlackList()
    getDirtyWords() 
    getOriaList()
    console.log('Bot is ready!');
});


async function enteractWithMessage(msg) {

    if (msg.body == '$hi'  && messageFromBoss(msg)) {
        msg.reply("yes sir !") ;
        




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




    } else if (msg.body == "$love") {
        sendMediaFileToMSG(msg, "love1.mp3")




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
                console.log(err)
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



    } else if (msg.body.startsWith("$addTo BlackList") && messageFromBoss(msg)) {
        addToBlackList(msg, msg.body.split("\n")[1])
    
    
    
    
    
    
    } else if (msg.body == "$oria" && messageFromBoss(msg)) {
        addToOriaList(msg)



    }else if (msg.body == "$meme")  {
        randomMeme(msg)




    } else if (msg.body == "$joke") {
        randomJoke(msg)
    
    
    
    } else if (msg.body.startsWith("$ask")) {
        ai(msg)
    
    
    
    
    
    } else  if (msg.body == "$anime") {
        saucenaoAPI(msg)
    
    
    
    
    
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

async function checkOria(msg) {
    const contact = await msg.getContact()
    console.log(oriaList)
    if (oriaList.includes(contact.number)) {
        msg.reply("oria 😂 👆🏻")
        
    }
}


async function addToOriaList(msg) {

    const qm = await msg.getQuotedMessage()
    const contact = await qm.getContact()
    fs.appendFile("oriaList.txt", `${contact.number}\n`, function(err) {
        if (err) {
            msg.reply(`error : \n ${err}`)
        } else {
            msg.reply(`added to oria list successfully`)
            getOriaList()
        }
    }) ;

}


function getOriaList() {
    const readInterface = readline.createInterface({
        input: fs.createReadStream('oriaList.txt'),
        console: false 
    });

    readInterface.on("line", function(line) {
        oriaList.push(line)
    }) ;
}


async function saucenaoAPI(msg) {

    // const sagiri = require('sagiri'); 
    const apiKey = "b94b2c183e71903683209c37356cb60b7fa06739"

    const saucenao = sagiri(apiKey);


    const media = await msg.downloadMedia()

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

function ai(msg) {

    const chat = msg.body.split("\n")
    console.log(chat)
    const mssg = chat[1]

    const options = {
        method: 'GET',
        url: 'https://api.pgamerx.com/v3/ai/response',
        qs: {message: mssg, type: "stable"},
        headers: {
            'x-api-key' : "9HXmSweBcXt2",
            'x-rapidapi-key': '768fea5b8dmsh0a5e52ef9cad9b9p136ac9jsna51d4e5a32b8',
            'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
            useQueryString: true
        }
      };
      
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
          const json = JSON.parse(body)
          console.log(json)
          const res = json[0]
          msg.reply(`${res["message"]}`)
          console.log(body);
      });

}

function randomJoke(msg) {

    const options = {
        method: 'GET',
        url: 'https://random-stuff-api.p.rapidapi.com/joke/any',
        qs: {api_key: "9HXmSweBcXt2"},
        headers: {
          'x-rapidapi-key': '768fea5b8dmsh0a5e52ef9cad9b9p136ac9jsna51d4e5a32b8',
          'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
          useQueryString: true
        }
      };
      
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
          const json = JSON.parse(body)
          const flags =  json["flags"]
          if (flags["nsfw"] == true || flags["religious"] == true || flags["sexist"] == true) {
              randomJoke(msg)
              return
          }
          console.log(json)
          if (json["type"] == "single") {
              msg.reply(json["joke"])
          } else {
            msg.reply(json["setup"] + "\n" + json["delivery"])
          }
      });

}

function randomMeme(msg) {

    const options = {
        method: 'GET',
        url: 'https://random-stuff-api.p.rapidapi.com/image/dankmemes',
        qs: {api_key: "9HXmSweBcXt2"},
        headers: {
          'x-rapidapi-key': '768fea5b8dmsh0a5e52ef9cad9b9p136ac9jsna51d4e5a32b8',
          'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
          useQueryString: true
        }
      };
      
      request(options, function (error, response, body) {
            if (error) throw new Error(error);
      
            const json = JSON.parse(body)
            console.log(json)

            let extenstion = json[0].split(".")
            extenstion = extenstion[extenstion.length - 1]

        //   const file = fs.createWriteStream()
            const stream = request(json[0]).pipe(fs.createWriteStream(`meme.${extenstion}`))
            stream.on('finish', function () {
                const media = MessageMedia.fromFilePath(`meme.${extenstion}`)
                msg.reply(media)
             });
            
      });

}


async function check(msg) {
    const group = await msg.getChat()
    const contact = await msg.getContact()
    console.log(blackList)
    const keys = Object.keys(blackList)
    for (let i = 0; i < keys.length; i++) {
        console.log(blackList[keys[i]])
        if (keys[i] == contact.number) {
            blackList[keys[i]] -= 1 ;
            if (blackList[keys[i]] == 0) {
                await kick(group, contact)
            }
            if (blackList[keys[i]] == 1) {
                msg.reply("one more message and you will be kicked out")
            }
        }
    }
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

    if (msg.id["_serialized"].includes("509587069") || msg.id["_serialized"].includes("888-3314")) {
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


// async function dealWithUnreadedMesseages() {

//     const chats = await client.getChats()

//     let count = 1 

//     chats.forEach(function(chat) {
        
//         const unreadCount = chat.unreadCount 
//         const msgs = await group.fetchMessages({limit: unreadCount})

//         msgs.forEach(function(msg) {
//             enteractWithMessage(msg)
//         })

//     })

// }


client.initialize();

