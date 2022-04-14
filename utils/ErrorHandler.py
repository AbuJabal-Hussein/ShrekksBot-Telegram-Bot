
class ErrorHandler:

    @staticmethod
    def handle(error_code, url=''):
        if error_code == 400:
            return ErrorHandler.bad_request(url)
        elif error_code == 401:
            return ErrorHandler.unauthorized(url)
        elif error_code == 403:
            return ErrorHandler.forbidden()
        elif error_code == 404:
            return ErrorHandler.not_found(url)
        elif error_code == 409:
            return ErrorHandler.conflict()
        elif error_code == 500:
            return ErrorHandler.internal_server_error()
        elif error_code == 501:
            return ErrorHandler.not_implemented()

        return ErrorHandler.internal_server_error()


    @staticmethod
    def successful_delete(username):
        return '''
               <!DOCTYPE html>
               <html>
               <head>
                   <title>200 Ok</title>
               </head>
               <body>
                   <h1>Successful</h1>

                   <p>Server deleted the user ''' + username + ''' successfully from the system</p>
                   <hr />
               </body>
               </html>
               '''


    @staticmethod
    def successful_adding(username):
        return '''
           <!DOCTYPE html>
           <html>
           <head>
               <title>200 Ok</title>
           </head>
           <body>
               <h1>Successful</h1>

               <p>Server added the user ''' + username + ''' successfully to the system</p>
               <hr />
           </body>
           </html>
           '''


    @staticmethod
    def bad_request(url):
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>400 Bad Request</title>
        </head>
        <body>
            <h1>Bad Request</h1>
        
            <p>The server could not understand the request due to invalid request or URL ''' + url + ''' Format </p>
            <hr />
        </body>
        </html>
        '''

    @staticmethod
    def unauthorized(url):
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>401 Unauthorized</title>
        </head>
        <body>
            <h1>Unauthorized</h1>
            <p>Access to requested URL ''' + url + ''' needs Authentication </p>
            <hr />
        </body>
        </html>
        '''

    @staticmethod
    def forbidden():
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>403 Forbidden</title>
        </head>
        <body>
            <h1>Forbidden</h1>

            <p>Permission denied! Password or Username is not valid</p>
            <hr />
        </body>
        </html>
        '''

    @staticmethod
    def not_found(url):
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 Not Found</title>
        </head>
        <body>
            <h1>Not Found</h1>

            <p>The requested URL ''' + url + ''' was not found on this server</p>
            <hr />
        </body>
        </html>
        '''

    @staticmethod
    def conflict():
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>409 Conflict</title>
        </head>
        <body>
            <h1>Conflict</h1>

            <p>User is already in the system</p>
            <hr />
        </body>
        </html>
        '''

    @staticmethod
    def internal_server_error():
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>500 Internal Server Error</title>
        </head>
        <body>
            <h1>Internal Server Error</h1>

            <p>The server encountered an internal error and was unable to complete your request</p>
            <hr />
        </body>
        </html>
        '''

    @staticmethod
    def not_implemented():
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>501 Not Implemented</title>
        </head>
        <body>
            <h1>Not Implemented</h1>

            <p>Unsupported protocol on the server</p>
            <hr />
        </body>
        </html>
        '''