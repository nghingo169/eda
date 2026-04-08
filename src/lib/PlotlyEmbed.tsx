import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Vì chúng ta sẽ vẽ bằng React, nên cần cài thư viện này:
// npm install react-plotly.js plotly.js
// npm install --save-dev @types/react-plotly.js @types/plotly.js
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';

interface PlotlyEmbedProps {
  src: string; 
  height?: number | string;
  // Prop này không còn cần thiết cho JSON, nên mình comment lại để code không bị lỗi
  // stackSubplots?: boolean; 
}

// Hàm bổ trợ để tự động chuyển đổi đường dẫn .html thành .json
const getJsonPath = (src: string): string => {
  const baseUrl = import.meta.env.BASE_URL;
  const jsonSrc = src.replace('.html', '.json');
  return `${baseUrl}${jsonSrc}`;
};

export default function PlotlyEmbed({ src, height = 400 }: PlotlyEmbedProps) {
  const [plotData, setPlotData] = useState<any>(null); // Lưu trữ dữ liệu JSON (data, layout)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    
    // Tải dữ liệu JSON từ public/
    fetch(getJsonPath(src))
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setPlotData(data); // `data` là object chứa { data, layout } xuất từ Python
      })
      .catch((err) => {
        console.error("Error loading chart JSON:", err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [src]);

  // Cấu hình layout bổ sung để làm cho biểu đồ responsive và đẹp hơn trong UI tối
  const responsiveLayout = plotData?.layout ? {
    ...plotData.layout, // Giữ lại layout gốc từ Python
    autosize: true, // Ép buộc biểu đồ tự động co giãn theo container
    paper_bgcolor: 'transparent', // Xóa nền trắng mặc định của Plotly
    plot_bgcolor: 'transparent', // Xóa nền trắng mặc định của Plotly
    margin: { t: 30, r: 20, b: 30, l: 30 }, // Căn lề cho gọn, tránh bị cắt chữ
    
    // Tùy chọn: Tùy chỉnh màu chữ để phù hợp với theme tối của bạn
    font: { color: '#fafafa', family: 'var(--font-sans)' },
    xaxis: { ...plotData.layout.xaxis, gridcolor: '#444' }, // Làm mờ đường lưới
    yaxis: { ...plotData.layout.yaxis, gridcolor: '#444' },
  } : {};

  // Cấu hình config để ẩn thanh công cụ rườm rà của Plotly
  const plotConfig: Partial<Plotly.Config> = {
    displayModeBar: true, // Ẩn hoàn toàn menu (zoom, pan, v.v.)
    responsive: true, // Đảm bảo biểu đồ co giãn khi resize cửa sổ trình duyệt
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }} className="rounded-xl overflow-hidden bg-zinc-900/50">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-800/40 animate-pulse backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3 bg-black/40 px-6 py-4 rounded-2xl border border-zinc-700/50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs text-blue-400/80 font-bold tracking-[0.2em] uppercase">Loading Chart</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <p className="text-sm text-red-400">Failed to load chart data. Make sure the JSON file exists.</p>
        </div>
      )}
      
      {!isLoading && !error && plotData && (
        <Plot
          data={plotData.data} // Dữ liệu các trace từ JSON
          layout={responsiveLayout} // Layout đã được tùy chỉnh
          config={plotConfig} // Cấu hình bổ sung
          useResizeHandler={true} // Bật tính năng co giãn tự động của thư viện
          style={{ width: '100%', height: '100%' }} // Đảm bảo Plot component fill đầy div cha
          className="rounded-xl"
        />
      )}
    </div>
  );
}