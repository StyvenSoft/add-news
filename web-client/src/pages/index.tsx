import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from '../components/Layout';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  if (!fetching && !data) {
    return <div>You got query failed for some reason.</div>
  }

  return (
    <Layout>
      <Flex mb={8}>
        <Heading>Add News</Heading>
        <NextLink href="/create-post">
          <Button ml="auto" colorScheme="blue">Create News</Button>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
          <Stack spacing={8}>
            {data!.posts.map((p) => (
              <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
      {data ? (
        <Flex>
          <Button isLoading={fetching} m="auto" my={8}>
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
