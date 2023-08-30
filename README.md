# friend-tech-monitor
Send discord webhook when specific twitter users sign up to friend tech. The webhook will contain their twitter username and wallet address


To run monitor a discord webhook, and friend tech jwt token needs to be entered within the index.js 

to add a user to the monitor a post request needs to be sent to /addUsername with the twitter username while the monitor is running for each user desire to add. 

Once a specific user signs up a discord webhook will be sent and they will be remove from the list of monitored users


for further info on friend tech api, and how to attain a jwt token refer to this repo https://github.com/kopy-kat/friend-tech-api
