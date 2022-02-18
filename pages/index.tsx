import { ClientLayout } from "../components/layouts";
import { NextPageWithLayout } from "../models";

const index: NextPageWithLayout = () => {
    return (
        <div>ffdgfdg</div>
    )
};

index.getLayout = ClientLayout;

export default index;
