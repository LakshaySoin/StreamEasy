# Implement dependencies for web scraping

from flask import Flask, request, jsonify
from flask_cors import CORS
import scrape_spotify
import sqlite3
import os

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def receive_links():
    # Process links
    data = request.get_json()
    links = data.get('links', [])
    exec(links)
    return {}

def connect_to_db():
    db = sqlite3.connect("stream-easy.db")
    cursor = db.cursor()
    return [db, cursor]

def exec(playlist_urls):

    if not os.path.exists("stream-easy.db"):
        db, cursor = connect_to_db()
        cursor.execute("CREATE TABLE playlists(playlist_title, song_name, artist, album)")
    else:
        db, cursor = connect_to_db()

    # Grab song data
    for playlist_url in playlist_urls:

        data = scrape_spotify.scrape_playlist(playlist_url, cursor, db)

        # Search songs and download to desktop
        scrape_spotify.download_playlist(data[1:])

    for row in cursor.execute("SELECT playlist_title, song_name, artist, album FROM playlists"):
        print(row)

    db.close()

if __name__ == "__main__":
    app.run(debug=True)