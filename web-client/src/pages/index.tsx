import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import Layout from '../components/layout';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create News</Link>
      </NextLink>
      <div>Welcome!</div>
      {!data ? 
        <div>Loading...</div>
      : data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
