import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AxiosProvider } from './axios/AxiosProvider.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import { GroupsProvider } from './context/GroupProvider.tsx'
import { StudentsProvider } from './context/StudentProvider.tsx'
import { GradesProvider } from './context/GradeProvider.tsx'
import { AbsencesProvider } from './context/AbsenceProvider.tsx'
import { SubjectsProvider } from './context/SubjectProvider.tsx'
import { EvaluationsProvider } from './context/EvaluationProvider.tsx'
import { CalendarProvider } from './context/CalendarProvider.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <AxiosProvider>
        <AuthProvider>
          <GroupsProvider>
            <StudentsProvider>
              <GradesProvider>
                <AbsencesProvider>
                  <SubjectsProvider>
                    <EvaluationsProvider>
                      <CalendarProvider>
                        <App />
                      </CalendarProvider>
                    </EvaluationsProvider>
                  </SubjectsProvider>
                </AbsencesProvider>
              </GradesProvider>
            </StudentsProvider>
          </GroupsProvider>
        </AuthProvider>
      </AxiosProvider>
    </StrictMode>
  </BrowserRouter>
)
