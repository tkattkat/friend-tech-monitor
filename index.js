const DISCORD_WEBHOOK_URL = ''; // Replace with your Discord webhook URL
const apiKey = ''   // replace with your api key from friend tech.
const delay = 1000; // 1 second delay between each request
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let usernames = [];

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  headers: { 
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhmYmFhN2VlNWMzNTJiYWI4ZTNjOWFkNGNmNTRmMzI0YTQ0NWM1YmQ3IiwiaWF0IjoxNjkyNzU1NTQxLCJleHAiOjE2OTUzNDc1NDF9.bl9dD-glwzlmJcv58GjQmgWCHFLVfn-SwdnO1QQynwo',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': 'https://www.friend.tech/'
  }
};

async function sendToDiscord(username, address) {
    try {
        const response = await axios.post(DISCORD_WEBHOOK_URL, {
            embeds: [{
                title: "New Signup at Friend Tech",
                color: 0x0099ff,
                fields: [{
                    name: "Username",
                    value: username,
                    inline: false
                }, {
                    name: "Address",
                    value: address,
                    inline: false
                }],
                timestamp: new Date()
            }]
        });
    
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error sending embed:", error);
    }
    
}

async function test(username, index) {
  config.url = `https://prod-api.kosetto.com/search/users?username=${username}`;
  let response = await axios.request(config);
  for (let i = 0; i < response.data.users.length; i++) {
    if (response.data.users[i].twitterUsername === username) {
      console.log(`${response.data.users[i].twitterUsername} has signed up to friend tech`);
      await sendToDiscord(response.data.users[i].twitterUsername, response.data.users[i].address);
      usernames.splice(index, 1); // Remove the username from the array
      return;
    }
  }
}

app.post('/addUsername', (req, res) => {
    const { username } = req.body;
    if (username) {
      usernames.push(username);
      res.status(200).send('Username added successfully.');
    } else {
      res.status(400).send('Username field is required.');
    }
  });
  
  let currentIndex = 0;
  const intervalId = setInterval(() => {
    if (usernames.length === 0) return;
  
    if (currentIndex >= usernames.length) {
      currentIndex = 0;
    }
  
    test(usernames[currentIndex], currentIndex)
      .catch(err => console.error(`An error occurred: ${err}`));
  
    currentIndex++;
  }, delay);
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });