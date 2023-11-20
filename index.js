const Discord = require('discord.js');
const { prefix, token, API_Token} = require('./config.json')
const client = new Discord.Client({ intents: ["GUILD_MESSAGES", "DIRECT_MESSAGES"] });
const axios = require('axios');
const apiKey = API_Token;
const aiClient = axios.create({headers: { 'Authorization': 'Bearer ' + apiKey }});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

client.on('ready', () => {
	console.log('Ready!')
  client.user.setActivity("on the Virtual Boy")
})

client.on('message', message => {
  
  console.log(message.content);
  userResponse = message.content;

	if(message.content.startsWith(`${prefix}info`)){
    message.channel.send("Currently you can use the **!info**, **!cool**, **!reminder *(remindMinutes)***, **ai *(complete sentence)***, and **!echo** commands")
	}
  else if(message.content.startsWith(`${prefix}cool`)){
    message.channel.send("I am very cool")
  }
  else if(message.content.startsWith(`${prefix}echo`)){
    userResponse = userResponse.replace('!echo', '')
    message.channel.send(userResponse)
  }
  else if(message.content.startsWith(`${prefix}remind`)) {
    let remindTimeStr = userResponse.replace('!remind ', '')
    let remindTime = Number(remindTimeStr)
    message.channel.send("Reminding you in " + remindTimeStr + " minutes.")
    async function remind() {
      await wait(remindTime*1000*60); // Wait for userIn minute(s)
      message.channel.send("Reminder!")
    }
    remind();
  }
  else if(message.content.startsWith(`${prefix}ai`)){
    userResponse = userResponse.replace('!ai','')

    params = {
      "prompt": userResponse, 
      "max_tokens": 10
    }
    
    aiClient.post('https://api.openai.com/v1/engines/davinci/completions', params)
      .then(result => {
        message.channel.send(params.prompt + result.data.choices[0].text);
    }).catch(err => {
        message.channel.send("error try again");
      console.log(err);
    });
  }
})


// client.on('ready', () => {
    // Set bot status to: "Playing with JavaScript"
    

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
// })


client.login(token);