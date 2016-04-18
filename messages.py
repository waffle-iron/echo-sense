
def get_messages(self, d):
    """
    Helper for returning notification messages to template dict

    Use ?message=TEXT to show a raw message

    Use a '*' before the message to make the growl notification persistent.
    Use a '!' before the message to show an error styled growl.
    """
    raw_message = self.request.get('message')
    flash_messages = self.get_messages()
    if raw_message:
        d['notification'] = {'text': raw_message, 'persistent': False, 'class': 'dark'}
    elif flash_messages:
        #TODO: Support multiple notifications.
        level = flash_messages[0][1]
        _class = {
            0: 'dark',
            1: 'success',
            2: 'danger'
        }.get(level)
        d['notification'] = {'text': flash_messages[0][0], 'level': level, 'persistent': False, 'class': _class if _class else 'dark'}
    return d

class EMAILS():

    USER_INVITE = 1

    CONTENT = {
        USER_INVITE: {
            'subject': '%s invited you to %s!',
            'body': '''Your invite code is: %s

To register, go to %s/login and enter your invite code.
'''
        }
    }

class ERROR():
  OK = 0
  UNAUTHORIZED = 1
  BAD_TOKEN = 2
  USER_NOT_FOUND = 3
  MALFORMED = 4
  AUTH_FAILED = 5

  LABELS = {OK: "OK", UNAUTHORIZED: "Unauthorized", BAD_TOKEN: "Bad Token", USER_NOT_FOUND: "User not found", MALFORMED: "Malformed Request!", AUTH_FAILED: "Auth failed"}
