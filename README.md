# Sample Map App
This is a map which shows potential waypoints in a cycling trip across Japan.

## Configuration
1. Create a mapbox api token as described on the Mapbox website. Note that it is recommended that you use a token which is restricted to the production URL.
1. Create a file called `.env.local` in `sample-map-app` and give it the following contents:
    ```javascript
    REACT_APP_MAPBOX_TOKEN='{YOUR_MAPBOX_TOKEN}'
    ```
    Where `{YOUR_MAPBOX_TOKEN}` is your mapbox token. Make sure to include the quotation marks.

## Running the app
### Development mode
1. Make sure that react-scripts is installed (`npm install react-scripts --save`).
1. Navigate to `sample-map-app` and run the command `npm start`.

### Production mode
1. Make sure that serve is installed (`npm install -g serve`)
1. Build the app with `npm run build`
1. Run `serve -s build`

## Tests
There are 2 sets of tests: unit tests and UI tests.

### Unit Tests
1. Navigate to `sample-map-app` and run `npm test`.

### UI Tests
1. Make sure you version 3.7.8 or greater of python installed
1. Make sure you have selenium for python installed (`pip install selenium`).
1. Download [Chrome WebDriver](https://chromedriver.chromium.org/downloads) and place it in `sample-map-app\selenium_tests\chromedriver.exe`.
1. Make sure that the app is running
1. Navigate to `sample-map-app\selenium_tests` and run `python RunAllTests.py`