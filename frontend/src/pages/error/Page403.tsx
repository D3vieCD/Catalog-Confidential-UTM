import { paths } from '../../routes/paths';
import { ErrorPage } from './ErrorPage';

export const Page403 = () => (
  <ErrorPage
    code={403}
    title="Acces Interzis!"
    description="Nu ai permisiunea să accesezi această pagină."
    navigateTo={paths.dashboard}
  />
);