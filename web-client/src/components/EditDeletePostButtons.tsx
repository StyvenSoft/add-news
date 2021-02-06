import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    id: number;
    creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
    id,
    creatorId,
}) => {
    const [{ data: meData }] = useMeQuery();
    const [, deletePost] = useDeletePostMutation();

    if (meData?.me?.id !== creatorId) {
        return null
    }
    return (
        <Box ml="auto">
            <NextLink
                href="/post/edit/[id]"
                as={`/post/edit/${id}`}
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
                    deletePost({ id })
                }}
            />
        </Box>
    )
}