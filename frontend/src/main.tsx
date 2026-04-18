import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AxiosProvider } from './axios/AxiosProvider.tsx'
import { GroupsProvider } from './context/GroupProvider.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <AxiosProvider>

        <GroupsProvider>
          <App />
        </GroupsProvider>
        
      </AxiosProvider>
    </StrictMode>
  </BrowserRouter>
)
