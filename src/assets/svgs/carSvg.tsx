import React from 'react';
import Svg, {Path, Rect, Circle, Ellipse, G} from 'react-native-svg';

interface CarSvgProps {
  width?: number;
  height?: number;
}

const CarSvg: React.FC<CarSvgProps> = ({width = 300, height = 200}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 300 200">
       {/* Car Body  */}
      <G>
        {/* Bottom chassis */}
        <Rect x="50" y="120" width="200" height="30" fill="#3b82f6" />
        
        {/* Top cabin */}
        <Path
          d="M 80 120 L 100 80 L 200 80 L 220 120 Z"
          fill="#60a5fa"
        />
        
        {/* Windows */}
        <Path
          d="M 105 85 L 115 105 L 185 105 L 195 85 Z"
          fill="#bfdbfe"
        />
        
        {/* Front wheel */}
        <Circle cx="90" cy="150" r="25" fill="#1e293b" />
        <Circle cx="90" cy="150" r="15" fill="#64748b" />
        
        {/* Back wheel */}
        <Circle cx="210" cy="150" r="25" fill="#1e293b" />
        <Circle cx="210" cy="150" r="15" fill="#64748b" />
        
        {/* Headlight */}
        <Ellipse cx="255" cy="130" rx="8" ry="5" fill="#fbbf24" />
        
        {/* Door line */}
        <Path
          d="M 150 120 L 150 100"
          stroke="#1e40af"
          strokeWidth="2"
        />
      </G>
    </Svg>
  );
};

export default CarSvg;