import requests
from bs4 import BeautifulSoup
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

URL = "https://repossessedhousesforsale.com/properties/"
OUTPUT_FILE = "listings.json"

def fetch_page_content(url):
    """Fetches content from the given URL."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)
        logging.info(f"Successfully fetched content from {url}")
        return response.text
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching {url}: {e}")
        return None

def parse_property_data(html_content):
    """Parses property data from HTML content."""
    if not html_content:
        return []

    soup = BeautifulSoup(html_content, 'html.parser')
    listings_data = []

    # Find the main container holding all property listings
    # Based on inspection, each property item is within a div with itemscope and itemtype="https://schema.org/House"
    # and these are children of div#map-properties
    property_list_container = soup.find('div', id='map-properties')

    if not property_list_container:
        logging.warning("Could not find the main property list container (div#map-properties).")
        return []

    # Find all individual property divs within the container
    # These divs have `itemscope` and `itemtype="https://schema.org/House"`
    # A more specific selector might be needed if this is too broad, but it works for the current structure.
    # Example parent div for each item:
    # <div itemscope="" itemtype="https://schema.org/House" class="flex flex-col xl:flex-row px-8 md:px-11 pb-[1.781rem] border-b border-[#8694A01A] gap-4 xl:gap-[1.438rem] items-start">
    
    properties = property_list_container.find_all('div', itemscope=True, itemtype="https://schema.org/House")
    
    if not properties:
        logging.warning("No individual property items found within the container.")
        return []

    logging.info(f"Found {len(properties)} potential property listings.")

    for prop_div in properties:
        try:
            title_tag = prop_div.find('div', itemprop='name')
            title_anchor = title_tag.find('a', class_='archive-properties-title-link') if title_tag else None
            title = title_anchor.get_text(strip=True) if title_anchor else None
            link = title_anchor['href'] if title_anchor and title_anchor.has_attr('href') else None

            price_tag = prop_div.find('div', itemprop='value')
            price = price_tag.get_text(strip=True) if price_tag else None
            if price: # Clean up price string
                price = "£" + price.replace(",", "")

            location_tag = prop_div.find('span', itemprop='address')
            location = location_tag.get_text(strip=True) if location_tag else None
            
            # Ensure all essential data is present
            if title and price and location and link:
                listings_data.append({
                    "title": title,
                    "price": price,
                    "location": location,
                    "link": link
                })
                logging.debug(f"Extracted: {title}, {price}, {location}, {link}")
            else:
                missing_fields = []
                if not title: missing_fields.append("title")
                if not price: missing_fields.append("price")
                if not location: missing_fields.append("location")
                if not link: missing_fields.append("link")
                logging.warning(f"Skipping a listing due to missing fields: {', '.join(missing_fields)}")

        except AttributeError as e:
            logging.error(f"Error parsing a property item: {e}. Structure might have changed. Item HTML: {prop_div.prettify()[:500]}")
        except Exception as e:
            logging.error(f"An unexpected error occurred while parsing a property: {e}")
            
    return listings_data

def save_to_json(data, filename):
    """Saves data to a JSON file."""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        logging.info(f"Successfully saved {len(data)} listings to {filename}")
    except IOError as e:
        logging.error(f"Error saving data to {filename}: {e}")

if __name__ == "__main__":
    logging.info("Starting scraper...")
    html_content = fetch_page_content(URL)

    if html_content:
        properties = parse_property_data(html_content)
        if properties:
            save_to_json(properties, OUTPUT_FILE)
        else:
            logging.warning("No property data was extracted.")
    else:
        logging.error("Failed to fetch page content. Scraper terminated.")

    logging.info("Scraper finished.")