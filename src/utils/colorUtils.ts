import { ColorRule } from '../types';

export const applyColorRules = (value: number, rules: ColorRule[]): string => {
  // Sort rules by value in ascending order for proper evaluation
  const sortedRules = [...rules].sort((a, b) => a.value - b.value);

  // Find the last rule that matches (highest threshold that the value meets)
  let matchedColor = '#d9d9d9'; // Default color
  
  for (const rule of sortedRules) {
    if (evaluateRule(value, rule)) {
      matchedColor = rule.color;
    }
  }

  return matchedColor;
};

const evaluateRule = (value: number, rule: ColorRule): boolean => {
  switch (rule.operator) {
    case '=':
      return Math.abs(value - rule.value) < 0.1; // Allow small tolerance for equality
    case '<':
      return value < rule.value;
    case '>':
      return value > rule.value;
    case '<=':
      return value <= rule.value;
    case '>=':
      return value >= rule.value;
    default:
      return false;
  }
};

export const getDefaultColors = (): string[] => [
  '#1890ff', // Blue
  '#52c41a', // Green
  '#fa8c16', // Orange
  '#f5222d', // Red
  '#722ed1', // Purple
  '#13c2c2', // Cyan
  '#eb2f96', // Magenta
  '#faad14', // Gold
];