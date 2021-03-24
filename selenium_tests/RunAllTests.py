import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time

class UITests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
    
    def tearDown(self):
        self.driver.close()
    
    def test_poi_navigation(self):
        startWithArgs(self.driver, 'valid_data')
        poiList = self.driver.find_element_by_class_name("poi-list")
        firstPoi = poiList.find_elements_by_tag_name("li")[0]
        secondPoi = poiList.find_elements_by_tag_name("li")[1]
        thirdPoi = poiList.find_elements_by_tag_name("li")[2]
        previousButton = self.driver.find_element_by_class_name("navigation-buttons").find_elements_by_tag_name("button")[0]
        nextButton = self.driver.find_element_by_class_name("navigation-buttons").find_elements_by_tag_name("button")[1]

        # Initial state
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"), "Item is initially selected when it shouldn't be")
        self.assertFalse('selected-item' in secondPoi.get_attribute("class"), "Item is initially selected when it shouldn't be")
        self.assertEqual(0, len(self.driver.find_elements_by_class_name("mapboxgl-popup")), "Popup is initially visible when it shouldn't be")

        # popup and recolouration when you click a poi
        firstPoi.click()
        self.assertTrue('selected-item' in firstPoi.get_attribute("class"), "Clicking on the first item in the list didn't highlight it")
        self.assertFalse('selected-item' in secondPoi.get_attribute("class"), "Clicking on the first item in the list highlighted the second one")
        popups = self.driver.find_elements_by_class_name("mapboxgl-popup")
        self.assertEqual(1, len(popups), "0 or more than 1 popups appeard when an item in the list was clicked")
        self.assertTrue(popups[0].find_element_by_tag_name("strong").get_attribute("innerHTML").startswith("a:"), "The wrong popup appeared when an item in the list was clicked")

        # recolour and new popup when you click another poi
        secondPoi.click()
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"), "Clicking on the second item in the list didn't unselect the first one")
        self.assertTrue('selected-item' in secondPoi.get_attribute("class"), "Clicking on the second item in the list didn't highlight it")
        popups = self.driver.find_elements_by_class_name("mapboxgl-popup")
        self.assertEqual(1, len(popups), "0 or more than 1 popups appeard when an item in the list was clicked")
        self.assertTrue(popups[0].find_element_by_tag_name("strong").get_attribute("innerHTML").startswith("b:"), "The wrong popup appeared when an item in the list was clicked")

        # next button goes next
        nextButton.click()
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"), "Clicking the next button highlighted the previous item")
        self.assertFalse('selected-item' in secondPoi.get_attribute("class"), "Clicking the next button kept the current item highlighted")
        self.assertTrue('selected-item' in thirdPoi.get_attribute("class"), "Clicking the next button didn't highlight the next item")

        # previous button goes back again
        previousButton.click()
        self.assertFalse('selected-item' in firstPoi.get_attribute("class"), "Clicking the previous button highlighted the next item")
        self.assertTrue('selected-item' in secondPoi.get_attribute("class"), "Clicking the previous button didn't highlight the previous item")
        self.assertFalse('selected-item' in thirdPoi.get_attribute("class"), "Clicking the previous button kept the current item highlighted")

    def test_poi_filtering(self):
        startWithArgs(self.driver, 'valid_data')
        poiList = self.driver.find_element_by_class_name("poi-list")
        filterSelect = Select(self.driver.find_element_by_tag_name("select"))

        # The filter filters things
        filterSelect.select_by_value("StartStop")
        self.assertEqual(2, len(poiList.find_elements_by_tag_name("li")), "The incorrect number of items remained visible when a filter was selected")
        self.assertEqual("a", poiList.find_elements_by_tag_name("li")[0].get_attribute("innerHTML"), "An item with the selected filter was hidden")
        self.assertEqual("c", poiList.find_elements_by_tag_name("li")[1].get_attribute("innerHTML"), "An item with the selected filter was hidden")

        # Resetting the filter brings them back
        filterSelect.select_by_value("")
        self.assertEqual(3, len(poiList.find_elements_by_tag_name("li")), "Clearing the filter didn't reset the visible items")

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