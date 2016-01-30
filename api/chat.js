var nodemailer = require('nodemailer');
var faker = require('faker');

function ChatAPI () {
  "use strict";

  var smtpSettings = "smtps://" + process.env.smtp_email + ":" + process.env.smtp_pass + "@smtp.gmail.com";
  var transporter = nodemailer.createTransport(smtpSettings);//'smtps://squashleaguemailer@gmail.com:squashleaguemailer123!@smtp.gmail.com');

  this.Invite = function(req, res){

    var invitees= "";
    for(var i = 0; i < req.body.invitees.length; i++){
      invitees = invitees + req.body.invitees[i] + ",";
    }
    invitees = invitees + req.body.invitee;

    var chatId = faker.random.uuid();
    var hostname = req.headers.host;
    var passkey = faker.internet.password();
    var chatUrl = hostname + "/#/chat/" + chatId; //+ "?key=" + passkey;
    var easyUrl = hostname + "/#/chat/" + chatId + "?key=" + passkey;
    var emailMessage = "Hello, You've been invited for a chat by " + req.body.inviter;
    emailMessage = emailMessage + ". Click <a href='http://" + chatUrl + "'>here</a> to join the chat. Your passkey is: " + passkey 
    emailMessage = emailMessage + "<br/> Alternatively, click <a href='http://" + easyUrl + "'>here</a> for easy log in. (less secure)";

    // Sends email to inviter and invitees
    var mailOptions = {
        from: 'SecureChat, squashleaguemailer@gmail.com', // sender address
        to: invitees, // list of receivers
        subject: 'Secure Chat - Invitation for Chat', // Subject line
        //text: '', //"Hello, You've been invited for a chat by " + req.body.invitee + ". Click here to join the chat.",
        html: emailMessage,
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.status(500).send(error);
            return;
        }
        console.log('Message sent: ' + JSON.stringify(info));
        res.status(200).send({chatUrl : chatUrl});
    });
  };
  function executeQuery(fn){
    r.connect(connectionInfo, fn);
  };
};

module.exports.ChatAPI = ChatAPI;