import psycopg2
import sqlalchemy
from sqlalchemy import func
# from flask_login import UserMixin
from werkzeug.security import generate_password_hash , check_password_hash
from utils.db import db
db = db[0]

#5055260315

class DBHandler:

    #------------------------------ data base classes ------------------ #

    class User(db.Model):
        __tablename__ = 'Users'

        id = db.Column(db.BigInteger, primary_key=True)
        username = db.Column(db.String(), unique=True, nullable=False)

        def __repr__(self):
            return f"<User {self.username}>"


    class Admin(db.Model):
        __tablename__ = 'Admins'

        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(),unique=True, nullable=False)
        password_hash = db.Column(db.String(), nullable=False)
        email = db.Column(db.String(),unique= True , nullable= False)
        phone_number = db.Column(db.String() , unique=True  , nullable=False)

        def __repr__(self):
            return f"<Admin {self.username}>"

    class Polls(db.Model):
        __tablename__ = 'Polls'

        id = db.Column(db.Integer, primary_key=True)
        poll_title = db.Column(db.String(), nullable=False)
        description = db.Column(db.String(), nullable=False)
        adminID = db.Column(db.Integer, db.ForeignKey('Admins.id', ondelete="CASCADE"), nullable=False)

        Admins = db.relationship('Admin', backref=db.backref('admins', passive_deletes=True))

        def __repr__(self):
            return f"<Poll {self.id}>"

    class Polls_Options(db.Model):

        __tablename__ = 'Polls_Options'


        required_id = db.Column(db.Integer, primary_key=True)
        poll_id = db.Column(db.Integer, db.ForeignKey('Polls.id',ondelete="cascade") ,nullable=False)
        poll_option = db.Column(db.String(), nullable=False)

        polls = db.relationship('Polls',backref=db.backref('polls', passive_deletes=True))

    class Polls_ids(db.Model):

        __tablename__ = 'Polls_IDS'

        botPollId = db.Column(db.String(), primary_key=True)
        poll_id = db.Column(db.Integer, db.ForeignKey('Polls.id', ondelete="cascade"), nullable=False)

        relation_polls = db.relationship('Polls', backref=db.backref('relation_polls', passive_deletes=True))

        def __repr__(self):
            return f"<Option {self.poll_id}>"
    # #

    class Polls_Results(db.Model):

        __tablename__ = 'Polls_Results'


        required_key = db.Column(db.Integer, primary_key=True)

        poll_id = db.Column(db.Integer, db.ForeignKey('Polls.id',ondelete="cascade") ,nullable=False)
        polls = db.relationship('Polls',backref=db.backref('results', passive_deletes=True))

        # poll_option doest need to be fk becuase option isnt a unique thing, poll_id as fk enouph to do the job
        poll_option = db.Column(db.String(), nullable=False)

        user_id = db.Column(db.BigInteger, db.ForeignKey('Users.id',ondelete="cascade") ,nullable=False)
        users = db.relationship('User',backref=db.backref('users', passive_deletes=True))


        def __repr__(self):
            return f"<Result {self.user_id}>"

# -------------- users methods --------------- #

    @staticmethod
    def getUserByName(username):
        user = DBHandler.User.query.filter_by(username=username).first()
        return user


    @staticmethod
    def register_user(userid, username):
        user = DBHandler.User(id=userid, username=username)
        db.session.add(user)
        try:
            db.session.commit()
        except psycopg2.errors.UniqueViolation:
            # the user already exists: the userid or the username already in use
            raise ValueError('The username' + username + ' is already in use!')
        except sqlalchemy.exc.IntegrityError:
            raise ValueError('The current user is already registered!')
        finally:
            db.session.close()


    @staticmethod
    def unregister_user(userid, username):
        user_query = DBHandler.User.query.filter_by(id=userid)
        user = DBHandler.User.query.filter_by(id=userid).first()
        if user is None:
            # user does not exist
            raise ValueError('You are not registered!')

        if user.username == username:
            user_query.delete()
            db.session.commit()
            db.session.close()
            return
        # the username does not match the userid
        raise ValueError('Permission denied! you can only unregister yourself!')

    @staticmethod
    def getRequiredUsers(pollId, option):
        users = DBHandler.Polls_Results.query.filter_by(poll_id=pollId , poll_option=option).all()
        # second_users = users.query.filter_by(poll_option=option).all()
        # users = DBHandler.Polls_Results.query.filter_by(poll_option=option)

        # print(second_users)
        usersIds = set()

        for u in users:
            usersIds.add(u.user_id)

        return usersIds

# ----------- helper generic methods ------- #

    @staticmethod
    def get_column_values(table_column):
        values = []
        for value in db.session.query(table_column):
            values.append(value[0])
        return values

    @staticmethod
    def Max_Id(table_column):
        res = db.session.query(func.max(table_column)).scalar()
        # print(res)
        if res is None:
            return 0
        return res






    # --------------- admins methods ----------------- #


    @staticmethod
    def is_admin(username, password):

        admin = DBHandler.Admin.query.filter_by(username=username).first()
        # print(admin)
        if admin is None:
            return False
        #if passwords are equal it returns true , else return false
        return check_password_hash(admin.password_hash, password)

    @staticmethod
    def get_admin(username):
        admin = DBHandler.Admin.query.filter_by(username=username).first()
        return admin

    @staticmethod
    def register_admin(username ,password , email , phone_number):


        hashed_pass = generate_password_hash(password)
        max_adminId = DBHandler.Max_Id(DBHandler.Admin.id)

        admin = DBHandler.Admin(id=max_adminId+1, username=username,password_hash=hashed_pass , email= email , phone_number=phone_number)
        db.session.add(admin)

        try:
            db.session.commit()

        except sqlalchemy.exc.IntegrityError:
            raise ValueError('admin details in use')
        finally:
            db.session.close()


# --------------- polls methods ----------------- #



    @staticmethod
    def add_poll(title , desc , adminId):

        curr_max_poll_id = DBHandler.Max_Id(DBHandler.Polls.id)
        poll_id = curr_max_poll_id + 1

        poll = DBHandler.Polls(id=poll_id , poll_title=title , description=desc , adminID=adminId)
        db.session.add(poll)

        try:
            db.session.commit()
            return poll_id
        except sqlalchemy.exc.IntegrityError:
            raise ValueError('poll exists in the system')
        finally:
            db.session.close()



    @staticmethod
    def add_poll_options(pollId , option):
        max_required_id = DBHandler.Max_Id(DBHandler.Polls_Options.required_id)
        required_id = max_required_id + 1

        poll_option = DBHandler.Polls_Options(required_id=required_id, poll_id=pollId, poll_option=option)
        db.session.add(poll_option)

        try:
            db.session.commit()

        except sqlalchemy.exc.IntegrityError:
            raise ValueError('option exists')

        finally:
            db.session.close()



    @staticmethod
    def add_poll_mapping(botPollId , pollId):

        poll_mapping = DBHandler.Polls_ids(botPollId=botPollId  , poll_id=pollId)
        db.session.add(poll_mapping)

        try:
            db.session.commit()

        except sqlalchemy.exc.IntegrityError:
            raise ValueError('poll mapping exists')

        finally:
            db.session.close()

    '''
       { 
        pollID,
        title,
        description,
        data: [ 
                {
                option
                number of answers
                }
            ]
       }
   '''
    @staticmethod
    def get_admin_polls_results(adminId):
        polls = DBHandler.getAdminPolls(adminId)
        return DBHandler.get_results_of_polls(polls)

    @staticmethod
    def get_all_polls_results():
        polls = DBHandler.get_all_polls()
        return DBHandler.get_results_of_polls(polls)

    @staticmethod
    def get_results_of_polls(polls):
        res = []
        for poll in polls:
            poll_id = poll['pollID']
            poll_title = poll['title']
            poll_desc = poll['description']
            curr_poll = {'pollID': poll_id, 'title': poll_title, 'description': poll_desc, 'data': []}
            res.append(curr_poll)
            for o in poll['options']:
                num = DBHandler.Polls_Results.query.filter_by(poll_id=poll_id, poll_option=o).count()
                curr_poll['data'].append({'option': o, 'votesCount': num})
        return {'pollsResults': res}
    '''
    {
        pollID,
        title,
        description,
        options: [
            option1
            option2
            ...
        ]
    }
    '''
    @staticmethod
    def getAdminPolls(adminId):

        polls = DBHandler.Polls.query.filter_by(adminID=adminId).all()
        # return polls_query
        # user = DBHandler.User.query.filter_by(id=userid).first()
        res = []
        for p in polls:
            curr_poll = {'pollID': p.id, 'title': p.poll_title, 'description': p.description, 'options': []}
            options = DBHandler.Polls_Options.query.filter_by(poll_id=p.id).all()
            for o in options:
                curr_poll['options'].append(o.poll_option)
            res.append(curr_poll)
        return res

    @staticmethod
    def get_all_polls():
        polls = DBHandler.Polls.query.all()
        res = []
        for p in polls:
            curr_poll = {'pollID': p.id, 'title': p.poll_title, 'description': p.description, 'options': []}
            options = DBHandler.Polls_Options.query.filter_by(poll_id=p.id).all()
            for o in options:
                curr_poll['options'].append(o.poll_option)
            res.append(curr_poll)
        return res

    @staticmethod
    def remove_poll(pollId):
        poll = DBHandler.Polls.query.filter_by(id=pollId).delete()
        db.session.commit()
        db.session.close()
        return



    @staticmethod
    def register_answer(botPollId , userId , ans):

        poll = DBHandler.Polls_ids.query.filter_by(botPollId=botPollId).first()
        pollId = poll.poll_id
        query = DBHandler.Polls_Options.query.filter_by(poll_id=pollId)
        # print(query)
        # print(query[0])
        answer = query[ans].poll_option

        max_key = DBHandler.Max_Id(DBHandler.Polls_Results.required_key)
        key = max_key + 1

        poll_res = DBHandler.Polls_Results(required_key=key ,poll_id=pollId ,poll_option=answer ,user_id=userId )
        db.session.add(poll_res)
        db.session.commit()
        db.session.close()
        return
