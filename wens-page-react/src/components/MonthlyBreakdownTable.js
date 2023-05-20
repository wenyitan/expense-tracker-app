import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";

function MonthlyBreakdownTable ( {data} ) {

    const countTotal = (data) => {
        return data.map((cat)=> {
            return cat.categoryTotal
        }).reduce((acc, curVal) => {
            return acc + curVal;
        }, 0).toFixed(2);
    }

    return (
        <TableContainer sx={{ marginBottom: 3, width: "auto" }} component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow> 
                        <TableCell variant="head" align="center"><strong>No.</strong></TableCell>
                        <TableCell variant="head" align="left"><strong>Category</strong></TableCell>
                        <TableCell sx={{ paddingRight: 4 }} variant="head" align="right"><strong>Amount ($)</strong></TableCell>
                        <TableCell sx={{ paddingRight: 4 }} variant="head" align="right"><strong>Percentage (%)</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.sort((cat1, cat2)=> {return cat2.categoryTotal - cat1.categoryTotal})
                        .map((category, key)=> {
                            return (
                                <>
                                    {category.category.startsWith("Food") ? 
                                        <Tooltip arrow placement="right" title={<Typography variant="subtitle2">Total amount spent on food: ${countTotal(data.filter((cat)=> {return cat.category.startsWith("Food")}))}</Typography>}>
                                            <TableRow hover key={key}>
                                            <TableCell align="center">{key+1}</TableCell>
                                            <TableCell align="left">{category.category}</TableCell>
                                            <TableCell sx={{ paddingRight: 5 }} align="right">{category.categoryTotal.toFixed(2)}</TableCell>
                                            <TableCell sx={{ paddingRight: 5 }} align="right">{(category.categoryTotal*100/(countTotal(data))).toFixed(2)}%</TableCell>
                                        </TableRow>
                                        </Tooltip> : 
                                        <TableRow hover key={key}>
                                            <TableCell align="center">{key+1}</TableCell>
                                            <TableCell align="left">{category.category}</TableCell>
                                            <TableCell sx={{ paddingRight: 5 }} align="right">{category.categoryTotal.toFixed(2)}</TableCell>
                                            <TableCell sx={{ paddingRight: 5 }} align="right">{(category.categoryTotal*100/(countTotal(data))).toFixed(2)}%</TableCell>
                                        </TableRow> }
                                </>
                            )}
                        )}
                    <TableRow>
                        <TableCell align='right' colSpan={2}><strong>Total Spend:</strong></TableCell>
                        <TableCell sx={{ paddingRight: 5 }} align='right'>${countTotal(data.filter((cat)=> {return cat.category !== "Savings"}))}</TableCell>
                    </TableRow>
                </TableBody>

            </Table>

        </TableContainer>
    )
}

export default MonthlyBreakdownTable;