import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { Button, TextField, Typography, IconButton, Switch, Paper } from '@mui/material';
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
import FormHelperText from '@mui/material/FormHelperText';
import TransactionTable from '../components/TransactionTable';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { categoriesIn, categoriesOut } from '../categories';


const dayjs = require('dayjs')

function LogTransaction() {
    const [ amountInput, setAmountInput ] = useState("");
    const [ amountInputError, setAmountInputError ] = useState(false);
    const [ remarks, setRemarks ] = useState("");
    const [ type, setType ] = useState("out");
    const [ person, setPerson ] = useState("Wen Yi")
    const [ categories, setCategories ] = useState([]);
    const [ category, setCategory ] = useState("");
    const [ monthlyBreakdownData, setMonthlyBreakdownData ] = useState([]);
    const [ currentMonthRemaining, setCurrentMonthRemaining ] = useState(0);
    const [ switchChoice, setSwitchChoice ] = useState("Wen Yi");
    const [ categoryError, setCategoryError ] = useState(false);
    const [ amountInputErrorMessage, setAmountInputErrorMessage ] = useState("");
    const [ monthlyTransactions, setMonthlyTransactions ] = useState([]);
    const [ wensTrend, setWensTrend ] = useState([]);
    const [ tiansTrend, setTiansTrend ] = useState([]);
    

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }
      
      TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      };
      
      function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

    let now = dayjs();
    const [ transactionDate, setTransactionDate ] = useState(now);
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
        setAmountInputErrorMessage("Amount to be a number with at most 2 decimal points")
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
        if (event.target.value !== "None") {
            setCategoryError(false);
        }
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
        setAmountInput("");
        setCategory("");
        setType("out");
        setTransactionDate(now);
        setRemarks("")
    }

    const logTransaction = () => {
        if (amountInput === "") {
            setAmountInputError(true);
            setAmountInputErrorMessage("Amount cannot be empty");
        }
        if (category === ""){
            setCategoryError(true);
        }
        if (category !== "" && amountInput !== "") {
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
    }

    const getAllTransactions = () =>{
        axios.get("http://localhost:8000/transactions")
        .then((response)=> {
            const allTransactions = response.data.transactions
            console.log(allTransactions);
            const names = ["Wen Yi", "Tianyi"]
            const wensTrend = [];
            const tiansTrend = [];
            names.forEach((name)=>{
                const transactions = allTransactions.filter((transaction)=>{return transaction.name === name})
                let start = dayjs(transactions[0].date, "DD/MM/YYYY");
                while (start.isBefore(now.add(1, "month"))) {
                    const monthTransactions = transactions.filter((transaction)=>{return dayjs(transaction.date, "DD/MM/YYYY").isSame(start, 'month')});
                    let totalIncome = 0;
                    let totalExpense = 0;
                    monthTransactions.forEach((transaction)=>{
                        if (transaction.type === "in") {
                            totalIncome += transaction.amount;
                        } else {
                            if (transaction.category !== "Savings") {
                                totalExpense += transaction.amount;
                            }
                        }
                    })
                    let totalSavings = totalIncome - totalExpense;
                    const monthRecordObj = {
                        monthYear: start.format("MMM YYYY"),
                        totalIncome: Math.round(totalIncome*100)/100,
                        totalExpense: Math.round(totalExpense*100)/100,
                        totalSavings: Math.round(totalSavings*100)/100
                    }
                    name === "Wen Yi" ? wensTrend.push(monthRecordObj) : tiansTrend.push(monthRecordObj);
                    start = start.add(1, "month");
                }
            })
            console.log(wensTrend);
            console.log(tiansTrend);
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
            setMonthlyTransactions(response.data.transactions);
            let left = 0;
            response.data.transactions.forEach((transaction)=>{
                transaction.type === "in" ? left += transaction.amount : left -= transaction.amount
            })
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
                monthlyBreakdown.push({category: category, categoryTotal: Math.round(total*100)/100});
            })
            monthlyBreakdown.sort((a, b)=>{return (b.categoryTotal - a.categoryTotal)}).unshift({category:"Remaining", categoryTotal: Math.round(left*100)/100})
            setMonthlyBreakdownData(monthlyBreakdown);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(()=> {
        getCategories();
    }, [type]);

    useEffect(()=> {
        getAllTransactions();
    }, []);

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
                            <FormHelperText sx={{ marginBottom: 1 }} error={amountInputError}>{amountInputError ? amountInputErrorMessage : ""}</FormHelperText>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer sx={{ marginBottom: 1, marginLeft: 5 }} components={['DatePicker']}>
                                {/* <DatePicker disableFuture={true} label="Transaction Date" value={transactionDate} onChange={(newValue) => handleDateInput(newValue)} /> */}
                                <DatePicker label="Transaction Date" value={transactionDate} onChange={(newValue) => handleDateInput(newValue)} />
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
                        <FormControl error={categoryError}>
                            <InputLabel sx={{ marginLeft: 5 }} id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={handleCategoryChange}
                                sx={{ width: 200, marginLeft: 5 }}
                                
                            >
                                {type === "out" ? 
                                categoriesOut.map((category, key)=> (
                                    <MenuItem key={key} value={category}>{category}</MenuItem>
                                )) 
                                :
                                categoriesIn.map((category, key)=> (
                                    <MenuItem key={key} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                            <Box sx={{ marginBottom: 1, marginLeft: 5 }}>
                                <FormHelperText align="right" error>{categoryError ? "Please choose a category" : ""}</FormHelperText>
                            </Box>
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
                            <DatePicker minDate={dayjs().month(4).year(2023)} onChange={(newValue) => handleDateViewInput(newValue)} label={'Choose a month'} views={['month', 'year']} />
                            {/* <DatePicker minDate={dayjs().month(4).year(2023)} maxDate={now} onChange={(newValue) => handleDateViewInput(newValue)} label={'Choose a month'} views={['month', 'year']} /> */}
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
            <Box sx={{ width: "90%" }}>
                <Paper sx={{ width: "100%" }}>
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
                        >
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Month's transaction record" {...a11yProps(0)} />
                            <Tab label="Saving Trend" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Typography sx={{ marginBottom: 3, marginTop: 2 }} align="center" variant="h6"><strong>{currentMonthView}</strong>'s Transactions</Typography>
                            <TransactionTable data={monthlyTransactions}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Typography sx={{ marginBottom: 3, marginTop: 2 }} align="center" variant="h6">Saving trend</Typography>

                            Item Two
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            Item Three
                        </TabPanel>
                    </Box>
                </Paper>
            </Box>
            
        </Box>
    )
}

export default LogTransaction;