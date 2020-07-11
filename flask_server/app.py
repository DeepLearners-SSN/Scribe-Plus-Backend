from __future__ import print_function
from flask import Flask, request, jsonify
import random
import string
from flask_socketio import SocketIO
import sys

import doNer

async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode, ping_timeout=10000)


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


@app.route('/api/model/<message>')
def model(message):
    socketio.emit(message, {'data': 42})
    return jsonify({"message": "running socket to emit message"})


@app.route('/api/model/process', methods=['POST'])
def modelProcess():
    data = request.json
    socketId = data['doctor']['filename'][:-5]
    print(socketId, file=sys.stderr)
    nerDict = doNer.doNer(data['doctor']['doc']['item'])
    socketio.emit(socketId, jsonify(nerDict))
    return jsonify({
        "message": "running socket to emit message",
        "sockId": socketId
    })


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)
