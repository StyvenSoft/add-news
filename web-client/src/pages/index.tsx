import { Box, Button, Flex, Heading, Stack, Text, Link, IconButton } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import { useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { format } from 'timeago.js';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{data: meData }] = useMeQuery();
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>You got query failed for some reason.</div>
  }

  return (
    <Layout>
      <Flex mb={8}>
        <Heading as="h4" size="md">Last News</Heading>
        <NextLink href="/create-post">
          <Button ml="auto" colorScheme="blue">Create News</Button>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p} />
                  <Box flex={1}>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>Posted by <strong>{p.creator.username}</strong> {format(p.createdAt)}</Text>
                    <Flex>
                      <Text flex={1} mt={4}>{p.textSnippet}</Text>
                      {meData?.me?.id !== p.creator.id ? null : <Box ml="auto">
                        <NextLink
                          href="/post/edit/[id]"
                          as={`/post/edit/${p.id}`}
                        >
                          <IconButton
                            mr={4}
                            aria-label="Search database"
                            icon={<EditIcon w={6} h={6} />}
                            colorScheme="blue"
                            onClick={() => { }}
                          />
                        </NextLink>
                        <IconButton
                          aria-label="Search database"
                          icon={<DeleteIcon w={6} h={6} />}
                          colorScheme="red"
                          onClick={() => {
                            deletePost({ id: p.id })
                          }}
                        />
                      </Box>}
                    </Flex>
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
