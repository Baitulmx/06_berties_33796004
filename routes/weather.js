const express = require('express');
const router = express.Router();
const request = require('request');

// GET form
router.get('/', function(req, res) {
    res.render('weather.ejs', { weather: null, error: null });
});

// POST form
router.post('/', function(req, res) {

    let city = req.body.city;

    // ❗ Fix: handle empty city
    if (!city || city.trim() === "") {
        return res.render('weather.ejs', { 
            weather: null, 
            error: "Please enter a city name." 
        });
    }

    let apiKey = process.env.WEATHER_API_KEY;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function(err, response, body) {
        if (err) {
            return res.render('weather.ejs', { weather: null, error: "API error." });
        }

        let weather = JSON.parse(body);

        if (weather.cod != 200) {
            return res.render('weather.ejs', { 
                weather: null, 
                error: "City not found." 
            });
        }

        res.render('weather.ejs', { 
            weather: weather, 
            error: null 
        });
    });
});

module.exports = router;
