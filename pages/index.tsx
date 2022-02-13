import { ClientLayout } from "../components/layouts";
import { NextPageWithLayout } from "../models";

const index: NextPageWithLayout = () => {
    return <div>nguyen quang hoang</div>;
};

index.getLayout = ClientLayout;

export default index;
