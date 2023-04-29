import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';

function LogTransaction() {

    const [ amountInput, setAmountInput ] = useState("");
    const [ amountInputError, setAmountInputError ] = useState(false);
    const [ remarks, setRemarks ] = useState("");
    const [ transactionDate, setTransactionDate ] = useState(null);
    const [ type, setType ] = useState("in");
    const [ person, setPerson ] = useState("Wen Yi")
    const [ categories, setCategories ] = useState([]);
    const [ category, setCategory ] = useState("");

    function isNumeric(str) {
        return /^[0-9]*(\.[0-9]{0,2})?$/.test(str);
      }

    const checkAmountInput = (event) => {
        let input = event.target.value;
        setAmountInputError(!isNumeric(input));
        setAmountInput(input);
    }

    const handleTypeChange = (event) => {
        setCategory("");
        console.log(event.target.value);
        setType(event.target.value);
    }
    
    const handlePersonChange = (event) => {
        setPerson(event.target.value);
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    } 

    const handleDateInput = (newValue) => {
        setTransactionDate(newValue.format("DD/MM/YYYY").toString());
    }

    const getCategories = () => {
        axios.get(`http://127.0.0.1:8000/categories/${type}`)
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    const logTransaction = () =>{
        axios.post("http://127.0.0.1:8000/add-transaction", {
            name: person,
            type: type,
            amount: amountInput,
            date: transactionDate,
            category: category,
            remarks: remarks
        }).then((response) => {
            console.log(response);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(()=> {
        getCategories();
    }, [type]);

    return (
        <Box sx={{border: "1px solid red", display: "flex", justifyContent: "center", width: "100%", height: "100%"}}>
            <Box sx={{border: "1px solid blue", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", width: 500, height: 500}}>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Person</InputLabel>
                    <Select
                        value={person}
                        label="Person"
                        onChange={handlePersonChange}
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="Wen Yi">Wen Yi</MenuItem>
                        <MenuItem value="Tianyi">Tianyi</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1 }}>
                    <InputLabel error={amountInputError} htmlFor="outlined-adornment-amount">Amount $</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        label="Amount $"
                        onChange={(event)=> {checkAmountInput(event)}}
                        value={amountInput}
                        error={amountInputError}
                    />
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker disableFuture={true} label="Transaction Date" value={transactionDate} onChange={(newValue) => handleDateInput(newValue)} />
                    </DemoContainer>
                </LocalizationProvider>
                <TextField label="Remarks"  multiline={true} rows={2} value={remarks} onChange={(event)=> {setRemarks(event.target.value)}}/>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                    <Select
                        value={type}
                        label="Transaction Type"
                        onChange={handleTypeChange}
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="in">In</MenuItem>
                        <MenuItem value="out">Out</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        value={category}
                        label="Category"
                        onChange={handleCategoryChange}
                        sx={{ width: 200 }}
                    >
                        {categories.map((category, key)=> (
                            <MenuItem key={key} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={logTransaction}>Save Transaction</Button>
            </Box>
        </Box>
    )
}

export default LogTransaction;