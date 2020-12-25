import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErroMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({ options: values });
                    if (response.data?.login.errors) {
                        setErrors(toErroMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push('/');
                    }
                }}>
                {(props) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="Username"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button mt={4} type="submit" isLoading={props.isSubmitting} colorScheme="teal">
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);