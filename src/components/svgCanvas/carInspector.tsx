import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  PanResponder,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, {Circle, Polyline, G} from 'react-native-svg';
import {generateId, calculateDistance} from '../../utils/helperMethod';
import {DrawingLine, DrawingCircle, DrawMode} from '../../types';
import CarSvg from '../../assets/svgs/carSvg';
import { colors } from '../../utils/colors/colors';
import { styles } from './style';
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - 40;
const CANVAS_HEIGHT = 400;

const CarInspector: React.FC = () => {
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [circles, setCircles] = useState<DrawingCircle[]>([]);
  const [currentLine, setCurrentLine] = useState<{x: number; y: number}[]>([]);
  const [drawMode, setDrawMode] = useState<DrawMode>('none');
  const [lineThickness, setLineThickness] = useState(3);
  const [circleRadius, setCircleRadius] = useState(15);
  
  const touchStartTime = useRef(0);
  const touchStartPos = useRef({x: 0, y: 0});

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        const {locationX, locationY} = evt.nativeEvent;
        touchStartTime.current = Date.now();
        touchStartPos.current = {x: locationX, y: locationY};

        if (drawMode === 'line') {
          setCurrentLine([{x: locationX, y: locationY}]);
        }
      },

      onPanResponderMove: (evt) => {
        const {locationX, locationY} = evt.nativeEvent;
        
        if (drawMode === 'line') {
          setCurrentLine(prev => [...prev, {x: locationX, y: locationY}]);
        }
      },

      onPanResponderRelease: (evt) => {
        const {locationX, locationY} = evt.nativeEvent;
        const touchDuration = Date.now() - touchStartTime.current;
        const distance = calculateDistance(
          touchStartPos.current.x,
          touchStartPos.current.y,
          locationX,
          locationY,
        );
        if (drawMode === 'circle' && (touchDuration > 500 || distance < 10)) {
          const newCircle: DrawingCircle = {
            id: generateId(),
            x: locationX,
            y: locationY,
            radius: circleRadius,
            color: colors.drawCircle,
          };
          setCircles(prev => [...prev, newCircle]);
        }
        if (drawMode === 'line' && currentLine.length > 1) {
          const newLine: DrawingLine = {
            id: generateId(),
            points: currentLine,
            thickness: lineThickness,
            color: colors.drawLine,
          };
          setLines(prev => [...prev, newLine]);
        }
        
        setCurrentLine([]);
      },
    }),
  ).current;

  const clearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all drawings?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setLines([]);
            setCircles([]);
          },
        },
      ],
    );
  };

  const renderModeButton = (mode: DrawMode, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.modeButton, drawMode === mode && styles.modeButtonActive]}
      onPress={() => setDrawMode(mode)}>
      <Text style={styles.modeIcon}>{icon}</Text>
      <Text style={[styles.modeText, drawMode === mode && styles.modeTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Car Inspection Canvas</Text>
        <Text style={styles.subtitle}>Draw lines and add circles to inspect</Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeContainer}>
        {renderModeButton('none', 'View', '👁️')}
        {renderModeButton('line', 'Draw', '')}
        {renderModeButton('circle', 'Circle', '')}
      </View>

      {/* Controls */}
      {drawMode !== 'none' && (
        <View style={styles.controls}>
          {drawMode === 'line' && (
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Line Thickness: {lineThickness}px</Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setLineThickness(Math.max(1, lineThickness - 1))}>
                  <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setLineThickness(Math.min(10, lineThickness + 1))}>
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {drawMode === 'circle' && (
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Circle Radius: {circleRadius}px</Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setCircleRadius(Math.max(5, circleRadius - 5))}>
                  <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setCircleRadius(Math.min(50, circleRadius + 5))}>
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={styles.canvas}>
          <G>

            <CarSvg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            {lines.map(line => {
              const pointsString = line.points.map(p => `${p.x},${p.y}`).join(' ');
              return (
                <Polyline
                  key={line.id}
                  points={pointsString}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={line.thickness}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            {currentLine.length > 0 && (
              <Polyline
                points={currentLine.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={colors.drawLine}
                strokeWidth={lineThickness}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
              />
            )}
            {circles.map(circle => (
              <Circle
                key={circle.id}
                cx={circle.x}
                cy={circle.y}
                r={circle.radius}
                fill="none"
                stroke={circle.color}
                strokeWidth={2}
              />
            ))}
          </G>
        </Svg>
      </View>
      <View style={styles.footer}>
        <View style={styles.stats}>
          <Text style={styles.statsText}>Lines: {lines.length}</Text>
          <Text style={styles.statsText}>Circles: {circles.length}</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


export default CarInspector;