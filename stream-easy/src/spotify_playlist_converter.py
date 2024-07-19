# Implement dependencies for web scraping

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from collections import deque
import scrape_spotify
import sqlite3
import os

app = Flask(__name__)
CORS(app)
queue = deque() 
main_db = "stream_easy"

@app.route('/', methods=['POST'])
def receive_links():
    # Process links
    data = request.get_json()
    links = data.get('links', [])
    exec(links)
    return {}

# @app.route("/webplayer/queue", methods=['POST', 'GET'])
# def get_queue():
#     if (request.method == 'POST'):
#         arr = connect_to_db()
#         cursor = arr[1]
#         for row in cursor.execute("SELECT playlist_title, song_name, artist, album FROM playlists"):
#             if (row[1] == request.args['playlist_title']):
#                 queue.appendleft(row[1])
#         return queue
#     if (request.method == 'GET'):
#         # do stuff
#         print("hello")
#     return {}


@app.route("/webplayer/playlists", methods=['GET', 'POST'])
def get_items():
    # basically create a new db that holds the playlist_titles and if the first call is null, just use the first playlist in this db
    data = request.get_json()
    playlist_title = data.get('playlist_title', [])
    if (len(playlist_title) == 0):
        playlist_db, playlist_cursor = connect_to_db(main_db + ".db")
        playlist_title = playlist_cursor.execute(f"SELECT * FROM {main_db}").fetchall()[0][1]
        print(playlist_title)
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

        cursor.execute(f"CREATE TABLE IF NOT EXISTS {playlist_title} (id INTEGER PRIMARY KEY AUTOINCREMENT, playlist_title TEXT UNIQUE, song_name, artist, album)")
        db.commit()

        scrape_spotify.save_data(arr, cursor, db)

        for row in cursor.execute(f"SELECT * FROM {playlist_title}").fetchall():
            print(row)

        playlist_cursor.execute(f"INSERT INTO {main_db} (playlist_title) VALUES(?)", (playlist_title,))
        playlist_db.commit()

        # Search songs and download to desktop
        scrape_spotify.download_playlist(arr[0][1:])

        db.close()

    playlist_db.close()

if __name__ == "__main__":
    app.run(debug=True)