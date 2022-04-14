# ShrekksBot - Telegram Bot
Shrekksbot is a Telegram Polls Manager web application.  

# About
The app includes a Telegram bot interface for user registration and poll
answering.  
Admins define polls questions and submit them for the users.  
The system's users will get poll questions through the Telegram bot and
respond with their votes. Polls can reach everyone or a subset of relevant
users.  
The web page interface is used for admins registration, charts and
statistics display, and polls broadcasting to users through Telegram.
  
# Setup & Installation
In order to run the bot and the web application you must first set up the environment:  
  
## Database
- Set up a local or cloud PostgreSQL server following the guides in the official website.  
- Configure the *config.py* configuration file, found in the root directory, with the right database server details.  
  
## Telegram Bot
Create a Telegram bot:
- Go to the [BotFather](https://core.telegram.org/bots#6-botfather) on Telegram.
- Create a new bot: /newbot
- Give it a name.
- Give it a username (must end with the word bot)
- Copy the authentication token you receive from BotFather
- Edit the BOT_TOKEN parameter in the *config.py* with the token you got

## REACT
Create a react environment (using npm) using the *package.json* configurations.

# Run
run the project using the *run_project.py* script

