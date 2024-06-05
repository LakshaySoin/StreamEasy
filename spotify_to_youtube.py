# Implement dependencies for web scraping

from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains as AC
from seleniumbase import SB
from selenium.webdriver.chrome.options import Options
import os
import subprocess
import time
import argparse
# import sqlite3

def exec(playlist_url, download_option, email_address="lakshaysoin@gmail.com", password="Curryisgood!1234"):
    driver = webdriver.Chrome()

    # Grab song data
    data = scrape_playlist(playlist_url, driver)

    # Search songs and transfer to a playlist
    search_youtube(data[1:], email_address, password, data[0], download_option)

def scrape_playlist(playlist_url, driver):

    # Open spotify for data collection
    driver.get(playlist_url)
    driver.maximize_window()
    
    # Store song names and artists
    data = []

    # Get the name of spotify playlist to use for youtube playlist
    playlist_name = driver.find_element(By.CLASS_NAME, 'rEN7ncpaUeSGL9z0NGQR')

    data.append(playlist_name.text)

    # Length of container with songs
    length = driver.execute_script("return document.querySelector('.lYpiKR_qEjl1jGGyEvsA').clientHeight")

    curr_length = 0

    action = AC(driver)

    while True:

        # Get song and artist names on the current page
        elements = driver.find_elements(By.CLASS_NAME, '_iQpvk1c9OgRAc8KRTlH')

        # Iterate through all song elements and append unique ones to array
        for i in range(len(elements)):
            info = elements[i].text.split("\n")
            song_name, artist_name = info[0], info[-1]
            arr = [song_name, artist_name]
            if arr not in data:
                data.append(arr)

        # Container to scroll within
        scroll_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[4]/div/div'))
        )

        # Move down webpage (this doesn't accidently click album names)
        action.click_and_hold(scroll_box).drag_and_drop_by_offset(scroll_box, 0, 100).perform()

        # Calculate new scroll height and compare with last scroll height
        curr_length += 100

        time.sleep(1)

        # End scrolling
        if curr_length >= length:
            break

    # Remove recommended songs
    data = data[:-10]

    # Close the tab
    driver.close()

    return data

def search_youtube(data_frame, username, password, playlist_title, download_option):
    with SB(uc=True) as driver:
        # Login to google account (bypasses the insecure page)
        driver.get("https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&ec=65620&hl=en&ifkv=AS5LTARVpfGfB8Iq0HL3aV_O1MY5qjuW5AlQiOnun0WuNxvOVTgB5Jh4I-ptBorc6RvhieqxgjYX&passive=true&service=youtube&uilel=3&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1859192857%3A1717365834211317&ddm=0")

        driver.type("#identifierId", username)
        driver.click("#identifierNext > div > button")

        driver.type("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input", password)
        driver.click("#passwordNext > div > button")

        driver.maximize_window()

        # Locate youtube search bar
        search_bar = driver.find_element(By.XPATH, "//input[@id='search']")

        count = -1

        for songs in data_frame:
            # Search for song
            search_bar.send_keys(songs[0] + " by " + songs[1])
            search_bar.send_keys(Keys.RETURN)

            time.sleep(0.5)

            # Click on first video result
            video = driver.find_element(By.CSS_SELECTOR, 'a[id="video-title"]')
            video.click()

            # Access save button
            selector = driver.find_element(By.XPATH, '//*[@id="button-shape"]/button')
            selector.click()
            save = driver.find_element(By.XPATH, '//*[@id="items"]/ytd-menu-service-item-renderer[2]/tp-yt-paper-item/yt-formatted-string')
            save.click()

            if count == -1:
                # Only create a playlist if its the first song
                create_playlist = driver.find_element(By.XPATH, '//*[@id="content-icon"]')
                create_playlist.click()

                # Name the playlist
                playlist_name = driver.find_element(By.XPATH, '//*[@id="input-2"]/input')
                playlist_name.send_keys(playlist_title)

                # Create playlist
                create = driver.find_element(By.XPATH, '//*[@id="actions"]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div')
                create.click()
                count += 1
            else:
                # Find the names of all created playlists
                playlists = driver.find_element(By.ID, 'playlists')
                playlist_names = playlists.text.split("\n")

                for name in playlist_names:
                    # Add to playlist named after spotify playlist
                    if name == playlist_title:
                        add_to_playlist = driver.find_element(By.XPATH, f"//*[contains(text(),'{name}')]")
                        add_to_playlist.click()

            # Apply option of downloading playlist  
            if download_option:
                desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
                download_folder = "_".join(playlist_title.split(" "))
                folder_path = os.path.join(desktop_path, download_folder)

                # Check if the folder already exists
                if not os.path.exists(folder_path):
                    # Create the new folder
                    os.makedirs(folder_path)

                chrome_options = Options()
                chrome_options.add_experimental_option("prefs", {
                "download.default_directory": folder_path,
                "download.prompt_for_download": False,  # To suppress download prompt
                "download.directory_upgrade": True,
                "safebrowsing.enabled": True
                })

                temp_driver = webdriver.Chrome(options=chrome_options)
                download_playlist(temp_driver, driver.get_current_url())
                temp_driver.close()

            search_bar.clear()

            time.sleep(3)


def download_playlist(driver, curr_url):
    print(curr_url)
    print(curr_url[:16] + curr_url[19:])
    driver.get(curr_url[:16] + curr_url[19:])

    time.sleep(5)
    download_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[1]/div/div[1]/div/div/div[3]/div[3]/div[7]/button')
    download_button.click()

    time.sleep(30)
    action = AC(driver)
    action.key_down(Keys.ENTER)

if __name__ == "__main__":

    # Initialize parser
    parser = argparse.ArgumentParser()
    
    # Add required information needed from the user
    parser.add_argument("-u", "--url", help = "link for spotify playlist")
    # parser.add_argument("-e", "--email", help = "username for google account")
    # parser.add_argument("-p", "--password", help = "password for google account")
    parser.add_argument("-d", "--download", help = "True of False option to download playlist")
    
    # Read arguments from command line
    args = parser.parse_args()

    exec(args.url, args.download)