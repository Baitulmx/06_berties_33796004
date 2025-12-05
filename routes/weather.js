const express = require('express');
const router = express.Router();
const request = require('request');

// GET: Show the form
router.get('/', function(req, res, next) {
    res.render("weather.ejs", { message: null });
});

// POST: Process the form
router.post('/', function(req, res, next) {

    let city = req.body.city;
    let apiKey = process.env.WEATHER_API_KEY;

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function(err, response, body) {
        if (err) {
            return next(err);
        }

        let weather = JSON.parse(body);

        // -------- TASK 6: City not found handling --------
        if (weather.cod == "404") {
            let message = `<h3>Sorry, the city "${city}" was not found.</h3>`;
            return res.render("weather.ejs", { message: message });
        }
        // -------------------------------------------------

        // Tasks 3–5: Nicely formatted weather details
        let message = `
            <h2>Weather for ${weather.name}</h2>
            Temperature: ${weather.main.temp}°C<br>
            Feels like: ${weather.main.feels_like}°C<br>
            Min: ${weather.main.temp_min}°C | Max: ${weather.main.temp_max}°C<br>
            Humidity: ${weather.main.humidity}%<br>
            Wind speed: ${weather.wind.speed} m/s<br>
            Description: ${weather.weather[0].description}<br>
        `;

        res.render("weather.ejs", { message: message });
    });
});

module.exports = router;
