import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';

interface registerProps { }


const register: React.FC<registerProps> = ({ }) => {
    return (
        <Formik initialValues={{ username: "", password: "" }}
            onSubmit={(values) => {
                console.log(values);
            }}>
            {(values, handleChange) => (
                <Form>
                    <FormControl>
                        <FormLabel htmlFor="username">First name</FormLabel>
                        <Input id="username" placeholder="Username"
                                onchange={handleChange}
                                value={values.username} />
                    </FormControl>
                </Form>
            )}
        </Formik>
    );
}

export default register;