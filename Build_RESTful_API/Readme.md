This is a user monitoring API

** Specs
-- The API listens on a port and accepts incoming HTTP Requests for POST, GET, PUT, DELETE, UPDATE and HEAD

-- The API allows a client to connect, then create a new user, then edit and delete that user

-- The API allows a user to sign in which gives them a token that they can use for subsequent authenticated requests

-- The API allows a user to sign out which invalidates their token

-- The API allows a signed-in user to use their token to create a new "check"

-- The API allows a signed-in user to edit or delete any of their checks. (creation limited to 5)

-- In the background, workers perform all the checks at the appropriate times, and send alerts to the user when a check changes its state from up to down, or visa versa.

--** Connect to Twilio to send SMS 

*** 
    Homework Assignment #1: Hello World API
        -- Details:
        
            Please create a simple "Hello World" API. Meaning:

            1. It should be a RESTful JSON API that listens on a port of your choice.

            2. When someone sends an HTTP request to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want. 
