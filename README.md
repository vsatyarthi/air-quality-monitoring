# Air Quality Monitor

This app is to demonstrate how to utilize an existing websocket provider that dispatched new city data with it's air
quality indexes almost each seconds. Based of this data we preserve last few fetched data as history for same city and
if new city is found we add that to our state manager.

Technologies used:

- Tailwind CSS
- React JS
- chart.js (base chart library)
- react-chartjs-2 (react implementation of chart library)
- Websocket (data of max 12 cities AQI)

Please note this is only front-end that is dependent on the response of the websocket URL. A sample data is included
within the file itself to test accordingly.

Demo URL: https://air-quality-monitor-demo.herokuapp.com/

(The heroku app serves over HTTPs, therefore by default it does not allow non HTTPS websocket connection. In order to view our web app working, we need to "allow insecure content" from the browser's address bar -> site settings)