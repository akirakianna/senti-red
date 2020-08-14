import React, { useContext } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { ThemeContext as StyleContext } from 'styled-components'


export const MaterialProvider = ({ children }) => {

  const styleTheme = useContext(StyleContext)
  
  // To create overrides at different breakpoints, a 'defaultTheme' is created, which serves to give us access to the breakpoints property.
  const defaultTheme = createMuiTheme()

  const muiTheme = createMuiTheme({
    overrides: {
      MuiPaper: {
        root: {
          color: styleTheme.color
        }
      },
      MuiTypography: {
        body2: {
          fontFamily: styleTheme.font
        }
      },
      MuiCard: {
        root: {
          marginBottom: '2rem',
          borderRadius: styleTheme.borderRadius
        }
      },
      MuiCardContent: {
        root: {
          display: 'flex',
          color: styleTheme.borderColour,
          alignItems: 'center',
          [defaultTheme.breakpoints.down('sm')]: {
            justifyContent: 'center'
          }
        }
      },
      MuiFormControl: {
        root: {
          backgroundColor: '#fafafa',
          borderRadius: styleTheme.borderRadius
        }
      },
      MuiCardHeader: {
        root: {
          paddingTop: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid lightgrey',
          textAlign: 'left',
          backgroundColor: styleTheme.header
        }
      },
      MuiOutlinedInput: {
        notchedOutline: {
          border: 'none'
        }
      }
    }
  })

  return (
    <ThemeProvider theme={muiTheme}>
      {children}
    </ThemeProvider>
  )
}


