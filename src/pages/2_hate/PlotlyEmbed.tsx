import React, { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

interface PlotlyEmbedProps {
  src: string;
  title?: string;
  height?: string | number;
  stackSubplots?: boolean;
}

const PlotlyEmbed: React.FC<PlotlyEmbedProps> = ({ src, title, height = 450, stackSubplots = false }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartLayout, setChartLayout] = useState<any | null>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number | string>(height);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Failed to fetch ${src}`);
        const html = await response.text();
        
        // Check if we accidentally fetched the SPA index.html (common on 404 in dev)
        if (html.includes('<!doctype html>') || html.includes('<div id="root">')) {
          throw new Error(`File not found or invalid format: ${src}. Received app index instead.`);
        }

        // Robust extraction using regex to handle variations in spacing and method names
        const plotCallRegex = /Plotly\.(newPlot|react|plot)\s*\(/i;
        const match = html.match(plotCallRegex);
        if (!match) {
          // Fallback: check if it's a JSON file directly
          try {
            const jsonData = JSON.parse(html);
            if (jsonData.data && jsonData.layout) {
              setChartData(jsonData.data);
              setChartLayout(jsonData.layout);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Not a JSON file
          }
          const snippet = html.substring(0, 200).replace(/[\n\r]/g, ' ');
          throw new Error(`Could not find Plotly plot call in HTML. Snippet: ${snippet}`);
        }
        
        const callIndex = match.index!;
        const openParenIndex = html.indexOf("(", callIndex);

        const findBalanced = (str: string, startChar: string, endChar: string, startIndex: number) => {
          let depth = 0;
          let inString = false;
          let escape = false;
          for (let i = startIndex; i < str.length; i++) {
            const char = str[i];
            if (escape) { escape = false; continue; }
            if (char === '\\') { escape = true; continue; }
            if (char === '"' && (i === 0 || str[i-1] !== '\\')) { inString = !inString; continue; }
            if (inString) continue;

            if (char === startChar) depth++;
            else if (char === endChar) {
              depth--;
              if (depth === 0) return i;
            }
          }
          return -1;
        };

        // Find data array [ ... ]
        const dataStartIndex = html.indexOf("[", openParenIndex);
        const dataEndIndex = findBalanced(html, "[", "]", dataStartIndex);
        if (dataStartIndex === -1 || dataEndIndex === -1) throw new Error("Could not find data array");
        const dataStr = html.substring(dataStartIndex, dataEndIndex + 1);

        // Find layout object { ... }
        // The layout is usually the next object after the data array
        const layoutStartIndex = html.indexOf("{", dataEndIndex);
        const layoutEndIndex = findBalanced(html, "{", "}", layoutStartIndex);
        if (layoutStartIndex === -1 || layoutEndIndex === -1) throw new Error("Could not find layout object");
        const layoutStr = html.substring(layoutStartIndex, layoutEndIndex + 1);

        // Replace NaN/Infinity which are invalid in standard JSON but common in Plotly outputs
        const sanitizeJson = (str: string) => {
          return str
            .replace(/:\s*NaN/g, ":null")
            .replace(/:\s*Infinity/g, ":null")
            .replace(/:\s*-Infinity/g, ":null")
            .replace(/\[\s*NaN/g, "[null")
            .replace(/,\s*NaN/g, ",null")
            .replace(/\[\s*Infinity/g, "[null")
            .replace(/,\s*Infinity/g, ",null")
            .replace(/\[\s*-Infinity/g, "[null")
            .replace(/,\s*-Infinity/g, ",null");
        };

        let data, layout;
        try {
          data = JSON.parse(sanitizeJson(dataStr));
        } catch (e) {
          console.error("Data Parse Error:", e);
          throw new Error("Failed to parse chart data. The file might be too large or corrupted.");
        }

        try {
          layout = JSON.parse(sanitizeJson(layoutStr));
        } catch (e) {
          console.error("Layout Parse Error:", e);
          // Layout is often less critical, we might be able to proceed with a default
          layout = {};
        }
        
        if (data && layout) {
          const isTable = data[0]?.type === 'table';
          
          let finalLayout = { ...layout };
          let finalHeight = typeof height === 'string' ? parseInt(height) : height;

          if (stackSubplots) {
            const yAxes = Object.keys(layout).filter(k => k.startsWith('yaxis'));
            const numSubplots = yAxes.length;
            
            if (numSubplots > 1) {
              const spacing = 0.08; 
              const plotHeight = (1 - spacing * (numSubplots - 1)) / numSubplots;
              
              let sortedAnnotations: any[] = [];
              if (layout.annotations && Array.isArray(layout.annotations)) {
                sortedAnnotations = [...layout.annotations].sort((a, b) => {
                  if (Math.abs(b.y - a.y) > 0.01) {
                    return b.y - a.y;
                  }
                  return a.x - b.x;
                });
              }

              for (let i = 0; i < numSubplots; i++) {
                const axisSuffix = i === 0 ? '' : (i + 1).toString();
                const yAxisKey = `yaxis${axisSuffix}`;
                const xAxisKey = `xaxis${axisSuffix}`;
                
                const top = 1 - i * (plotHeight + spacing);
                const bottom = top - plotHeight;
                
                if (finalLayout[yAxisKey]) {
                  finalLayout[yAxisKey].domain = [bottom, top];
                }
                if (finalLayout[xAxisKey]) {
                  finalLayout[xAxisKey].domain = [0, 1];
                }
                
                if (sortedAnnotations[i]) {
                  sortedAnnotations[i].x = 0.0; 
                  sortedAnnotations[i].xanchor = 'left';
                  sortedAnnotations[i].y = top + 0.01; 
                  sortedAnnotations[i].yanchor = 'bottom';
                  sortedAnnotations[i].font = { ...sortedAnnotations[i].font, size: 16, color: '#ffffff' };
                }
              }
              
              finalLayout.annotations = sortedAnnotations;
              finalHeight = numSubplots * 350; 
              finalLayout.height = finalHeight;
            }
          }

          const themedLayout = {
            ...finalLayout,
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            title: undefined, // Hide internal title as it's handled by the card header
            bargap: 0.05, // Decrease gap to make bars significantly wider
            bargroupgap: 0.05, // Decrease gap between grouped bars
            font: {
              ...finalLayout.font,
              color: '#ffffff',
              family: 'Inter, system-ui, sans-serif'
            },
            xaxis: finalLayout.xaxis ? {
              ...finalLayout.xaxis,
              gridcolor: '#2f3336',
              zerolinecolor: '#2f3336',
              tickfont: { color: '#71767b' },
              title: { ...finalLayout.xaxis?.title, font: { color: '#ffffff' } }
            } : undefined,
            yaxis: finalLayout.yaxis ? {
              ...finalLayout.yaxis,
              gridcolor: '#2f3336',
              zerolinecolor: '#2f3336',
              tickfont: { color: '#71767b' },
              title: { ...finalLayout.yaxis?.title, font: { color: '#ffffff' } }
            } : undefined,
            legend: {
              ...finalLayout.legend,
              font: { color: '#ffffff' },
              bgcolor: 'transparent'
            },
            margin: isTable ? { t: 40, r: 10, l: 10, b: 10 } : { t: 40, r: 20, l: 60, b: 60 },
            height: finalHeight,
            autosize: true
          };

          // Apply Theme to Data (colors)
          const themedData = data.map((trace: any) => {
            const newTrace = { ...trace };
            if (isTable && newTrace.header) {
              newTrace.header.fill = { color: '#1d9bf0' };
              newTrace.header.font = { color: '#ffffff', size: 12 };
              newTrace.cells.fill = { color: ['#16181c', '#000000'] };
              newTrace.cells.font = { color: '#ffffff', size: 11 };
              newTrace.cells.line = { color: '#2f3336' };
              newTrace.header.line = { color: '#2f3336' };
            }
            return newTrace;
          });

          setChartData(themedData);
          setChartLayout(themedLayout);
          setDynamicHeight(finalHeight);
        } else {
          throw new Error("Could not find Plotly data in HTML");
        }
      } catch (err) {
        console.error("PlotlyEmbed Error:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [src, height, stackSubplots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-zinc-900/50 rounded-xl" style={{ height: dynamicHeight }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-zinc-900/50 rounded-xl text-zinc-500 text-sm p-4 text-center" style={{ height: dynamicHeight }}>
        <div>
          <p>Error loading chart</p>
          <p className="text-xs mt-1 opacity-50">{src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl bg-black/20" style={{ height: dynamicHeight }}>
      {chartData && chartLayout && (
        <Plot
          data={chartData}
          layout={chartLayout}
          config={{ responsive: true, displaylogo: false }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      )}
    </div>
  );
};

export default PlotlyEmbed;
