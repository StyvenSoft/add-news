import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    // PostsQuery['posts']['posts'][0]
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<
        'updoot-loading' | 'downdoot-loading' | 'not-loading'
    >('not-loading');
    const [, vote] = useVoteMutation();
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            mr={4}
        >
            <Tooltip shouldWrapChildren label="Positive vote" placement="left">
                <IconButton
                    aria-label="updoot post"
                    colorScheme={post.voteStatus === 1 ? "teal" : undefined}
                    icon={<ChevronUpIcon w={6} h={6} />}
                    onClick={async () => {
                        if (post.voteStatus === 1) {
                            return;
                        }
                        setLoadingState('updoot-loading')
                        await vote({
                            postId: post.id,
                            value: 1,
                        });
                        setLoadingState('not-loading')
                    }}
                    isLoading={loadingState === 'updoot-loading'}
                />
            </Tooltip>
            {post.points}
            <Tooltip shouldWrapChildren label="Negative vote" placement="left">
                <IconButton
                    aria-label="updoot post"
                    colorScheme={post.voteStatus === -1 ? "red" : undefined}
                    icon={<ChevronDownIcon w={6} h={6} />}
                    onClick={async () => {
                        if (post.voteStatus === -1) {
                            return;
                        }
                        setLoadingState('downdoot-loading')
                        await vote({
                            postId: post.id,
                            value: -1,
                        });
                        setLoadingState('not-loading')
                    }}
                    isLoading={loadingState === 'downdoot-loading'}
                />
            </Tooltip>
        </Flex>
    );
}