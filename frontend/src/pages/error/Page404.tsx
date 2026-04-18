import paths from '../../routes/paths';
import { ErrorPage } from './ErrorPage';

export const Page404 = () => (
  <ErrorPage
    code={404}
    title="Pagina nu a fost găsită!"
    description="Pagina pe care o cauți nu există sau a fost mutată."
    navigateTo={paths.dashboard}
  />
);