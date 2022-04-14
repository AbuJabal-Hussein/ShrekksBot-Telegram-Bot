
import requests
import logging
from configs import *

from telegram import (
    Poll,
    ParseMode,
    KeyboardButton,
    KeyboardButtonPollType,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    Update,
)
from telegram.ext import (
    Updater,
    CommandHandler,
    PollAnswerHandler,
    PollHandler,
    MessageHandler,
    Filters,
    CallbackContext,
)

# from telegram.ext import Updater, CommandHandler

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)


class Shrekssbot:


    # Define a few command handlers. These usually take the two arguments update and
    # context. Error handlers also receive the raised TelegramError object in error.
    @staticmethod
    def start(update , context):
        """Send a message when the command /start is issued."""
        opening_message = "/register <user-name>- Register to start answering polls via telegram " \
                    "<user-name> in smart polling system." + "\n\n" + \
                    "/remove <user-name>- To stop getting polls queries <user-name> in smart polling system." \
                    + "\n\n" + "/start - Use start anytime to see this menu again."

        update.message.reply_text("Hello!")
        update.message.reply_text("Welcome to smart polling.\nPlease choose one of the options:")
        update.message.reply_text(opening_message)

    @staticmethod
    def add(update, context):
        if len(context.args) == 0:
            update.message.reply_text('Please enter a username to register!')
            return

        if len(context.args) > 1:
            update.message.reply_text('The username must not contain spaces!')
            return
        username = context.args[0]

        chat_id = update.message.chat.id
        url = 'http://{}:{}/register/username='.format(SERVER_HOST, SERVER_PORT) + username + '&chat_id=' + str(chat_id)
        response = requests.get(url)

        update.message.reply_text(response.text)

    @staticmethod
    def remove(update, context):
        if len(context.args) == 0:
            update.message.reply_text('Please enter a username to remove!')
            return

        if len(context.args) > 1:
            update.message.reply_text('The username must not contain spaces!')
            return
        username = context.args[0]
        chat_id = update.message.chat.id

        url = 'http://{}:{}/unregister/username='.format(SERVER_HOST, SERVER_PORT) + username + '&chat_id=' + str(chat_id)
        response = requests.get(url)
        update.message.reply_text(response.text)
    #


    @staticmethod
    def error(update, context):
        """Log Errors caused by Updates."""
        logger.warning('Update "%s" caused error "%s"', update, context.error)


def poll_answer(update, context):

    """Summarize a users poll vote"""
    answer = update.poll_answer
    poll_id = answer.poll_id
    user_id = answer.user['id']
    option = answer.option_ids[0]
    # questions = context.bot_data[poll_id]["questions"]
    # print(answer['options'])

    url = 'http://{}:{}/poll/answers'.format(SERVER_HOST, SERVER_PORT)

    data = {"pollId": poll_id , "userId": user_id , "ans": option}
    #
    # update.message.reply_text(response.text)
    requests.request(method='get', url=url, data=data)


    return


def main():
    """Start the bot."""
    # Create the Updater and pass it your bot's token.
    # Make sure to set use_context=True to use the new context based callbacks
    # Post version 12 this will no longer be necessary
    updater = Updater(BOT_TOKEN, use_context=True)

    # Get the dispatcher to register handlers
    dp = updater.dispatcher

    # on different commands - answer in Telegram
    dp.add_handler(CommandHandler("start", Shrekssbot.start))
    dp.add_handler(CommandHandler("register", Shrekssbot.add, pass_args=True))
    dp.add_handler(CommandHandler("remove", Shrekssbot.remove, pass_args=True))

    dp.add_handler(PollAnswerHandler(poll_answer))


    # log all errors
    dp.add_error_handler(Shrekssbot.error)


    # Start the Bot
    updater.start_polling()

    # Run the bot until you press Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT. This should be used most of the time, since
    # start_polling() is non-blocking and will stop the bot gracefully.
    updater.idle()


if __name__ == '__main__':
    main()
