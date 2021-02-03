import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../../../utils/createUrqlClient"

const EditPost = ({ }) => {
    return (
        <h1>Edit News</h1>
    );
};

export default withUrqlClient(createUrqlClient)(EditPost);