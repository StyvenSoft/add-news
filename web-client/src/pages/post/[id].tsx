import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';


const Post = ({ }) => {
    const [{ data, error, fetching }] = useGetPostFromUrl();

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
                    <Text my={4}>{data.post.text}</Text>
                    <EditDeletePostButtons
                        id={data.post.id}
                        creatorId={data.post.creator.id}    
                    />
                </Box>
            </Stack>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);