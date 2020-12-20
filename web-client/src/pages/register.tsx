import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';

interface registerProps { }

const REGISTER_MUT = `
mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
        errors {
            field
            message
        }
        user {
            id
            username
        }
    }
}
`

const register: React.FC<registerProps> = ({ }) => {
    const [, register] = useMutation(REGISTER_MUT);
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={(values) => {
                    return register(values);
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default register;