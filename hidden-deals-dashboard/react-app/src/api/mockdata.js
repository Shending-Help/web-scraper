export const mockListings = [
    { id: 1, name: 'Luxury Villa', location: 'Beverly Hills', price: 5000000, type: 'Villa', status: 'Available', bedrooms: 5, bathrooms: 6, area: 4500 },
    { id: 2, name: 'Downtown Condo', location: 'New York', price: 1200000, type: 'Condo', status: 'Sold', bedrooms: 2, bathrooms: 2, area: 1200 },
    { id: 3, name: 'Suburban House', location: 'Austin', price: 750000, type: 'House', status: 'Available', bedrooms: 4, bathrooms: 3, area: 2800 },
    { id: 4, name: 'Beachfront Property', location: 'Miami', price: 3200000, type: 'House', status: 'Pending', bedrooms: 3, bathrooms: 4, area: 3100 },
    { id: 5, name: 'Rustic Cabin', location: 'Montana', price: 450000, type: 'Cabin', status: 'Available', bedrooms: 2, bathrooms: 1, area: 900 },
    { id: 6, name: 'Penthouse Apartment', location: 'Chicago', price: 2100000, type: 'Apartment', status: 'Available', bedrooms: 3, bathrooms: 3, area: 2000 },
];

// Simulate API call
export const fetchListings = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: mockListings });
        }, 500); // Simulate network delay
    });
};