export interface DrawingLine {
  id: string;
  points: {x: number; y: number}[];
  thickness: number;
  color: string;
}

export interface DrawingCircle {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export type DrawMode = 'line' | 'circle' | 'none';