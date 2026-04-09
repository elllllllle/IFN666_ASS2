import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MantineProvider, createTheme, Button } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './theme.css'

import App from './App.jsx'

const theme = createTheme({
  black: '#454545',
  white: '#FFFDF5',
  fontFamily: 'Greycliff CF, sans-serif',
  defaultRadius: 'md',

  colors: {
    dark: [
      '#C1C2C5', '#A6A7AB', '#909296', '#5C5F66',
      '#454545', '#454545', '#353431', '#353431',
      '#353431', '#353431',
    ],
    brand: [
      '#FFFDF5', '#F6EDDD', '#F6EDDD', '#F6EDDD',
      '#F6EDDD', '#454545', '#454545', '#353431',
      '#353431', '#353431',
    ],
  },

  primaryColor: 'brand',
  primaryShade: 5,

  components: {
    Button: Button.extend({
      defaultProps: {
        variant: 'filled',
      },
      styles: (theme, props) => ({
        root: {
          backgroundColor:
            props.variant === 'filled' ? '#454545' :
            props.variant === 'outline' ? 'transparent' : undefined,
          color:
            props.variant === 'filled' ? 'white' :
            props.variant === 'outline' ? '#454545' : undefined,
          border:
            props.variant === 'outline' ? '1.5px solid #F6EDDD' : undefined,
          '&:hover': {
            backgroundColor:
              props.variant === 'filled' ? '#353431' :
              props.variant === 'outline' ? '#F6EDDD' : undefined,
            color:
              props.variant === 'filled' ? 'white' :
              props.variant === 'outline' ? '#454545' : undefined,
          },
        },
      }),
    }),

    AppShell: {
      styles: {
        main: {
          backgroundColor: '#FFFDF5',
        },
        root: {
          backgroundColor: '#FFFDF5',
        },
      },
    },

    Paper: {
      defaultProps: {
        style: {
          backgroundColor: '#FFFDF5',
          borderColor: '#F6EDDD',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
)