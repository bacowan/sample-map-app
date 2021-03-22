import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
import time

class UITests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
    
    def tearDown(self):
        self.driver.close()
    
    def test(self):
        startWithArgs(self.driver, 'valid_data')


def startWithArgs(driver, filename):
    f = open('./testData/' + filename + '.js')
    data = f.read().replace('\r\n', ' ')
    f.close()
    driver.get("http://localhost:3000?pois=" + data)


if __name__ == "__main__":
    unittest.main()