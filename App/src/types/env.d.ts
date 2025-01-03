declare module '@env' {
  export const WEATHER_API_KEY: string;
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { IconProps } from 'react-native-vector-icons/Icon';
  import { Component } from 'react';

  export default class MaterialCommunityIcons extends Component<IconProps> { }
}