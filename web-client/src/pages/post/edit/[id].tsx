import { Box, Button, Heading } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql"
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { createUrqlClient } from "../../../utils/createUrqlClient"

const EditPost = ({ }) => {
    return (
        <Layout variant='small'>
            <Heading fontSize="xl" mb={4}>Edit News</Heading>
            <Formik initialValues={{ title: "", text: "" }}
                onSubmit={() => {                  
                    // const {error} = await createPost({ input: values });
                    // if (!error) {
                    //     router.push("/");
                    // }
                }}>
                {(props) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="Add title"
                            label="Title"
                        />
                        <Box mt={4}>
                            <InputField
                                textarea
                                name="text"
                                placeholder="Text..."
                                label="Body"
                            />
                        </Box>
                        <Button 
                            mt={4} 
                            type="submit" 
                            isLoading={props.isSubmitting} 
                            colorScheme="teal"
                        >
                            Update News
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(EditPost);