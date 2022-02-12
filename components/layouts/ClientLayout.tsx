import { NextLayout } from '../../models/layoutType';
import Footer from '../elements/Footer';
import Header from '../elements/Header';

export const ClientLayout: NextLayout = ({ children }) => {
  return (
    <div>
      <Header />
        {children}
      <Footer />
    </div>
  );
};
