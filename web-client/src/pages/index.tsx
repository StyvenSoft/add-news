import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
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
            {data!.posts.posts.map((p) => (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  mr={4}
                >
                  <IconButton 
                    aria-label="updoot post"
                    colorScheme="teal"
                    icon={<ChevronUpIcon w={6} h={6} />} 
                  />
                  {p.points}
                  <IconButton 
                    aria-label="updoot post"
                    colorScheme="red"
                    icon={<ChevronDownIcon w={6} h={6} />} 
                  />
                </Flex>
                <Box>
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text>Posted by <strong>{p.creator.username}</strong></Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
            colorScheme="blue"
            variant="outline"
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
