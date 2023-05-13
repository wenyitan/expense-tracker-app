import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const dayjs = require('dayjs')

const TransactionTable = ({data}) => {

    const sortByDateThenById = (transaction1, transaction2) => {
        if (dayjs(transaction1.date, "DD/MM/YYYY").isBefore(dayjs(transaction2.date, "DD/MM/YYYY"))) return 1
        if (dayjs(transaction1.date, "DD/MM/YYYY").isAfter(dayjs(transaction2.date, "DD/MM/YYYY"))) return -1 
        if (transaction1.id > transaction2.id) return -1
        if (transaction1.id < transaction2.id) return 1
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.sort((transaction1, transaction2) => sortByDateThenById(transaction1, transaction2))
                        .map((transaction, key) => {
                            return (
                                <TableRow hover key={key}>
                                    <TableCell align="center">{key+1}.</TableCell>
                                    <TableCell align="center">{transaction.name}</TableCell>
                                    <TableCell align="center">{transaction.type.charAt(0).toUpperCase() + transaction.type.substring(1)}</TableCell>
                                    <TableCell align="center">${transaction.amount}</TableCell>
                                    <TableCell align="center">{dayjs(transaction.date, "DD/MM/YYYY").format("DD-MMM-YYYY").toString()}</TableCell>
                                    <TableCell align="center">{transaction.category}</TableCell>
                                    <TableCell align="center">{transaction.remarks}</TableCell>
                                </TableRow>
                            )
                    })}
                </TableBody>

            </Table>

        </TableContainer>
    
    );
}

export default TransactionTable;