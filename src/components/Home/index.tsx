import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination, TableFooter } from '@material-ui/core';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
import axios from 'axios';

const Home = () => {
    const useStyles = makeStyles((theme) => ({
        root: {
            '&MuiTextInput-root': {
                margin: theme.spacing(1),
                width: '25ch'
            }
        },
        table: {
            width: 650
        }
    }));
    const classes = useStyles();
    const [rows, setRows] = useState<any[]>([]);
    const [mainData, setMainData] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searched, setSearched] = useState<string>("");
    const BASE_URL = `http://hn.algolia.com/api/v1/search_by_date?tags=story`;
    const handleSearch = (searchedVal: string) => {
        if (searchedVal != "") {
            const searchData = rows.length != 0 ? rows.filter((row) => {
                return ((row.title != null && row.title).toLowerCase().includes(searchedVal.toLowerCase()) ||
                    (row.url != null && row.url).toLowerCase().includes(searchedVal.toLowerCase()) ||
                    (row.author != null && row.author).toLowerCase().includes(searchedVal.toLowerCase()));
            }) : [];
            setRows(searchData);
        } else {
            setRows(mainData);
        }
    };



    const cancelSearch = () => {
        setSearched("");
        handleSearch(searched);
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchData = useCallback(async () => {
        await axios.get(BASE_URL)
            .then(data => {
                if (data) {
                    if (rows !== []) {
                        let newData = [];
                        newData = [...rows, ...data.data.hits];
                        setRows(newData);
                        setMainData(newData);
                    } else {
                        setRows(data.data.hits);
                        setMainData(data.data.hits);
                    }
                }
            })
            .catch(err => console.log("err", err));
    }, [rows]);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(() => {
        let interval = setInterval(async () => {
            await fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [rows, fetchData])

    return (
        <div>
            <b>Home Page</b>
            <Paper>
                <SearchBar
                    value={searched}
                    onChange={(searchVal) => handleSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                />
                <TableContainer >
                    <Table stickyHeader={true}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>URL</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Author</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length > 0 && (rowsPerPage > 0 ?
                                rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : rows).map(row => <TableRow>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.url}</TableCell>
                                    <TableCell>{row.created_at}</TableCell>
                                    <TableCell>{row.author}</TableCell>
                                </TableRow>)}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 25 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={rows.length > 0 ? rows.length : -1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default Home;