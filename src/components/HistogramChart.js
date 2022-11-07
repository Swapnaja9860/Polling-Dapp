import React, { Component } from 'react'
import Chart from 'react-google-charts'

// const data = [
//   ["Element", "Density", { role: "style" }],
//   ["Copper", 8.94, "#b87333"], // RGB value
//   ["Silver", 10.49, "silver"], // English color name
//   ["Gold", 19.3, "gold"],
//   ["Platinum", 21.45, "color: #e5e4e2"] // CSS-style declaration
// ];

const data = [
  ["Options", "Vote", { role: "style" }],
  ["Copper", 8.94, "#b87333"],
  ["Silver", 10.49, "silver"], 
  ["Gold", 19.3, "gold"],
  ["Platinum", 21.45, "color: #e5e4e2"] // CSS-style declaration
];

function HistogramChart(props) {
  
    var dataPoints = [["Options", "Vote", { role: "style" }]]
    props.votes.map(vote => {
            var dataPoint=[];
            dataPoint.push(vote.option);
            dataPoint.push(Number(vote.count));
            dataPoint.push('#00008B');
            dataPoints.push(dataPoint);
        })

    return (
      <div className="App">
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={dataPoints}
        />
      </div>
    );
}
export default HistogramChart

