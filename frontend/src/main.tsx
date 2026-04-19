import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AxiosProvider } from './axios/AxiosProvider.tsx'
import { GroupsProvider } from './context/GroupProvider.tsx'
import { StudentsProvider } from './context/StudentProvider.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <AxiosProvider>
        <GroupsProvider>
          <StudentsProvider>
            <App />
          </StudentsProvider>
        </GroupsProvider>
      </AxiosProvider>
    </StrictMode>
  </BrowserRouter>
)
