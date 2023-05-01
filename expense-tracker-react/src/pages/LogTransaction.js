import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import MonthlyBreakdown from '../components/MonthlyBreakdown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const dayjs = require('dayjs')

function LogTransaction() {

    const [ amountInput, setAmountInput ] = useState("");
    const [ amountInputError, setAmountInputError ] = useState(false);
    const [ remarks, setRemarks ] = useState("");
    const [ transactionDate, setTransactionDate ] = useState(null);
    const [ type, setType ] = useState("out");
    const [ person, setPerson ] = useState("Wen Yi")
    const [ categories, setCategories ] = useState([]);
    const [ category, setCategory ] = useState("");
    const [ monthlyBreakdownData, setMonthlyBreakdownData ] = useState([]);
    const [ currentMonthRemaining, setCurrentMonthRemaining ] = useState(0);
    const [ switchChoice, setSwitchChoice ] = useState("Wen Yi") 
    
    let now = dayjs();
    const [ currentMonthView, setCurrentMonthView ] = useState(now.month(now.month()).year(now.year()).format("MMM-YYYY").toString());

    const handleMonthAdd = () => {
        setCurrentMonthView(dayjs(currentMonthView, "MMM-YYYY").add(1, 'month').format("MMM-YYYY").toString());
    }

    const handleMonthSubtract = () => {
        setCurrentMonthView(dayjs(currentMonthView, "MMM-YYYY").subtract(1, 'month').format("MMM-YYYY").toString());
    }

    const handleDateViewInput = (newValue) =>{
        setCurrentMonthView(newValue.format("MMM-YYYY").toString());
    }

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
        setTransactionDate(newValue);
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

    const resetForm = () => {
        setAmountInput(0);
        setCategory("");
        setType("out");
        setTransactionDate(null);
        setRemarks("")
    }

    const logTransaction = () => {
        axios.post("http://127.0.0.1:8000/add-transaction", {
            name: person,
            type: type,
            amount: amountInput,
            date: transactionDate.format("DD/MM/YYYY").toString(),
            category: category,
            remarks: remarks
        }).then((response) => {
            console.log(response);
        }).catch((error)=>{
            console.log(error);
        }).finally( () => {
            resetForm();
            getMonthTransaction();
        })
    }

    const getMonthTransaction = () => {
        axios.get("http://localhost:8000/transactions", {
            params: {
                month_year: currentMonthView,
                person: switchChoice
            }
        })
        .then((response)=> {
            console.log(response.data);
            let left = 0;
            response.data.transactions.forEach((transaction)=>{
                transaction.type === "in" ? left += transaction.amount : left -= transaction.amount
            })
            console.log(left);
            if (now.format("MMM-YYYY") === response.data.month_year) {
                setCurrentMonthRemaining(Math.round(left*100)/100);
            }
            let monthlyCategories = [];
            response.data.transactions.filter((transaction)=>transaction.type === "out").forEach((transaction)=> {
                if (!monthlyCategories.includes(transaction.category)) {
                    monthlyCategories.push(transaction.category);
                }
            })
            let monthlyBreakdown = [];
            monthlyCategories.forEach((category)=>{
                let total = 0;
                response.data.transactions.filter((transaction)=>transaction.category === category).forEach((transaction)=>{
                    total += transaction.amount;
                })
                monthlyBreakdown.push({category: category, categoryTotal: total});
            })
            monthlyBreakdown.sort((a, b)=>{return (b.categoryTotal - a.categoryTotal)}).unshift({category:"Remaining", categoryTotal: Math.round(left*100)/100})
            console.log(monthlyBreakdown);
            setMonthlyBreakdownData(monthlyBreakdown);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(()=> {
        getCategories();
    }, [type]);

    useEffect(()=> {
        getMonthTransaction();
    }, [currentMonthView, switchChoice]);

    const handleSwitchChange = (event) => {
        event.target.checked ? setSwitchChoice("Tianyi") : setSwitchChoice("Wen Yi");
      };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%", height: "100%", flexWrap: "wrap"}}>
            <Box sx={{ marginTop: 3, width:"45%", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center" }}>
                <Typography sx={{ marginTop: 1 }}variant="h3">{now.format("MMMM-YYYY").toString()}</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} sx={{ width: "100%", height: "75%" }}> 
                    <Box sx={{ display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "flex-start", width: "50%", height: 300}}>
                        <FormControl sx={{ marginTop: 2 }}>
                            <InputLabel sx={{ marginLeft: 5}} id="demo-simple-select-label">Person</InputLabel>
                            <Select
                                value={person}
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
                                value={amountInput}
                                error={amountInputError}
                            />
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer sx={{ marginBottom: 1, marginLeft: 5 }} components={['DatePicker']}>
                                <DatePicker disableFuture={true} label="Transaction Date" value={transactionDate} onChange={(newValue) => handleDateInput(newValue)} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "flex-start", width: "50%", height: 300}}>
                        <FormControl>
                            <InputLabel sx={{ marginLeft: 5 }} id="demo-simple-select-label">Transaction Type</InputLabel>
                            <Select
                                value={type}
                                label="Transaction Type"
                                onChange={handleTypeChange}
                                sx={{ width: 200, marginBottom: 1, marginLeft: 5 }}
                            >
                                <MenuItem value="in">In</MenuItem>
                                <MenuItem value="out">Out</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel sx={{ marginLeft: 5 }} id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={handleCategoryChange}
                                sx={{ width: 200, marginLeft: 5 }}
                            >
                                {categories.map((category, key)=> (
                                    <MenuItem key={key} value={category}>{category}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField label="Remarks" sx={{ marginTop:1, marginBottom: 1, marginLeft: 5 }} multiline={true} rows={2} value={remarks} onChange={(event)=> {setRemarks(event.target.value)}}/>
                    </Box>
                </Stack>
                <Button sx={{ marginBottom: 3, width: 150 }} variant="outlined" onClick={logTransaction}>Save Transaction</Button>
            </Box>
            <Box sx={{ marginTop: 3, width:"45%", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h5">Breakdown for <strong>{currentMonthView}</strong></Typography>
                <Stack direction="row" spacing={2}>
                    <IconButton disabled={dayjs(currentMonthView, "MMM-YYYY").subtract(1, 'month').isBefore(dayjs().month(3).year(2023))} onClick={handleMonthSubtract}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
                            <DatePicker minDate={dayjs().month(4).year(2023)} maxDate={now} onChange={(newValue) => handleDateViewInput(newValue)} label={'Choose a month'} views={['month', 'year']} />
                        </DemoContainer>
                    </LocalizationProvider>
                    <IconButton disabled={dayjs(currentMonthView, "MMM-YYYY").add(1, 'month').isAfter(now)} onClick={handleMonthAdd}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Wen Yi</Typography>
                    <Switch onChange={handleSwitchChange} inputProps={{ 'aria-label': 'ant design' }} />
                    <Typography>Tianyi</Typography>
                </Stack>
                <MonthlyBreakdown data={monthlyBreakdownData}/>
            </Box>
            
        </Box>
    )
}

export default LogTransaction;