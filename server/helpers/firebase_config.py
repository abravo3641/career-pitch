from os import getenv
import pyrebase

config = {
    "apiKey": getenv('API_KEY'),                                                                                 # Firebase - copied from 'firebaseConfig' in firebase
    "authDomain": "career-pitch.firebaseapp.com",
    "databaseURL": "https://career-pitch.firebaseio.com",
    "projectId": "career-pitch",
    "storageBucket": "career-pitch.appspot.com",
    "messagingSenderId": getenv('MESSAGING_SENDER_ID'),
    "appId": getenv('APP_ID'),
    "measurementId": "G-GQEBBRL3T6"
}
firebase = pyrebase.initialize_app(config)
auth = firebase.auth() 