"use client"
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface Props {
  data: { price: any; _id: any; date: any }[];
}

export default class LineGraph extends PureComponent<Props> {

  render() {
    const { data } = this.props; // Destructure data from props
    const dataWithDiff = data.map((entry, index) => ({
      ...entry,
      percentageDiff: index > 0 ? ((entry.price - data[index - 1].price) / data[index - 1].price) * 100 : 0,
    }));
    console.log(data);
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={3}>
        <LineChart
          width={450}
          height={300}
          data={dataWithDiff}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" >
            <Label value="Date" offset={-20} position="insideBottom" />
          </XAxis>

          <YAxis label={{ value: 'Price', angle: -90,offset:-15, position: 'insideLeft', textAnchor: 'middle' }} />

          
          <Tooltip   formatter={(value, name, props) => {
              const percentage = props.payload.percentageDiff;
              const color = percentage > 0 ? 'red' : 'green';
              return (
                <div style={{ color }}>
                  {value}
                  <br/><br/>
                  <p style={{ color: '#8884d8' }} >Percentage:</p>
                  {percentage.toFixed(2)}%
                  
                </div>
              );
            }} />
          <Legend visibility='hidden' align="right"/>
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
          
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
