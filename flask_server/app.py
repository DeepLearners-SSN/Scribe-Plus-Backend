from __future__ import print_function
from flask import Flask, request, jsonify
import random
import string
from flask_socketio import SocketIO
import sys

import spacy
from spacy.matcher import PhraseMatcher

import doNer

async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode, ping_timeout=10000)

nlp = spacy.load('./SymptomsLatestModel - v1')

#helper functions
def randomString(stringLength=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))


def handle_disconnect():
    print('disconnected', file=sys.stderr)


@socketio.on('connect')
def handle_message():
    print('received socket', file=sys.stderr)
    socketio.emit('message', {'data': '12'})
    socketio.on_event('disconnect', handle_disconnect)
    return "Connected!!!"


#API routes
@app.route('/')
def home():
    print('BASE URL API ', file=sys.stderr)
    return jsonify({"message": "BASE FLASK URL"})


@app.route('/api/test/<message>')
def model(message):
    socketio.emit(message, {'data': 42})
    return jsonify({"message": "running socket to emit message"})


@app.route('/api/model/process', methods=['POST'])
def modelProcess():
    data = request.json
    print("DATA", data)
    socketId = data['doctor']['filename'][:-5]
    print(socketId, file=sys.stderr)
    socketio.emit('message', data)
    nerDict = doNer.doNer(data['doctor']['doc']['item'])
    print("API NER", nerDict)
    SymptomsDict = find_symptoms(data['doctor']['doc']['item'])
    if 'symptoms' in SymptomsDict.keys():
        nerDict['symptoms'] = SymptomsDict['symptoms']
    if 'intensity' in SymptomsDict.keys():
        nerDict['intensity'] = SymptomsDict['intensity']
    print("SYMPTOMS NER", nerDict)
    socketio.emit('message', nerDict)
    socketio.emit(socketId, nerDict)
    return jsonify({
        "message": "running socket to emit message",
        "sockId": socketId
    })

def find_symptoms(data):
    print("Entered FIND SYMPTOMS")
    doc = nlp(data)
    response = {
        'message': "This is your response"
    }
    symptoms = " "
    intensity = " "
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    for item in entities:
        if item[1] == 'SYMPTOMS':
            symptoms += item[0] + ', '
        if item[1] == 'INTENSITY':
            intensity += item[0] + ', '

    if symptoms.strip:
        response['symptoms'] = symptoms[:-2].strip()
    if intensity.strip():
        response['intensity'] = intensity[:-2].strip()
    
    return response



    



if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)
