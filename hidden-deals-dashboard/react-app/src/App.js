// react-app/src/App.js
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { fetchListings } from './api/mockdata';
import ListingsTable from './components/ListingsTable';
import Filters from './components/Filters';

function App() {
    const [allListings, setAllListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const propertyTypes = useMemo(() => [...new Set(allListings.map(item => item.type))], [allListings]);
    const statuses = useMemo(() => [...new Set(allListings.map(item => item.status))], [allListings]);

    useEffect(() => {
        setLoading(true);
        fetchListings()
            .then(response => {
                setAllListings(response.data);
                setFilteredListings(response.data); // Initially show all
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch listings:", err);
                setError("Failed to load listings. Check console for details.");
                setLoading(false);
            });
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        let currentListings = [...allListings];

        if (searchTerm) {
            currentListings = currentListings.filter(listing =>
                listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                listing.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            currentListings = currentListings.filter(listing => listing.status === statusFilter);
        }

        if (typeFilter) {
            currentListings = currentListings.filter(listing => listing.type === typeFilter);
        }

        setFilteredListings(currentListings);
    }, [searchTerm, statusFilter, typeFilter, allListings]);

    if (loading) {
        return <p>Loading Hidden Deals...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="App">
            <h1>Hidden Deals Dashboard</h1>
            <Filters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                propertyTypes={propertyTypes}
                statuses={statuses}
            />
            <ListingsTable data={filteredListings} />
        </div>
    );
}

export default App;