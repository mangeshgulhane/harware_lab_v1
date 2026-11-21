import React from 'react';
import { BREADBOARD_WIDTH, BREADBOARD_HEIGHT, BREADBOARD_PIN_INFO } from '../../data/boardData';

const Breadboard: React.FC = () => {
    // Constants for rendering, mirroring generateBreadboardPins logic
    const numRows = 30;
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    const rowSpacing = 12.7;
    const colSpacing = 12.7;

    // Horizontal (unchanged)
    const pinAreaWidth = (numRows - 1) * rowSpacing;
    const startX = (BREADBOARD_WIDTH - pinAreaWidth) / 2;
    
    // --- Vertical Positioning for Rendering ---
    const vMargin = 20;
    const railToBlockGap = 15;
    const pinBlockHeight = 4 * colSpacing;
    const gutterHeight = 18;

    const railTopY1 = vMargin;
    const railTopY2 = vMargin + colSpacing;
    const topBlockStartY = railTopY2 + railToBlockGap;
    const topBlockEndY = topBlockStartY + pinBlockHeight;
    const bottomBlockStartY = topBlockEndY + gutterHeight;
    const bottomBlockEndY = bottomBlockStartY + pinBlockHeight;
    const railBottomY1 = bottomBlockEndY + railToBlockGap;
    const railBottomY2 = railBottomY1 + colSpacing;
    const centerY = topBlockEndY + (gutterHeight / 2);

    return (
        <svg width={BREADBOARD_WIDTH} height={BREADBOARD_HEIGHT} viewBox={`0 0 ${BREADBOARD_WIDTH} ${BREADBOARD_HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width={BREADBOARD_WIDTH} height={BREADBOARD_HEIGHT} rx="8" fill="#F7F7F7"/>
            <rect x="5" y="5" width={BREADBOARD_WIDTH-10} height={BREADBOARD_HEIGHT-10} rx="5" stroke="#E0E0E0" strokeWidth="2"/>
            
            <rect x="20" y={centerY - (gutterHeight / 2)} width={BREADBOARD_WIDTH-40} height={gutterHeight} fill="#E0E0E0"/>
            
            {/* Power Rails Lines */}
            <rect x="20" y={railTopY1 - 1.1} width={BREADBOARD_WIDTH-40} height="2.2" fill="#EF5350"/>
            <rect x="20" y={railBottomY2 - 1.1} width={BREADBOARD_WIDTH-40} height="2.2" fill="#EF5350"/>
            <rect x="20" y={railTopY2 - 1.1} width={BREADBOARD_WIDTH-40} height="2.2" fill="#42A5F5"/>
            <rect x="20" y={railBottomY1 - 1.1} width={BREADBOARD_WIDTH-40} height="2.2" fill="#42A5F5"/>

            {/* Power Rail Symbols */}
            <text x="15" y={railTopY1} fill="#EF5350" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">+</text>
            <text x="15" y={railTopY2} fill="#42A5F5" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">-</text>
            <text x="15" y={railBottomY1} fill="#42A5F5" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">-</text>
            <text x="15" y={railBottomY2} fill="#EF5350" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">+</text>
            
            <text x={BREADBOARD_WIDTH - 15} y={railTopY1} fill="#EF5350" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">+</text>
            <text x={BREADBOARD_WIDTH - 15} y={railTopY2} fill="#42A5F5" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">-</text>
            <text x={BREADBOARD_WIDTH - 15} y={railBottomY1} fill="#42A5F5" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">-</text>
            <text x={BREADBOARD_WIDTH - 15} y={railBottomY2} fill="#EF5350" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">+</text>
            
            {/* Column and Row Labels */}
            <g fill="#757575" fontSize="9" fontFamily="monospace" textAnchor="middle">
                {/* Column Labels (A-J) */}
                {cols.slice(0, 5).map((col, i) => (
                    <text key={`label-col-${col}`} x={startX - 18} y={topBlockStartY + i * colSpacing} dominantBaseline="middle">{col}</text>
                ))}
                {cols.slice(5).map((col, i) => (
                    <text key={`label-col-${col}`} x={startX - 18} y={bottomBlockStartY + i * colSpacing} dominantBaseline="middle">{col}</text>
                ))}

                {/* Row Labels (1, 5, 10, ...) */}
                {Array.from({ length: numRows }, (_, i) => i + 1).map(row => {
                    if (row === 1 || row % 5 === 0) {
                        const x = startX + (row - 1) * rowSpacing;
                        return (
                            <React.Fragment key={`label-row-${row}`}>
                                <text x={x} y={topBlockStartY - 8} dominantBaseline="middle">{row}</text>
                                <text x={x} y={bottomBlockEndY + 8} dominantBaseline="middle">{row}</text>
                            </React.Fragment>
                        )
                    }
                    return null;
                })}
            </g>

            {/* Pin Holes */}
            {Object.entries(BREADBOARD_PIN_INFO)
                .filter(([key]) => /^[A-J]\d+$/.test(key) || /^[+-][TB]\d+$/.test(key))
                .map(([key, coords]) => (
                <circle key={key} cx={coords.x} cy={coords.y} r="1.5" fill="#757575">
                    <title>{`Pin ${key}`}</title>
                </circle>
            ))}
        </svg>
    )
};

export default Breadboard;
