import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import Layout from '../components/layout';
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost: React.FC<{}> = ({}) => {
    const [{data, fetching}] = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if (!fetching && !data?.me) {
            router.replace("/login")
        }
    }, [fetching, data, router]);
    const [, createPost] = useCreatePostMutation();
    return (
        <Layout variant='small'>
            <Formik initialValues={{ title: "", text: "" }}
                onSubmit={async (values) => {                  
                    const {error} = await createPost({ input: values });
                    if (!error) {
                        router.push("/");
                    }
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