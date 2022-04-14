from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy



# from flask_migrate import Migrate
from utils.db import db

from configs import *
from utils.ErrorHandler import ErrorHandler
import telebot

bot = telebot.TeleBot(BOT_TOKEN, parse_mode=None)


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + SQL_USERNAME + ':' + SQL_PASSWORD + '@' + SQL_HOSTNAME + ':' + SQL_SERVER_PORT + '/' + SQL_DB_NAME
db[0] = SQLAlchemy(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

from utils.DBHandler import DBHandler
db = db[0]

#global set for the logged in admins
loggedIn_admins = set()

#polls ids dict
# polls_ids = dict()


@app.errorhandler(400)
@app.errorhandler(401)
@app.errorhandler(403)
@app.errorhandler(404)
@app.errorhandler(409)
@app.errorhandler(500)
@app.errorhandler(501)
def page_not_found(e):
    return ErrorHandler.handle(error_code=e.code, url=request.path), e.code


# ------------------ admin actions ----------- #

def is_loggedIn(username , password):

    res = DBHandler.is_admin(username,password)
    if res == False:
        #not an admin
        return False

    if username not in loggedIn_admins:
        #not active admin
        return False
    return True


@app.route('/login', methods=['POST'])
def login():
    admin_username = request.json.get('username')
    admin_pass = request.json.get('password')
    if admin_username is None or admin_pass is None:
        #unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    res = DBHandler.is_admin(admin_username, admin_pass)
    if not res:
        #not an admin (forbidden)
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    loggedIn_admins.add(admin_username)
    admin = DBHandler.get_admin(admin_username)
    admin_json = {'admin': {'username': admin.username, 'email': admin.email, 'phoneNumber': admin.phone_number}}
    return admin_json, '200'
    # return redirect(url_for(admin + '/home'))


@app.route('/signup', methods=['POST'])
def signup():
    # print(request.data)
    # print(request.form)
    # print(request.form['username'])
    # print(request.form.keys())

    admin_username = request.json.get('username')
    if admin_username is None:
        #unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        #forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return ErrorHandler.handle(error_code=403, url=request.path), '403'

    new_admin: dict = request.json.get('new_admin')

    if new_admin is None:
        #bad request
        return ErrorHandler.handle(error_code=400, url=request.path), '400'

    # print(request.form)

    if not {'username', 'password', 'email', 'phoneNumber'} & set(new_admin.keys()):
        #bad request
        return ErrorHandler.handle(error_code=400, url=request.path), '400'

    # adminid = request.form['id']
    username = new_admin['username']
    password = new_admin['password']
    email = new_admin['email']
    phone_number = new_admin['phoneNumber']
    try:
        DBHandler.register_admin(username, password, email, phone_number)
    except ValueError as err:
        return err.args[0], '403'

    return 'signed up successfully', '200'


@app.route('/logout', methods=['POST'])
def logout():
    admin_username = request.json.get('username')
    if admin_username is None:
        # unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        #forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return 'You are not logged in', '403'

    loggedIn_admins.remove(admin_username)
    return 'signed out', '200'


# get all the admins as dict (key is admin.id values are email and number)
@app.route('/allAdmins', methods=['POST'])
def get_all_admins():
    admin_username = request.json.get('username')
    if admin_username is None:
        # unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        # forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return 'You are not logged in', '403'

    admins_usernames = DBHandler.get_column_values(DBHandler.Admin.username)
    admins = []
    for u in admins_usernames:
        admin = DBHandler.get_admin(u)
        admins.append({'username': admin.username, 'email': admin.email, 'phoneNumber': admin.phone_number})
    # print(admins)
    return {'admins': admins}, '200'

# --------- polls actions --------------------- #


@app.route('/adminPollsResults', methods=['POST'])
def get_admin_results():
    admin_username = request.json.get('username')
    if admin_username is None:
        # unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        # forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return 'You are not logged in', '403'
    admin = DBHandler.get_admin(admin_username)
    return DBHandler.get_admin_polls_results(admin.id), '200'


@app.route('/getAllPollsResults', methods=['POST'])
def get_all_results():
    admin_username = request.json.get('username')
    if admin_username is None:
        # unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        # forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return 'You are not logged in', '403'

    return DBHandler.get_all_polls_results(), '200'


@app.route('/getAllPolls', methods=['POST'])
def get_all_polls():
    admin_username = request.json.get('username')
    if admin_username is None:
        # unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        #forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return 'You are not logged in', '403'
    all_polls = DBHandler.get_all_polls()

    return {'polls': all_polls}, '200'


@app.route('/getPolls', methods=['POST'])
def get_polls():
    admin_username = request.json.get('username')
    if admin_username is None:
        # unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        #forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return 'You are not logged in', '403'
    admin = DBHandler.get_admin(admin_username)
    return DBHandler.getAdminPolls(admin.id), '200'


@app.route('/poll', methods=['POST'])
def add_poll():

    admin_username = request.json.get('username')
    if admin_username is None:
        # unauthorized
        return ErrorHandler.handle(error_code=401, url=request.path), '401'

    if admin_username not in loggedIn_admins:
        # forbidden not a logged in admin or not admin at all
        # return 'not logged in' , 403
        return 'You are not logged in', '403'

    admin = DBHandler.get_admin(admin_username)

    # new_poll: title , description , options , polls
    new_poll: dict = request.json.get('new_poll')

    if new_poll is None:
        #bad request
        return ErrorHandler.handle(error_code=400, url=request.path), '400'

    if not {'title', 'description', 'options', 'participants'} & set(new_poll.keys()):
        #bad request
        return ErrorHandler.handle(error_code=400, url=request.path), '400'

    users_to_send = set()
    if len(new_poll['participants']) == 0:
        print('broadcast poll..')
        users_to_send = DBHandler.get_column_values(DBHandler.User.id)
    else:
        for p in new_poll['participants']:
            pollId = p['pollID']
            option = p['option']

            usersIds = DBHandler.getRequiredUsers(pollId,option)
            users_to_send.update(usersIds)

    adminId = admin.id
    title = new_poll['title']
    description = new_poll['description']
    options = new_poll['options']

    try:
      poll_id = DBHandler.add_poll(title,description,adminId)
    except ValueError as e:
        print(e.args[0])
        return e.args[0], '403'
    for o in options:
        DBHandler.add_poll_options(poll_id, o.strip())

    sendPoll(title, description, options, users_to_send, poll_id)

    return 'Poll sent successfully', '200'


def sendPoll(title, description, options, users, poll_id):

    text = title
    for u in users:
        bot.send_message(chat_id=u, text=text)
        res = bot.send_poll(chat_id=u, question=description, options=options, is_anonymous=False)
        # polls_ids[poll_id] = res.poll.id

        bot_poll_id = res.poll.id
        DBHandler.add_poll_mapping(bot_poll_id, poll_id)
    return


@app.route('/poll/answers')
def handle_answer():

    botpollId = request.form['pollId']
    userId = request.form['userId']
    ans = request.form['ans']
    answer = int(ans)

    DBHandler.register_answer(botpollId , userId , answer)
    return 'answer registered' , '200'

# ------------ user actions --------------------#


@app.route('/register/username=<username>&chat_id=<chat_id>')
def register_username(username, chat_id):
    try:
        DBHandler.register_user(chat_id, username)
    except ValueError as e:
        return e.args[0]
    return 'The username ' + username + ' has been registered successfully!'


@app.route('/unregister/username=<username>&chat_id=<chat_id>')
def unregister_username(username, chat_id):
    try:
        DBHandler.unregister_user(chat_id, username)
    except ValueError as e:
        return e.args[0]
    return 'The username ' + username + ' has been removed successfully from the system.'


@app.before_first_request
def create_db_tables():
    db.create_all()
    if DBHandler.is_admin(INITIAL_ADMIN_USERNAME,INITIAL_ADMIN_PASSWORD):
        return

    try:
        DBHandler.register_admin(INITIAL_ADMIN_USERNAME,   INITIAL_ADMIN_PASSWORD,
                                 INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PHONE)
    except ValueError as e:
        print(e.args[0])
        return

    print('Setup admin added sccessfully')
    return


def run_server():
    app.run(host=SERVER_HOST, port=SERVER_PORT, debug=True)


if __name__ == "__main__":
    run_server()
