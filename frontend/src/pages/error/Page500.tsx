import { paths } from '../../routes/paths';
import { ErrorPage } from './ErrorPage';

export const Page500 = () => (
  <ErrorPage
    code={500}
    title="Eroare de Server!"
    description="Ceva nu a mers bine. Te rugăm să încerci din nou."
    buttonText="Încearcă din nou"
    navigateTo={paths.login}
  />
);