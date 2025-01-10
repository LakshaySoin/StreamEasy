# Spotify-Web-Scraper

Web scrapes Spotify playlists and creates a custom local web player with those same playlists.

---

## **Features**
- Parses Spotify playlist links to extract song data.
- Stores playlist information in a SQL database.
- Displays and plays playlists in a custom web player.
- Supports functionality like skipping, shuffling, and queue management.

---

## **Getting Started**

### **Prerequisites**
- Ensure you have Docker and Docker Compose installed on your machine.
  - [Install Docker](https://docs.docker.com/get-docker/)
  - [Install Docker Compose](https://docs.docker.com/compose/install/)

---

### **Installation and Usage**

1. **Clone the Repository**  
   Open your terminal and run the following command:  
   ```bash
   git clone https://github.com/LakshaySoin/StreamEasy.git
   cd StreamEasy

2. **Run the Application**
    ```bash
    docker-compose build
    docker-compose up