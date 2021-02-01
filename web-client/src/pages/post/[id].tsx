import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';


const Post = ({ }) => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    const [{ data, error, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    });

    if (fetching) {
        <Layout><div>Loading...</div></Layout>
    }
    if (error) {
        return <div>{error.message}</div>;
    }
    if (!data?.post) {
        return (
            <Layout>
                <Box>Could not find news</Box>
            </Layout>
        )
    }
    return (
        <Layout>
            <Stack spacing={8}>
                <Box p={5} shadow="md" borderWidth="1px">
                    <Heading mb={4} fontSize="xl">{data.post.title}</Heading>
                    <Text mt={4}>{data.post.text}</Text>
                </Box>
            </Stack>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);