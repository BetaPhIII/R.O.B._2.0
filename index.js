// Discord API and ChatGPT API key initializations
const Discord = require('discord.js');
const { prefix, token, API_Token} = require('./config.json')
const client = new Discord.Client({ intents: ["GUILD_MESSAGES", "DIRECT_MESSAGES"] });
const axios = require('axios');
const apiKey = API_Token;
const aiClient = axios.create({headers: { 'Authorization': 'Bearer ' + apiKey }});


// wait function for millisecond delay
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// when client ready => output Ready
client.on('ready', () => {
	console.log('Ready!')
  // on ready => set bot status to "on the Virtual Boy"
  client.user.setActivity("on the Virtual Boy")
})

client.on('message', message => {
  //logs messages sent from user when message starts with prefix
  if(message.content.startsWith(`${prefix}`)) {
    console.log(message.content);
    //create variable to store message content for current iteration
    userResponse = message.content;
  }
  
  //check message content for info command
	if(message.content.startsWith(`${prefix}info`)){
    message.channel.send("Currently you can use the **!info**, **!cool**, **!reminder *(remindMinutes)***, **!ai *(complete sentence)***, and **!echo** commands")
	}
  // simple output for user input !cool
  else if(message.content.startsWith(`${prefix}cool`)){
    message.channel.send("I am very cool")
  }
  // echo user input
  else if(message.content.startsWith(`${prefix}echo`)){
    userResponse = userResponse.replace('!echo', '')
    message.channel.send(userResponse)
  }
  // remind in set amount of minutes
  else if(message.content.startsWith(`${prefix}remind`)) {
    let remindTimeStr = userResponse.replace('!remind ', '')
    let remindTime = Number(remindTimeStr)
    // call wait function for inputted amount of minutes
    message.channel.send("Reminding you in " + remindTimeStr + " minutes.")
    async function remind() {
      await wait(remindTime*1000*60); // Wait for userIn minute(s)
      //message user after countdown completed
      message.channel.send("Reminder!")
    }
    remind();
  }
  // if message starts with ai =>
  else if(message.content.startsWith(`${prefix}ai`)){
    userResponse = userResponse.replace('!ai','')

    //max tokens for generated response
    params = {
      "prompt": userResponse, 
      "max_tokens": 10
    }
    // call ChatGPT API davinci_v1
    aiClient.post('https://api.openai.com/v1/engines/davinci/completions', params)
      .then(result => {
        // output AI prediction
        message.channel.send(params.prompt + result.data.choices[0].text);
    }).catch(err => {
        message.channel.send("error try again");
      console.log(err);
    });
  }
})

client.login(token);