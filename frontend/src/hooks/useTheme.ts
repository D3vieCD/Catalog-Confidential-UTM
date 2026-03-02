import { useState, useEffect, useCallback } from 'react';

export type ThemeType = 'default' | 'dark' | 'blue' | 'green' | 'purple';

interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}