import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getTheme, shadows, UserRole } from './colors'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  role: UserRole
  colors: any
  shadows: typeof shadows
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
  setRole: (role: UserRole) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [mode, setMode] = useState<ThemeMode>('light')
  const [role, setRole] = useState<UserRole>('farmer')

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode')
      const savedRole = await AsyncStorage.getItem('userRole')

      if (savedTheme !== null) {
        setMode(savedTheme === 'true' ? 'dark' : 'light')
      }

      if (savedRole === 'farmer' || savedRole === 'agronomist') {
        setRole(savedRole)
      }

    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    AsyncStorage.setItem('darkMode', String(newMode === 'dark'))
  }

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode)
    AsyncStorage.setItem('darkMode', String(newMode === 'dark'))
  }

  const updateRole = (newRole: UserRole) => {
    setRole(newRole)
    AsyncStorage.setItem('userRole', newRole)
  }

  const theme = getTheme(role, mode)

  return (
    <ThemeContext.Provider
      value={{
        mode,
        role,
        colors: theme.colors,
        shadows,
        toggleTheme,
        setTheme,
        setRole: updateRole
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}