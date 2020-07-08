from flask import Flask, request, jsonify
import random
import string
from flask_socketio import SocketIO


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)



#helper functions 
def randomString(stringLength=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))

@socketio.on('connect')
def handle_message():
    print('received socket')


#API routes
@app.route('/')
def home():
    return jsonify({"message":"BASE FLASK URL"})

@app.route('/api/model/<message>')
def model(message):
    socketio.emit(message, {'data': 42})
    return jsonify({"message":"running socket to emit message"})


@app.route('/api/model/process',methods=['POST'])
def modelProcess():
    data = request.json
    socketId = data['doctor']['filename'][:-5]
    print(socketId)
    socketio.emit(socketId, data)
    return jsonify({"message":"running socket to emit message","sockId":socketId})


if __name__ == "__main__":
   socketio.run(app, host='0.0.0.0', port=5000)