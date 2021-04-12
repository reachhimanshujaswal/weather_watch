# Weather Watch

Weather Watch is a react app which uses OpenWeather and GeoDB Cities APIs to get the latest weather updates.

Preview available at https://c1i5p.sse.codesandbox.io/

## Features

- An Autocomplete search box to get the list of cities worldwide (using GeoDB Cities API)
- Receive latest weather updates for multiple cities at the same time. Weather info is updated every 5 minutes using OpenWeather API
- Users can toggle between Celsius and Fahrenheit depending on prefernce
- React app will save user's city and temperature metric preference in localstorage and bring it up next time users opens it
- Users can click on Weather card of an individual city for more details

## Tech

Weather Watch uses following open source projects:

- React - For UI interface
- Babel - JavaScript transcompiler used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript
- Material-UI - React component library used for Autocomplete search box and Weather cards.
- Axios - Promise based HTTP client used to send asynchronous HTTP requests to OpenWeather and GeoDB Cities APIs
- Throttle-Debounce - Module used to limit the number of calls to GeoDB Cities API for auto-suggestions.


## Installation

- Clone the repository. 
- Put your OpenWeather and GeoDB Cities API keys in src/app.config.js. You need to register to get these API keys for free.
- Install the dependencies and devDependencies and start the server.

```sh
cd weather_watch
npm install
npm start
```

For production environment...

```sh
npm run build
```

## License

GNU GENERAL PUBLIC LICENSE Version 3
