"use client"

import Histogram from "./Histogram";


interface ScoreDistributionProps {
  scores: number[];
  results: ResultItem[];
}

export default function ScoreDistribution({scores, results} : ScoreDistributionProps) {
  const calculateSummaryStatistics = (arr : number[]) => {
    if (arr.length === 0) {
      return {
        count: 0,
        sum: 0,
        mean: NaN,
        min: NaN,
        max: NaN,
        variance: NaN,
        stdDev: NaN,
      };
    }
  
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const mean = sum / arr.length;
  
    const min = Math.min(...arr);
    const max = Math.max(...arr);
  
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
    const stdDev = Math.sqrt(variance);
  
    return {
      count: arr.length,
      sum: sum.toFixed(3),
      mean: mean.toFixed(3),
      min: min.toFixed(3),
      max: max.toFixed(3),
      variance: variance.toFixed(4),
      stdDev: stdDev.toFixed(4),
    };
  }

  const scoresSummary = calculateSummaryStatistics(scores);

  return (
    <div className="flex flex-col justify-between">
      <Histogram top={results} scores={scores}/>
      <div className="flex-1">
        <ul className="text-sm">
          <li><b>Mean: </b>{scoresSummary.mean}</li>
          <li><b>Maximum: </b>{scoresSummary.max}</li>
          <li><b>Minimum: </b>{scoresSummary.min}</li>
          <li><b>Standard Deviation: </b>{scoresSummary.stdDev}</li>
        </ul>
      </div>
    </div>
  )
}