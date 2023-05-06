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
        <TableContainer sx={{ width: "90%" }}component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">Amount ($)</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Remarks</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.sort((transaction1, transaction2) => sortByDateThenById(transaction1, transaction2))
                        .map((transaction, key) => {
                            return (
                                <TableRow>
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