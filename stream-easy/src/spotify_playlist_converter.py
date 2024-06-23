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
    return ""

def exec(playlist_urls):

    db = sqlite3.connect("stream-easy.db")
    cursor = db.cursor()
    # Check if the folder already exists
    if not os.path.exists("stream-easy.db"):
        cursor.execute("CREATE TABLE playlists(playlist_title, song_name, artist, album)")

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