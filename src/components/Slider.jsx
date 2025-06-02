import React, { useState } from 'react';
import Text from './Text';
const Slider = ({ min = 0, max = 100, value, onChange = () => {} }) => {
    // 將 value 映射到 0-100 範圍
    const percent = ((value - min) / (max - min)) * 100;
    const thumbSize = 12 + (percent / 100) * 32; // 12px 到 32px

    return (
        
            <div className="w-full">
                <label className="block mb-4"><Text type='subheading'>筆刷大小</Text></label>

                <div className="relative">
                    {/* 滑軌 */}
                    <div className="w-full h-2 bg-gray-300 rounded-full"></div>

                    {/* 動態圓形 */}
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-blue-500 rounded-full"
                        style={{
                            left: `${percent}%`,
                            width: `${thumbSize}px`,
                            height: `${thumbSize}px`,
                            transition: 'width 0.1s ease, height 0.1s ease',
                        }}
                    />

                    {/* 滑塊輸入 */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={onChange}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
       
    );
};

export default Slider;