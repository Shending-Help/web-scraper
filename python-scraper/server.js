/**
 * Express server for serving property listings from a JSON file.
 *
 * @module server
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
/**
 * The port on which the server will listen.
 * @type {number}
 */
const PORT = process.env.PORT || 3000;
/**
 * The path to the JSON file containing listings data.
 * @type {string}
 */
const JSON_FILE_PATH = path.join(__dirname, 'listings.json');

let listingsData = [];

/**
 * Loads listings from the JSON file into memory.
 * If the file cannot be read or parsed, falls back to an empty array.
 */
function loadListings() {
    try {
        const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
        listingsData = JSON.parse(rawData);
        console.log(`Successfully loaded ${listingsData.length} listings from ${JSON_FILE_PATH}`);
    } catch (error) {
        console.error(`Error reading or parsing ${JSON_FILE_PATH}:`, error);
        listingsData = [];
    }
}

// Load listings when the server starts
loadListings();

/**
 * Parses a price string (e.g., "£389,995") into a number.
 *
 * @param {string} priceStr - The price string to parse.
 * @returns {number|null} The numeric value of the price, or null if invalid.
 */
function parsePrice(priceStr) {
    if (!priceStr || typeof priceStr !== 'string') {
        return null;
    }
    // Remove '£' and any commas, then convert to float
    const numericStr = priceStr.replace(/£/g, '').replace(/,/g, '');
    const price = parseFloat(numericStr);
    return isNaN(price) ? null : price;
}

/**
 * GET /api/listings
 * Returns filtered property listings based on query parameters.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @query {string} [minPrice] - Minimum price filter.
 * @query {string} [maxPrice] - Maximum price filter.
 * @query {string} [location] - Location filter (case-insensitive substring match).
 */
app.get('/api/listings', (req, res) => {
    let filteredListings = [...listingsData];

    const { minPrice, maxPrice, location } = req.query;

    // Filter by price range
    if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) {
            filteredListings = filteredListings.filter(listing => {
                const listingPrice = parsePrice(listing.price);
                return listingPrice !== null && listingPrice >= min;
            });
        }
    }

    if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) {
            filteredListings = filteredListings.filter(listing => {
                const listingPrice = parsePrice(listing.price);
                return listingPrice !== null && listingPrice <= max;
            });
        }
    }

    // Filter by location (case-insensitive)
    if (location && typeof location === 'string') {
        const searchLocation = location.trim().toLowerCase();
        if (searchLocation) {
            filteredListings = filteredListings.filter(listing =>
                listing.location && listing.location.toLowerCase().includes(searchLocation)
            );
        }
    }

    res.json(filteredListings);
});

/**
 * GET /
 * Basic root route to confirm the API is running.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
    res.send('Listings API is running. Try /api/listings');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});