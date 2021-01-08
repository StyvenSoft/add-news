import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import Layout from '../components/layout';
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();
    return (
        <Layout variant='small'>
            <Formik initialValues={{ title: "", text: "" }}
                onSubmit={async (values) => {
                    await createPost({ input: values });
                    router.push("/")
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
                            Create News
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(CreatePost);