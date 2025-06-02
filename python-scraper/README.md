# Property Listings API

This is a simple Node.js and Express server that serves property listings from a JSON file and provides filtering capabilities via a REST API.

## Features
- Loads property listings from a local `listings.json` file
- Exposes a REST API endpoint to retrieve listings
- Supports filtering by minimum price, maximum price, and location (case-insensitive)
- Includes a Python script to scrape property listings and generate/update the `listings.json` file

## Requirements
- Node.js (v14 or higher recommended)
- npm (Node Package Manager)
- Python 3.x (for running the scraper)

## Setup
1. Clone or download this repository.
2. Ensure you have a `listings.json` file in the root of the `python-scraper` directory. This file should contain an array of property listing objects. You can generate this file using the provided Python scraper (see below).
3. Install dependencies:
   ```sh
   npm install
   ```

## Running the Server
Start the server with:
```sh
node server.js
```
By default, the server runs on [http://localhost:3000](http://localhost:3000).

## Running the Python Scraper
The `scraper.py` script scrapes property listings from a target website and saves them to `listings.json`.

To run the scraper:
```sh
python scraper.py
```
- Make sure you have the required Python packages installed (see the top of `scraper.py` for any dependencies such as `requests`, `beautifulsoup4`, etc.).
- The script will overwrite or create the `listings.json` file with the latest scraped data.

## API Endpoints

### GET /
Returns a simple message confirming the API is running.

### GET /api/listings
Returns a list of property listings. Supports the following query parameters:
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `location` (string): Location filter (case-insensitive substring match)

**Example:**
```
GET /api/listings?minPrice=200000&maxPrice=500000&location=London
```

## Example `listings.json` Structure
```json
[
  {
    "price": "£389,995",
    "location": "London",
    "title": "2 Bedroom Apartment",
    "link": "https://repossessedhousesforsale.com/properties/2-bedroom-detached-house-for-sale-19/"
  },
  {
    "price": "£250,000",
    "location": "Manchester",
    "title": "1 Bedroom Flat",
    "link": "https://repossessedhousesforsale.com/properties/2-bedroom-detached-house-for-sale-19/"
  }
]
```

## Notes
- The server reloads listings only when it starts. If you update `listings.json`, restart the server to load new data.
- The price field in `listings.json` should be a string (e.g., "£389,995").
- Use the Python scraper to keep your listings up to date.

