import React from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface HistogramProps {
  top: ResultItem[];
  scores: number[];
}

export default function Histogram({top, scores}: HistogramProps) {

    // const text = top.map(t => `${t.token}, ${t.document}: ${t.section}`)
    const roundedScores = scores.map(s => s.toFixed(3))

    return (
      <Plot
        data={[{type: 'histogram', 
            x: roundedScores, 
            marker: {
              color: "rgb(59, 130, 246, 0.7)",
              line: {
                color: "rgb(59, 130, 246, 1)",
                width: 1
              }
            }, 
            name: "Score", 
            xbins: {
              end: 1,
              size: 0.01,
              start: 0
            }
          }, {
            type: 'histogram', 
            x: top.map(t => t.score.toFixed(3)),
            marker: {
              color: "rgba(100, 200, 102, 0.7)",
              line: {
                color: "rgba(100, 200, 102, 1)",
                width: 1
              }
            }, 
            name: "Top Score", xbins: {
              end: 1,
              size: 0.01,
              start: 0
            },
          },
        ]}
        layout={{
          height: 320,
          barmode: "overlay",
          title: {text: 'Distribution of Top 100 Similarity Scores'},
          xaxis: {
            title: {
                text: "Cosine Similarity Score of Result"
            }
          },
          yaxis: {
              title: {
                  text: "Count"
              }
          },
          margin: {
            l: 50,
            r: 0,
          },
          plot_bgcolor:"rgba(0,0,0,0)",
          paper_bgcolor:"rgba(0,0,0,0)",
        } }
      />
    );
}
