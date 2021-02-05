import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetIntId } from "../../../utils/useGetIntId";

const EditPost = ({ }) => {
    const router = useRouter();
    const intId = useGetIntId();
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        }
    });
    const [, updatePost] = useUpdatePostMutation();

    if (fetching) {
        return (
            <Layout>Loading...</Layout>
        )
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>Could not find news</Box>
            </Layout>
        )
    }

    return (
        <Layout variant='small'>
            <Heading fontSize="xl" mb={4}>Edit News</Heading>
            <Formik initialValues={{ title: data.post.title, text: data.post.text }}
                onSubmit={async (values) => {                  
                    await updatePost({ id: intId, ...values })
                    router.back();
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