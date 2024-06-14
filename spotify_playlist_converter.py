# Implement dependencies for web scraping

from selenium import webdriver 
from flask import Flask, request, jsonify
from flask_cors import CORS
import scrape_spotify

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def receive_links():
    # Process links
    data = request.get_json()
    links = data.get('links', [])
    exec(links)

def exec(playlist_urls):

    # Grab song data
    for playlist_url in playlist_urls:
        data = scrape_spotify.scrape_playlist(playlist_url)

        # Search songs and download to desktop
        scrape_spotify.download_playlist(data[1:], data[0])

if __name__ == "__main__":
    app.run(debug=True)