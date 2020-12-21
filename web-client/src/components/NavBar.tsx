import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';

interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    return (
        <Flex borderBottom="2px" borderColor="gray.200" p={4}>
            <Box ml={"auto"}>
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
            </Box>
        </Flex>
    )
}
