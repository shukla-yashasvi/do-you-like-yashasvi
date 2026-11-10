import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { invitationCopy } from './content/copy.ts'
import './styles/global.css'

document.title = invitationCopy.documentTitle

const rootElement = document.getElementById('root')

if (rootElement === null) {
  throw new Error('The page is missing the root element.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
