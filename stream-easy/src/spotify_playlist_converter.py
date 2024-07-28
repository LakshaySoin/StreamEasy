# Implement dependencies for web scraping

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import dllist
import scrape_spotify
import sqlite3
import numpy as np

app = Flask(__name__)
CORS(app)
main_db = "stream_easy"
queue = dllist.DLList()

@app.route('/', methods=['POST'])
def receive_links():
    # Process links
    data = request.get_json()
    links = data.get('links', [])
    exec(links)
    return {}

@app.route("/make-queue", methods=['POST', 'GET'])
def make_queue(shuffle=False, playlist_title=None, index=None):
    if (len(playlist_title) == 0):
        playlist_db, playlist_cursor = connect_to_db(main_db + ".db")
        playlist_title = playlist_cursor.execute(f"SELECT * FROM {main_db}").fetchall()[0][1]
        playlist_db.close()
    db, cursor = connect_to_db(playlist_title + ".db")
    cursor.row_factory = sqlite3.Row
    arr = []
    for row in cursor.execute(f"SELECT song_name, artist, album, id FROM {playlist_title}"):
        arr.append(row)
    db.close()
    temp = arr[index + 1:] + arr[:index]
    if (shuffle):
        np.random.shuffle(temp)
    queue.clear()
    for item in temp:
        queue.addLast(item)
    return jsonify([dict(item) for item in queue])

@app.route("/skip-song", methods=['POST', 'GET'])
def get_queue():
    if (queue.isEmpty()):
        return {} 
    newCurrSong = dict(queue.getNext())
    newIndex = newCurrSong['id'] - 1
    return jsonify({
        'queue': [dict(item) for item in queue],
        'index': newIndex
    })

@app.route("/shuffle", methods=['POST'])
def shuffle_playlist():
    data = request.get_json()
    shuffle = data.get('shuffle', [])
    playlist_title = data.get('playlist_title', [])
    index = data.get('index', [])
    return make_queue(shuffle, playlist_title, index)

@app.route("/webplayer", methods=['GET', 'POST'])
def get_items():
    data = request.get_json()
    playlist_title = data.get('playlist_title', [])
    if (len(playlist_title) == 0):
        playlist_db, playlist_cursor = connect_to_db(main_db + ".db")
        playlist_title = playlist_cursor.execute(f"SELECT * FROM {main_db}").fetchall()[0][1]
        playlist_db.close()
    db, cursor = connect_to_db(playlist_title + ".db")
    cursor.row_factory = sqlite3.Row
    items = cursor.execute(f"SELECT * FROM {playlist_title}").fetchall()
    db.close()
    return jsonify([dict(item) for item in items])

def connect_to_db(name):
    db = sqlite3.connect(name)
    cursor = db.cursor()
    return [db, cursor]

def exec(playlist_urls):
    
    playlist_db, playlist_cursor = connect_to_db(main_db + ".db")

    playlist_cursor.execute(f"CREATE TABLE IF NOT EXISTS {main_db} (id INTEGER PRIMARY KEY AUTOINCREMENT, playlist_title TEXT UNIQUE)")
    playlist_db.commit()

    # Grab song data
    for playlist_url in playlist_urls:

        arr = scrape_spotify.scrape_playlist(playlist_url)

        playlist_title = arr[0][0]
        
        db, cursor = connect_to_db(playlist_title + ".db")

        cursor.execute(f"CREATE TABLE IF NOT EXISTS {playlist_title} (id INTEGER PRIMARY KEY AUTOINCREMENT, song_name, artist, album, playlist_title)")
        db.commit()

        scrape_spotify.save_data(arr, cursor, db, playlist_title)

        playlist_cursor.execute(f"INSERT INTO {main_db} (playlist_title) VALUES(?)", (playlist_title,))
        playlist_db.commit()

        # Search songs and download to desktop
        scrape_spotify.download_playlist(arr[0][1:])

        db.close()

    playlist_db.close()

if __name__ == "__main__":
    app.run(debug=True)