# Implement dependencies for web scraping

from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains as AC
from seleniumbase import SB
import time
import argparse

SCROLL_PAUSE_TIME = 3

def download_playlist(playlist_url):
    driver = webdriver.Chrome()

    data = scrape_playlist(playlist_url, driver)
    search_youtube(data[1:], 'lakshaysoin@gmail.com', 'Curryisgood!1234', data[0])

    driver.close()

def scrape_playlist(playlist_url, driver):

    # Open spotify for data collection
    driver.get(playlist_url)
    driver.maximize_window()
    # time.sleep(30)
    
    # Store song names and artists
    data = []

    playlist_name = driver.find_element(By.CLASS_NAME, 'rEN7ncpaUeSGL9z0NGQR')

    data.append(playlist_name.text)

    # Length of webpage
    length = driver.execute_script("return document.querySelector('.lYpiKR_qEjl1jGGyEvsA').clientHeight")

    # length = 625

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

        scroll_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[4]/div/div'))
        )

        # driver.execute_script('arguments[0].scrollTop = arguments[0].scrollTop + arguments[0].offsetHeight;', scroll_box)

        action.click_and_hold(scroll_box).drag_and_drop_by_offset(scroll_box, 0, 100).perform()
        
        # action.move_to_element(scroll_box).move_by_offset(0,50).click().perform()

        # action.click_and_hold(scroll_box)

        # action.perform()

        # action.drag_and_drop_by_offset(scroll_box, 0, min(length - curr_length, 100))

        # action.perform()

        # Calculate new scroll height and compare with last scroll height
        curr_length += 100
        print(curr_length)
        print(length)
        time.sleep(1)
        if curr_length >= length:
            break

    data = data[:-10]

    print(data)

    return data

def search_youtube(data_frame, username, password, playlist_title):
    with SB(uc=True) as driver:
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
            search_bar.send_keys(songs[0] + " by " + songs[1])
            search_bar.send_keys(Keys.RETURN)
            time.sleep(0.5)
            video = driver.find_element(By.CSS_SELECTOR, 'a[id="video-title"]')
            video.click()
            selector = driver.find_element(By.XPATH, '//*[@id="button-shape"]/button')
            selector.click()
            save = driver.find_element(By.XPATH, '//*[@id="items"]/ytd-menu-service-item-renderer[2]/tp-yt-paper-item/yt-formatted-string')
            save.click()
            if count == -1:
                create_playlist = driver.find_element(By.XPATH, '//*[@id="content-icon"]')
                create_playlist.click()
                playlist_name = driver.find_element(By.XPATH, '//*[@id="input-2"]/input')
                playlist_name.send_keys(playlist_title)
                create = driver.find_element(By.XPATH, '//*[@id="actions"]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div')
                create.click()
                count += 1
            else:
                playlists = driver.find_element(By.ID, 'playlists')
                playlist_names = playlists.text.split("\n")
                for name in playlist_names:
                    if name == playlist_title:
                        # print(name)
                        add_to_playlist = driver.find_element(By.XPATH, f"//*[contains(text(),'{name}')]")
                        add_to_playlist.click()
            time.sleep(SCROLL_PAUSE_TIME)
            search_bar.clear()

if __name__ == "__main__":

# Initialize parser
    parser = argparse.ArgumentParser()
    
    # Adding optional argument
    parser.add_argument("-u", "--url", help = "link for spotify playlist")
    
    # Read arguments from command line
    args = parser.parse_args()

    download_playlist(args.url)