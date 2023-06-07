import { Typography } from '@mui/material';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter, ResponsiveContainer, BarChart} from 'recharts';
import Box from '@mui/material/Box';

function MonthlyTrend ({ trend }) {

    const formatTrend = () => {
        trend.forEach(element => {
          element["totalSavings"] = (element.wensTotalSavings + element.tiansTotalSavings).toFixed(2);
        });
        return trend;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{backgroundColor: "rgba(235,235,235,0.8)", padding: 2}}>
                  <Typography variant="subtitle1"><strong>{label}</strong></Typography>
                  <Typography>Wen Yi's Savings: ${payload[0].value}</ Typography>
                  <Typography>Wen Yi's Spending: ${payload[1].value}</ Typography>
                  <Typography>Tianyi's Savings: ${payload[2].value}</ Typography>
                  <Typography>Tianyi's Spending: ${payload[3].value}</ Typography>
                  <Typography>Combined Savings: ${payload[4].value}</ Typography>
                </Box>
        );
    }
      return null;
    };

    const signFormatter = (number) => {
      return `$${number}`;
    }

    return (
      <ResponsiveContainer width="100%" height={600}>
        <ComposedChart
          data={formatTrend()}
          barGap={10}
          margin={{
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="monthYear" type="category" />
          <YAxis domain={[0, dataMax => (Math.round(dataMax/1000) * 1000)]} type="number" tickFormatter={signFormatter} width={140} label={{ value: 'Amount ($)', angle: -90, position: 'center' }}/>
          <Tooltip content={<CustomTooltip/>} />
          <Legend />
          <Bar dataKey="wensTotalSavings" name="Wen Yi's Savings" barSize={50} fill="#759242" stackId="a" />
          <Bar dataKey="wensTotalExpense" name="Wen Yi's Spending" barSize={50} fill="#212517" stackId="a" />

          <Bar dataKey="tiansTotalSavings" name="Tianyi's Savings" barSize={50} fill="#DED3A6" stackId="b"/>
          <Bar dataKey="tiansTotalExpense" name="Tianyi's Spending" barSize={50} fill="#374709" stackId="b"/>

          <Line type="monotone" name="Combined Savings" dot={{r:5}} activeDot={{r:7}} strokeWidth={2} dataKey="totalSavings" stroke="#da6a00" />

        </ComposedChart>
      </ResponsiveContainer>
    );
}

export default MonthlyTrend;