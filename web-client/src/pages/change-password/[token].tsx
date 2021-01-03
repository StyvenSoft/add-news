import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    //     const response = await login(values);
                    //     if (response.data?.login.errors) {
                    //         setErrors(toErroMap(response.data.login.errors));
                    //     } else if (response.data?.login.user) {
                    //         router.push('/');
                    //     }
                    }
                }
            >
                {(props) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="New password"
                            label="New Password"
                            type="password"
                        />
                        <Button mt={4} type="submit" isLoading={props.isSubmitting} colorScheme="teal">
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default ChangePassword;