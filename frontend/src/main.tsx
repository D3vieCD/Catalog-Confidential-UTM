import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AxiosProvider } from './axios/AxiosProvider.tsx'
import { GroupsProvider } from './context/GroupProvider.tsx'
import { StudentsProvider } from './context/StudentProvider.tsx'
import { GradesProvider } from './context/GradeProvider.tsx'
import { AbsencesProvider } from './context/AbsenceProvider.tsx'
import { SubjectsProvider } from './context/SubjectProvider.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <AxiosProvider>
        <GroupsProvider>
          <StudentsProvider>
            <GradesProvider>
              <AbsencesProvider>
                <SubjectsProvider>
                  <App />
                </SubjectsProvider>
              </AbsencesProvider>
            </GradesProvider>
          </StudentsProvider>
        </GroupsProvider>
      </AxiosProvider>
    </StrictMode>
  </BrowserRouter>
)
