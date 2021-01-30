import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import { PostSnippetFragment } from '../generated/graphql';

interface UpdootSectionProps {
        // PostsQuery['posts']['posts'][0]
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    return (
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
            {post.points}
            <IconButton
                aria-label="updoot post"
                colorScheme="red"
                icon={<ChevronDownIcon w={6} h={6} />}
            />
        </Flex>
    );
}