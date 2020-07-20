var app = require('express')();
var express=require('express')
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config=require('./config')

var sockets;
const puppeteer = require('puppeteer');
var Page; // save the page here for pushing websocket messages recieved
var qrcode = require('qrcode-terminal');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });

  const page = await browser.newPage();
  Page=page



  await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

  console.log("waiting to connect");

  await page.goto('https://web.whatsapp.com', {
    waitUntil: 'networkidle2',
  });
  var scanme = `img[alt='Scan me!'], canvas`;
  await page.waitForSelector('img[alt="Scan me!"], canvas')


  var imageData = await page.evaluate(`document.querySelector("${scanme}").parentElement.getAttribute("data-ref")`);

  qrcode.generate(imageData, { small: true }); //qr code dipsay here


  page
    .on('console', message => {

      if (message.type().substr(0, 3).toUpperCase() === "LOG") {
      
        if (message.text() === "logged in"){
          console.log("LOGGED IN");
          if(sockets!=null)
          sockets.emit('log',{message:"Logged in successfully. The bot will now automatically reply to messages if your about is set to Busy"})

        }
        else if(message.text() === "logout" || message.text()==="phone problem"){
          console.log("some problem has occured "+Date());
          if(sockets!=null)
          sockets.emit('log',{message:'logged out or phone problem'});
          if(message.text()==="logout"){
            if(sockets!=null)
            sockets.emit('logout',{}) 
          }
        }
        
        else {
          imageData = message.text();
          qrcode.generate(imageData, { small: true });
          if(sockets!=null)
          sockets.emit('qrcode',{code:imageData});
        }

      }



    })




  await page.evaluate((config) => {

    var timer;

    timer = setInterval(() => {
      if (document.getElementById('side')) {
        clearInterval(timer);
        console.log("logged in");
        executeOnCompletion()
      }
      else {
        if (document.querySelector(`[data-icon="refresh-large"]`)) {

          document.querySelector(`[data-icon="refresh-large"]`).click();  //refresh the qr code


        }
        else {
          console.log(document.querySelector(`img[alt='Scan me!'], canvas`).parentElement.getAttribute('data-ref'))
        }
      }
    }, 3000)

    

    function autoReply(id){
      if(window.api.list[id.__x_id._serialized]==null){
        window.api.list[id.__x_id._serialized]=Date.now()
        window.api.sendMessage(id,config.message+"   To get yourself a bot like this visit: https://github.com/justinbiebur/whatsappbusy");
      }
      else if(Date.now()>(window.api.list[id.__x_id._serialized]+config.timeout*60000)){
        window.api.list[id.__x_id._serialized]=Date.now()
        window.api.sendMessage(id,config.message+"   To get yourself a bot like this visit: https://github.com/justinbiebur/whatsappbusy");
      }
    }



    function executeOnCompletion() {

      const moduleRaid = function (debug) {
        moduleRaid.mID = Math.random().toString(36).substring(7);
        moduleRaid.mObj = {};
        moduleRaid.cArr = [];
        moduleRaid.mGet = null;

        if (debug) {
          moduleRaid.debug = true;
        } else if (window.mRdebug) {
          moduleRaid.debug = true;
        } else {
          moduleRaid.debug = false;
        }

        moduleRaid.log = function (message) {
          if (moduleRaid.debug) {
            console.warn(`[moduleRaid] ${message}`);
          }
        }

        moduleRaid.args = [
          [[0], [function (e, t, i) {
            mCac = i.c;
            Object.keys(mCac).forEach(function (mod) {
              moduleRaid.mObj[mod] = mCac[mod].exports;
            })
            moduleRaid.cArr = i.m;
            moduleRaid.mGet = i;
          }]],
          [[1e3], {
            [moduleRaid.mID]: function (e, t, i) {
              mCac = i.c;
              Object.keys(mCac).forEach(function (mod) {
                moduleRaid.mObj[mod] = mCac[mod].exports;
              })
              moduleRaid.cArr = i.m;
              moduleRaid.mGet = i;
            }
          }, [[moduleRaid.mID]]]
        ]

        fillModuleArray = function () {
          if (typeof webpackJsonp === 'function') {
            moduleRaid.args.forEach(function (argument, index) {
              try {
                webpackJsonp(...argument);
              }
              catch (err) {
                moduleRaid.log(`moduleRaid.args[${index}] failed: ${err}`);
              }
            })
          }
          else {
            try {
              webpackJsonp.push(moduleRaid.args[1]);
            }
            catch (err) {
              moduleRaid.log(`Pushing moduleRaid.args[1] into webpackJsonp failed: ${err}`);
            }
          }

          if (moduleRaid.mObj.length == 0) {
            mEnd = false;
            mIter = 0;

            if (!webpackJsonp([], [], [mIter])) {
              throw Error('Unknown Webpack structure');
            }

            while (!mEnd) {
              try {
                moduleRaid.mObj[mIter] = webpackJsonp([], [], [mIter]);
                mIter++;
              }
              catch (err) {
                mEnd = true;
              }
            }
          }
        }

        fillModuleArray()

        get = function get(id) {
          return moduleRaid.mObj[id]
        }

        findModule = function findModule(query) {
          results = [];
          modules = Object.keys(moduleRaid.mObj);

          modules.forEach(function (mKey) {
            mod = moduleRaid.mObj[mKey];

            if (typeof mod !== 'undefined') {
              if (typeof query === 'string') {
                if (typeof mod.default === 'object') {
                  for (key in mod.default) {
                    if (key == query) results.push(mod);
                  }
                }

                for (key in mod) {
                  if (key == query) results.push(mod);
                }
              } else if (typeof query === 'function') {
                if (query(mod)) {
                  results.push(mod);
                }
              } else {
                throw new TypeError('findModule can only find via string and function, ' + (typeof query) + ' was passed');
              }

            }
          })

          return results;
        }

        findFunction = function (query) {
          if (moduleRaid.cArr.length == 0) {
            throw Error('No module constructors to search through!');
          }

          results = [];

          if (typeof query === 'string') {
            moduleRaid.cArr.forEach(function (ctor, index) {
              if (ctor.toString().includes(query)) {
                results.push(moduleRaid.mObj[index]);
              }
            })
          } else if (typeof query === 'function') {
            modules = Object.keys(moduleRaid.mObj);

            modules.forEach(function (mKey, index) {
              mod = moduleRaid.mObj[mKey];

              if (query(mod)) {
                results.push(moduleRaid.mObj[index]);
              }
            })
          } else {
            throw new TypeError('findFunction can only find via string and function, ' + (typeof query) + ' was passed');
          }

          return results;
        }

        return {
          modules: moduleRaid.mObj,
          constructors: moduleRaid.cArr,
          findModule: findModule,
          findFunction: findFunction,
          get: moduleRaid.mGet ? moduleRaid.mGet : get
        }
      }

      if (typeof module === 'object' && module.exports) {
        module.exports = moduleRaid;
      } else {
        window.mR = moduleRaid();
      }


      // Module raid finished

      window.Store = window.mR.findModule('Chat')[1].default;

      window.Store.AppState = window.mR.findModule('STREAM')[0].default;
      window.Store.Conn = window.mR.findModule('Conn')[0].default;
      window.Store.CryptoLib = window.mR.findModule('decryptE2EMedia')[0];
      window.Store.Wap = window.mR.findModule('Wap')[0].default;
      window.Store.SendSeen = window.mR.findModule('sendSeen')[0];

      window.Store.SendClear = window.mR.findModule('sendClear')[0];
      window.Store.SendDelete = window.mR.findModule('sendDelete')[0];
      window.Store.genId = window.mR.findModule((module) => module.default && typeof module.default === 'function' && module.default.toString().match(/crypto/))[0].default;
      window.Store.SendMessage = window.mR.findModule('addAndSendMsgToChat')[0];
      window.Store.MsgKey = window.mR.findModule((module) => module.default && module.default.fromString)[0].default;
      window.Store.Invite = window.mR.findModule('sendJoinGroupViaInvite')[0];
      window.Store.OpaqueData = window.mR.findModule('getOrCreateOpaqueDataForPath')[0];
      window.Store.MediaPrep = window.mR.findModule('MediaPrep')[0];
      window.Store.MediaObject = window.mR.findModule('getOrCreateMediaObject')[0];
      window.Store.MediaUpload = window.mR.findModule('uploadMedia')[0];
      window.Store.Cmd = window.mR.findModule('Cmd')[0].default;
      window.Store.MediaTypes = window.mR.findModule('msgToMediaType')[0];
      window.Store.UserConstructor = window.mR.findModule((module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null)[0].default;
      window.Store.Validators = window.mR.findModule('findLinks')[0];
      window.Store.WidFactory = window.mR.findModule('createWid')[0];

      window.Store.getStatus = window.mR.findModule('getStatus')[0].getStatus;

      window.Store.getMyStatus = function () {
        return new Promise(function (resolve, reject) {
          window.Store.getStatus(window.Store.Conn.me).then(status => {
            resolve(status.status);
          }).catch(err => {
            reject(err);
          })
        })
      }

      window.Store.Msg.on('add', (newMessage) => {if(newMessage.__x_chat!=null && newMessage.__x_isNewMsg && !newMessage.__x_id.fromMe && (newMessage.__x_to.user!=="status") && (newMessage.__x_from.server==="c.us")){
        //console.log("new message")
        window.Store.getMyStatus().then(status=>{
          if(status==="BOT" || status==="Busy"){
            autoReply(window.Store.Chat._index[newMessage.__x_from._serialized]);
          }
        })
        
        
      } })  // notify of new messages

      window.api = {};

      window.api.list = {}  //save users who have been replied to. Task: to clear the list after some time
      
    //   window.api.isConnected = function () {
    //     // Phone Disconnected icon appears when phone is disconnected from the tnternet
    //     const isConnected = document.querySelector('*[data-icon="alert-phone"]') == null ? true : false;
    //     return isConnected;
    // };

      window.api.isConnected=function(){
        return window.Store.AppState.__x_state==="CONNECTED"?true:false
      }

    window.api.isLoggedIn = function () {
      // Contact always exists when logged in
      const isLogged = window.Store.Contact && window.Store.Contact.checksum !== undefined;
      return isLogged;
  };
      window.api.getNumberId = async (id) => {

        let result = await window.Store.Wap.queryExist(id);
        if (result.jid === undefined)
          throw 'The number provided is not a registered whatsapp user';
        return result.jid;
      };
      window.api.sendSeen = async (chatId) => {
        let chat = window.Store.Chat.get(chatId);
        if (chat !== undefined) {
          await window.Store.SendSeen.sendSeen(chat, false);
          return true;
        }
        return false;

      };
      window.api.sendMessage = async (chat, content, options = {}) => {
        let attOptions = {};
        if (options.attachment) {
          attOptions = await window.api.processMediaData(options.attachment, options.sendAudioAsVoice);
          content = attOptions.preview;
          delete options.attachment;
        }

        let quotedMsgOptions = {};
        if (options.quotedMessageId) {
          let quotedMessage = window.Store.Msg.get(options.quotedMessageId);
          if (quotedMessage.canReply()) {
            quotedMsgOptions = quotedMessage.msgContextInfo(chat);
          }
          delete options.quotedMessageId;
        }

        if (options.mentionedJidList) {
          options.mentionedJidList = options.mentionedJidList.map(cId => window.Store.Contact.get(cId).id);
        }

        let locationOptions = {};
        if (options.location) {
          locationOptions = {
            type: 'location',
            loc: options.location.description,
            lat: options.location.latitude,
            lng: options.location.longitude
          };
          delete options.location;
        }

        if (options.linkPreview) {
          delete options.linkPreview;
          const link = window.Store.Validators.findLink(content);
          if (link) {
            const preview = await window.Store.Wap.queryLinkPreview(link.url);
            preview.preview = true;
            preview.subtype = 'url';
            options = { ...options, ...preview };
          }
        }

        const newMsgId = new window.Store.MsgKey({
          from: window.Store.Conn.me,
          to: chat.id,
          id: window.Store.genId(),
        });

        const message = {
          ...options,
          id: newMsgId,
          ack: 0,
          body: content,
          from: window.Store.Conn.me,
          to: chat.id,
          local: true,
          self: 'out',
          t: parseInt(new Date().getTime() / 1000),
          isNewMsg: true,
          type: 'chat',
          ...locationOptions,
          ...attOptions,
          ...quotedMsgOptions
        };

        await window.Store.SendMessage.addAndSendMsgToChat(chat, message);
        return window.Store.Msg.get(newMsgId._serialized);
      };


      setInterval(()=>{if(!window.api.isLoggedIn()){
        console.log("logout");
      }
    else if(!window.api.isConnected()){
      console.log("phone problem");
    }},30000)



    }


  },config
  )



})();


app.get('/', function(req, res) {
  
  res.sendFile(__dirname + '/index.html');
});
app.get("/qrcode.js",function(req,res){
  res.sendFile(__dirname + '/qrcode.js');
})
const PORT = process.env.PORT || 3000;
server.listen(PORT);  //may need to change this for heroku
io.on('connection', function(socket) {
  console.log("new connection request")
  sockets=socket;
  
  socket.on('relogin',(data)=>{
    if(Page!=null)  //may need fixes
    Page.evaluate(()=>{
      if(document.querySelector('.S7_rT.FV2Qy')){
      document.querySelector('.S7_rT.FV2Qy').click()  // use here button
      
      }
    })
  })
  sockets.emit('welcome', { message: 'Here you can track your logs' });
});

