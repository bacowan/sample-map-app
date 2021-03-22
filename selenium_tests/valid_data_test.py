from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
import time
import testUtils

def valid_data_test():
    driver = webdriver.Chrome()
    
    serverUrl = "http://localhost:3000"
    driver = webdriver.Chrome()

    f = open('./testData/valid_data.js')
    data = f.read().replace('\r\n', ' ')

    driver.get(serverUrl + '?pois=' + data)

    time.sleep(50)

    driver.close()