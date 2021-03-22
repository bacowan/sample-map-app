from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
import time

serverUrl = "http://localhost:3000"

def testUrl(filename):
    f = open(filename)
    data = f.read().replace('\r\n', ' ')
    f.close()
    return serverUrl + '?pois=' + data