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
    
    def test_with_valid_data(self):
        startWithArgs(self.driver, 'valid_data')
        firstPoi = self.driver.find_element_by_class_name("poi-list").find_elements_by_tag_name("li")[0]
        secondPoi = self.driver.find_element_by_class_name("poi-list").find_elements_by_tag_name("li")[1]
        thirdPoi = self.driver.find_element_by_class_name("poi-list").find_elements_by_tag_name("li")[2]
        previousButton = self.driver.find_element_by_class_name("navigation-buttons").find_elements_by_tag_name("button")[0]
        nextButton = self.driver.find_element_by_class_name("navigation-buttons").find_elements_by_tag_name("button")[1]
        
        # Initial state
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"))
        self.assertFalse('selected-item' in secondPoi.get_attribute("class"))
        self.assertEqual(0, len(self.driver.find_elements_by_class_name("mapboxgl-popup")))

        # popup and recolouration when you click a poi
        firstPoi.click()
        self.assertTrue('selected-item' in firstPoi.get_attribute("class"))
        self.assertFalse('selected-item' in secondPoi.get_attribute("class"))
        popups = self.driver.find_elements_by_class_name("mapboxgl-popup")
        self.assertEqual(1, len(popups))
        self.assertEqual("a", popups[0].find_element_by_tag_name("strong").get_attribute("innerHTML"))

        # recolour and new popup when you click another poi
        secondPoi.click()
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"))
        self.assertTrue('selected-item' in secondPoi.get_attribute("class"))
        popups = self.driver.find_elements_by_class_name("mapboxgl-popup")
        self.assertEqual(1, len(popups))
        self.assertEqual("b", popups[0].find_element_by_tag_name("strong").get_attribute("innerHTML"))

        # next button goes next
        nextButton.click()
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"))
        self.assertFalse('selected-item' in secondPoi.get_attribute("class"))
        self.assertTrue('selected-item' in thirdPoi.get_attribute("class"))

        # previous button goes back again
        previousButton.click()
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"))
        self.assertTrue('selected-item' in secondPoi.get_attribute("class"))
        self.assertFalse('selected-item' in thirdPoi.get_attribute("class"))

    def test_with_blank_data(self):
        startWithArgs(self.driver, 'blank_data')
        pois = self.driver.find_element_by_class_name("poi-list").find_elements_by_tag_name("li")
        # this really only checks that it doesn't blow up when there is nothing
        self.assertEqual(0, len(pois))

    def test_with_invalid_data(self):
        startWithArgs(self.driver, 'invalid_data')
        pois = self.driver.find_element_by_class_name("poi-list").find_elements_by_tag_name("li")
        # this really only checks that it doesn't blow up when there's invalid data. Should
        # act the same as when there is no data
        self.assertEqual(0, len(pois))

def startWithArgs(driver, filename):
    f = open('./testData/' + filename + '.js')
    data = f.read().replace('\r\n', ' ')
    f.close()
    driver.get("http://localhost:3000?pois=" + data)
    time.sleep(3)


if __name__ == "__main__":
    unittest.main()