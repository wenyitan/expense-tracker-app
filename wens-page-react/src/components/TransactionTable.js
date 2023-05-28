import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import { categoriesIn, categoriesOut } from '../categories';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const dayjs = require('dayjs')

const TransactionTable = ({data, toCall}) => {

    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);

    const [ editTransactionId, setEditTransactionId ] = useState();
    const [ editPerson, setEditPerson ] = useState();
    const [ editDate, setEditDate ] = useState();
    const [ editAmount, setEditAmount ] = useState();
    const [ editCategory, setEditCategory ] = useState();
    const [ editTransactionType, setEditTransactionType ] = useState();
    const [ editRemarks, setEditRemarks ] = useState();

    const [ amountInputError, setAmountInputError ] = useState(false);
    const [ amountInputErrorMessage, setAmountInputErrorMessage ] = useState("");
    const [ categoryError, setCategoryError ] = useState(false);

    const [ deleteId, setDeleteId ] = useState();

    const handlePersonChange = (event) => {
        setEditPerson(event.target.value);
    }

    function isNumeric(str) {
        return /^[0-9]*(\.[0-9]{0,2})?$/.test(str);
      }

    const checkAmountInput = (event) => {
        let input = event.target.value;
        setAmountInputError(!isNumeric(input));
        setEditAmount(input);
        setAmountInputErrorMessage("Amount to be a number with at most 2 decimal points")
    }

    const handleCategoryChange = (event) => {
        if (event.target.value !== "None") {
            setCategoryError(false);
        }
        setEditCategory(event.target.value);
    } 

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
    }

    const handleEditClick = (transactionId) => {
        axios.get(`http://localhost:9001/api/v1/expense-tracker/transactions/${transactionId}`)
            .then((response)=>{
                console.log(response.data);
                setEditTransactionType(response.data.transactionType);
                setEditAmount(response.data.amount);
                setEditCategory(response.data.category);
                setEditDate(dayjs(response.data.date, "DD/MM/YYYY"));
                setEditPerson(response.data.person);
                setEditRemarks(response.data.remarks);
                setEditTransactionId(transactionId);
            })
            .catch((error)=> {
                console.log(error);
            })
            .finally(()=> {
                setEditDialogOpen(true);
            });
    }

    const handleDateInput = (newValue) => {
        setEditDate(newValue);
    }

    const handleEditClose = () => {
        setEditDialogOpen(false);
    };

    const handleTypeChange = (event) => {
        setEditCategory("");
        setEditTransactionType(event.target.value);
    }

    const sortByDateThenById = (transaction1, transaction2) => {
        if (dayjs(transaction1.date, "DD/MM/YYYY").isBefore(dayjs(transaction2.date, "DD/MM/YYYY"))) return 1
        if (dayjs(transaction1.date, "DD/MM/YYYY").isAfter(dayjs(transaction2.date, "DD/MM/YYYY"))) return -1 
        if (transaction1.id > transaction2.id) return -1
        if (transaction1.id < transaction2.id) return 1
    }

    const handleSaveChanges = () => {
        if (editAmount === "") {
            setAmountInputError(true);
            setAmountInputErrorMessage("Amount cannot be empty");
        }
        if (editCategory === ""){
            setCategoryError(true);
        }
        if (editCategory !== "" && editAmount !== "") {
            axios.put(`http://localhost:9001/api/v1/expense-tracker/transactions/${editTransactionId}`, {
                person: editPerson,
                transactionType: editTransactionType,
                amount: editAmount,
                date: editDate.format("DD/MM/YYYY").toString(),
                category: editCategory,
                remarks: editRemarks
            }).then((response) => {
                console.log(response);
            }).catch((error)=>{
                console.log(error);
            }).finally(() => {
                setEditDialogOpen(false);
                toCall();
            })
        }
    }

    const handleDelete = () => {
        console.log(deleteId);
        axios.delete(`http://localhost:9001/api/v1/expense-tracker/transactions/${deleteId}`)
            .then((response)=> {
                console.log(response);
            })
            .catch((error)=> {
                console.log(error);
            })
            .finally(()=> {
                setDeleteDialogOpen(false);
                toCall();
            })
    }

    const handleDeleteClick = (transactionId) => {
        setDeleteDialogOpen(true);
        setDeleteId(transactionId);
    }

    return (
        <TableContainer sx={{ marginBottom: 3, width: "100%" }} component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow> 
                        <TableCell variant="head" align="center">No.</TableCell>
                        <TableCell variant="head" align="center">Name</TableCell>
                        <TableCell variant="head" align="center">Type</TableCell>
                        <TableCell variant="head" align="center">Amount ($)</TableCell>
                        <TableCell variant="head" align="center">Date</TableCell>
                        <TableCell variant="head" align="center">Category</TableCell>
                        <TableCell variant="head" align="center">Remarks</TableCell>
                        <TableCell variant="head" align="center">Edit</TableCell>
                        <TableCell variant="head" align="center">Delete</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.sort((transaction1, transaction2) => sortByDateThenById(transaction1, transaction2))
                        .map((transaction, key) => {
                            return (
                                <TableRow hover key={key}>
                                    <TableCell align="center">{key+1}.</TableCell>
                                    <TableCell align="center">{transaction.person}</TableCell>
                                    <TableCell align="center">{transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.substring(1)}</TableCell>
                                    <TableCell align="center">${transaction.amount}</TableCell>
                                    <TableCell align="center">{dayjs(transaction.date, "DD/MM/YYYY").format("DD-MMM-YYYY").toString()}</TableCell>
                                    <TableCell align="center">{transaction.category}</TableCell>
                                    <TableCell align="center">{transaction.remarks}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => {handleEditClick(transaction.transactionId)}} size="small">
                                            <EditOutlinedIcon fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => {handleDeleteClick(transaction.transactionId)}} size="small">
                                            <DeleteOutlineIcon fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                    })}
                </TableBody>
            </Table>
            <Dialog fullWidth maxWidth="md" open={editDialogOpen} onClose={handleEditClose} >
                <DialogTitle align="center">Edit Transaction</DialogTitle>
                <DialogContent sx={{display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center"}}>
                    <DialogContentText sx={{marginBottom: 2}}>
                        You can edit the transaction here.
                    </DialogContentText>
                    <Box sx={{display: "flex", flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
                        <Box sx={{display: "flex", flexDirection:"column", alignItems: "flex-start", justifyContent: "center"}}>
                            <FormControl sx={{ marginTop: 2 }}>
                                <InputLabel sx={{ marginLeft: 5}} id="demo-simple-select-label">Person</InputLabel>
                                <Select
                                    value={editPerson}
                                    label="Person"
                                    onChange={handlePersonChange}
                                    sx={{ width: 200, marginBottom: 1, marginLeft: 5}}
                                >
                                    <MenuItem value="Wen Yi">Wen Yi</MenuItem>
                                    <MenuItem value="Tianyi">Tianyi</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ marginLeft: 5 }}>
                                <InputLabel error={amountInputError} htmlFor="outlined-adornment-amount">Amount $</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    label="Amount $"
                                    onChange={(event)=> {checkAmountInput(event)}}
                                    value={editAmount}
                                    error={amountInputError}
                                />
                                <FormHelperText sx={{ marginBottom: 1 }} error={amountInputError}>{amountInputError ? amountInputErrorMessage : ""}</FormHelperText>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer sx={{ marginBottom: 1, marginLeft: 5 }} components={['DatePicker']}>
                                    <DatePicker label="Transaction Date" value={editDate} onChange={(newValue) => handleDateInput(newValue)} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>
                        <Box sx={{display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center"}}>
                            <FormControl>
                                <InputLabel sx={{ marginLeft: 5 }} id="demo-simple-select-label">Transaction Type</InputLabel>
                                <Select
                                    value={editTransactionType}
                                    label="Transaction Type"
                                    onChange={handleTypeChange}
                                    sx={{ width: 200, marginBottom: 1, marginLeft: 5 }}
                                >
                                    <MenuItem value="in">In</MenuItem>
                                    <MenuItem value="out">Out</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl error={categoryError}>
                                <InputLabel sx={{ marginLeft: 5 }} id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    value={editCategory}
                                    label="Category"
                                    onChange={handleCategoryChange}
                                    sx={{ width: 200, marginLeft: 5 }}
                                    
                                >
                                    {editTransactionType === "out" ? 
                                        categoriesOut.map((category, key)=> (
                                            <MenuItem key={key} value={category}>{category}</MenuItem>
                                        )) 
                                        :
                                        categoriesIn.map((category, key)=> (
                                            <MenuItem key={key} value={category}>{category}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <Box sx={{ marginBottom: 1, marginLeft: 5 }}>
                                    <FormHelperText align="right" error>{categoryError ? "Please choose a category" : ""}</FormHelperText>
                                </Box>
                            </FormControl>
                        <TextField label="Remarks" sx={{ marginTop:1, marginBottom: 1, marginLeft: 5 }} multiline={true} rows={2} value={editRemarks} onChange={(event)=> {setEditRemarks(event.target.value)}}/>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{display: "flex", flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
                    <Button onClick={handleSaveChanges}>Save Edit</Button>
                    <Button onClick={handleEditClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleEditClose} >
                <DialogTitle align="center">Delete Transaction?</DialogTitle>
                <DialogContent sx={{display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center"}}>
                    <DialogContentText>
                        Are you sure you want to delete this transaction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{display: "flex", flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
                    <Button onClick={handleDelete}>Delete</Button>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    
    );
}

export default TransactionTable;