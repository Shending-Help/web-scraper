import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';

const ListingsTable = ({ data }) => {
    const columns = useMemo(
        () => [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Location', accessor: 'location' },
            {
                Header: 'Price',
                accessor: 'price',
                Cell: ({ value }) => `$${value.toLocaleString()}`,
            },
            { Header: 'Type', accessor: 'type' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'Bedrooms', accessor: 'bedrooms' },
            { Header: 'Bathrooms', accessor: 'bathrooms' },
            { Header: 'Area (sqft)', accessor: 'area' },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    if (!data || data.length === 0) {
        return <p>No listings found.</p>;
    }

    return (
        <table {...getTableProps()} style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ccc' }}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                style={{
                                    borderBottom: '2px solid #ddd',
                                    background: '#f2f2f2',
                                    padding: '10px',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                            >
                                {column.render('Header')}
                                <span>
                                    {column.isSorted
                                        ? column.isSortedDesc
                                            ? ' 🔽'
                                            : ' 🔼'
                                        : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #eee',
                                    }}
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ListingsTable;