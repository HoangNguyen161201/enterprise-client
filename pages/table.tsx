import Table from '../components/elements/Table';
import { ClientLayout } from '../components/layouts';
import { NextPageWithLayout } from '../models';

const table: NextPageWithLayout = () => {

    return (
    <div>
      <Table />
    </div>
  );
};

table.getLayout = ClientLayout;

export default table;
