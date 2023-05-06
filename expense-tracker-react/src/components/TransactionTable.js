import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const TransactionTable = ({data}) => {
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
                    {data.map((transaction, key)=>{
                        return (
                            <TableRow>
                                <TableCell align="center">{transaction.name}</TableCell>
                                <TableCell align="center">{transaction.type}</TableCell>
                                <TableCell align="center">{transaction.amount}</TableCell>
                                <TableCell align="center">{transaction.date}</TableCell>
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