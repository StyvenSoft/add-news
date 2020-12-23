import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery();
    let body = null;

    if (fetching) {

    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Button mr={2} colorScheme="teal" variant="solid">
                        Login
                    </Button>
                </NextLink>
                <NextLink href="/register">
                    <Button colorScheme="teal" variant="outline">
                        Register
                    </Button>
                </NextLink>
            </>
        )
    } else {
        body = (
            <Box>
                <Button mr={2} colorScheme="teal" variant="ghost">
                    {data.me.username}
                </Button>
                <Button
                    onClick={() => {
                        logout();
                    }
                    }
                    isLoading={logoutFetching}
                    colorScheme="teal"
                    variant="solid"
                >
                    Logout
                </Button>
            </Box>
        )
    }

    return (
        <Flex borderBottom="2px" borderColor="gray.200" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    )
}
