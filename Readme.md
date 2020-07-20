

# Whatsapp bot for busy people

 


> A simple Nodejs BOT which replies to messages automatically when you're busy.

## Description

This bot will automatically reply to your whatapp contacts when they message you and you're busy. It does this when your "About" is set to "Busy".



## How to start the BOT?

### 🚀STEPS

Clone the repository and if you have docker installed, then build the image


Run the command - 
```
docker build -t busy .
```
Then,
```
docker run --env PORT=4500 -p 5000:4500 busy
```
> You will find the dashboard at localhost:5000

<br>

**If you don't have docker installed, then simply clone this repository and open a terminal and enter,**

<br>

```
npm install
```
```
npm start
```
>You will find the dashboard at localhost:3000

### Configurations 

Basic configuration is in config.json file like the reply message and the duration after which messages by the same person will be replied to again (defaults to 3 minutes). You can add/remove yours if you need. Keep in mind that you need to restart the bot to see the effects of your changes. Make sure the JSON is valid. 

### config.json 

**message**

The message to reply with.

**timeout**

The time interval t in minutes between two messages after which the bot will reply to the same person again.
 For example, if a message is recieved from A at 23:04, then the bot will automatically reply with the set message. Again if the same person messages after time t and the bot is active, the bot will reply again.

## Usage


* Open up the dashboard and scan the QR Code as you would normally with Whatsapp Web.


![Alt text](images/qrcode.png?raw=true "QRcode")
 

 * A successful Login will be followed by an update in the dashboard.

 ![Alt text](images/login.png?raw=true "Login")

* If phone is disconnected or Whatsapp Web is opened by the user, the bot will stop working and a message will be displayed in the dashboard with an option to relogin 

.
![Alt text](images/logout.png?raw=true "Logout")

## 💻 Technologies
* [Node](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)




## Goals
Features I wanted the bot to have:

* 🚀 Fast
* 👍 Friendly UX
* 💰 Free! for personal use
* 🙏 Not mess with general whatsapp operation


## Future 
* Improving the  Dashboard UI .
* I would like to add some sort of security to the WS connection between the server and client, so that the bot can be run on cloud without any worries.


* Also, I would love to add new features. If you have any idea, let me know ;)

## How I use it

I have set my custom message in config and deployed the application in a cloud containerized environment (checkout Heroku).
So whenever I'm busy my bot is handling all the messages. The only catch is that my phone needs to be connected to the internet while I'm busy.

## What this bot does not do

* Reply to group messages
* Does not take into consideration Whatsapp Calls
* Authenticate requests to the dashboard. (See #Future)

## 📃 Legal
This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by WhatsApp or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk. **Commercial use of this code/repo is strictly prohibited.**

## 👋 Contact Me 👋
[1]: https://www.twitter.com/thisisdebjyoti
[1.1]: https://img.icons8.com/fluent/48/000000/twitter.png (Deb)

[![Deb][1.1]][1] &nbsp; &nbsp; &nbsp; &nbsp; [![Deb][2.2]][2]

[2]:https://mail.google.com/mail/u/0/?view=cm&fs=1&to=db.debjyotibanerjee@gmail.com&tf=1
[2.2]:https://img.icons8.com/fluent/48/000000/gmail.png (Mail)


