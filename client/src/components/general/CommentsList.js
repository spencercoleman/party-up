import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import {
    Title,
    Loader,
    Center,
    createStyles,
    Stack,
    Group,
    Button,
    Select,
    Text,
    Box,
} from '@mantine/core';
import { IconPencil } from '@tabler/icons';
import Comment from './Comment';
import CommentForm from './CommentForm';

const useStyles = createStyles((theme) => ({
    comments: {
        display: 'flex',
        flexDirection: 'column',
        listStyle: 'none',
        padding: 0,
        margin: 0,

        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            gap: theme.spacing.sm,
            marginLeft: theme.spacing.md,
            marginRight: theme.spacing.md,
        },
    },
}));

const CommentsList = ({ title, commentData, uri, setIsRegistering }) => {
    const { user } = useAuthContext();
    const { classes } = useStyles();
    const [comments, setComments] = useState(commentData);
    const [likedComments, setLikedComments] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [displayForm, setDisplayForm] = useState(false);
    const [sortStyle, setSortStyle] = useState('Most Recent');
    const [showAll, setShowAll] = useState(false);
    const COMMENT_LIMIT = 3; // Used to limit initial comments displayed

    const handleSort = () => {
        switch (sortStyle) {
            case 'Oldest': {
                return comments.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
            }
            case 'Most Liked': {
                return comments.sort((a, b) => b.likes - a.likes);
            }
            default:
                return comments.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
        }
    };

    const getLikedState = (id) => {
        return likedComments.includes(id);
    };

    const addComment = async (comment) => {
        setIsPending(true);

        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {
            setComments([json, ...comments]);
        }

        setIsPending(false);
    };

    const deleteComment = async (commentId) => {
        setIsPending(true);

        const response = await fetch(`${uri}/${commentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {
            setComments(
                comments.filter((comment) => comment._id !== commentId)
            );
        }

        setIsPending(false);
    };

    useEffect(() => {
        const getLikedComments = async () => {
            const response = await fetch(`/api/comments/likes`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const json = await response.json();

            if (!response.ok) {
                console.error(json.error);
            }

            if (response.ok) {
                setLikedComments(json.likedComments);
            }
        };

        if (user) {
            getLikedComments();
        }
    }, [user]);

    if (user && !likedComments) {
        return (
            <Center>
                <Loader />
            </Center>
        );
    }

    let sortedComments = handleSort(comments);

    if (!showAll) {
        sortedComments = sortedComments.slice(0, COMMENT_LIMIT);
    }

    return (
        <Stack>
            <Group position="apart">
                <Title order={2} size={20} ml="md">
                    {title}
                </Title>

                {user && (
                    <Button
                        compact
                        leftIcon={<IconPencil size={16} />}
                        onClick={() => setDisplayForm(!displayForm)}
                        mx="md"
                        radius="md"
                    >
                        Add a comment
                    </Button>
                )}
            </Group>

            {user && displayForm && (
                <CommentForm
                    addComment={addComment}
                    isPending={isPending}
                    error={error}
                    setDisplayForm={setDisplayForm}
                />
            )}

            {comments.length > 0 ? (
                <Stack>
                    {!displayForm && (
                        <Select
                            value={sortStyle}
                            onChange={setSortStyle}
                            data={['Most Recent', 'Oldest', 'Most Liked']}
                            radius="md"
                            mx="md"
                            size="sm"
                            sx={{ width: 'fit-content' }}
                            variant="filled"
                        />
                    )}

                    <ul className={classes.comments}>
                        {sortedComments.map((comment) => {
                            return (
                                <li key={comment._id}>
                                    <Comment
                                        id={comment._id}
                                        author={comment.user}
                                        comment={comment.comment}
                                        createdAt={comment.createdAt}
                                        isLikedState={
                                            user
                                                ? getLikedState(comment._id)
                                                : false
                                        }
                                        likes={comment.likes}
                                        deleteComment={deleteComment}
                                        isPending={isPending}
                                        setIsRegistering={setIsRegistering}
                                    />
                                </li>
                            );
                        })}
                    </ul>

                    {/* If more than limit comments, show button to reveal/hide all */}
                    {comments.length > COMMENT_LIMIT && (
                        <Box
                            px="md"
                            sx={(theme) => ({
                                paddingBottom: theme.spacing.sm,

                                [`@media (min-width: ${theme.breakpoints.md}px)`]:
                                    {
                                        paddingBottom: 0,
                                    },
                            })}
                        >
                            <Center>
                                {showAll ? (
                                    <Button
                                        variant="subtle"
                                        color="dark"
                                        onClick={() => setShowAll(false)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                    >
                                        Hide Comments
                                    </Button>
                                ) : (
                                    <Button
                                        variant="subtle"
                                        color="dark"
                                        onClick={() => setShowAll(true)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }}
                                    >
                                        Show All Comments
                                    </Button>
                                )}
                            </Center>
                        </Box>
                    )}
                </Stack>
            ) : (
                <Box px="md">
                    {!displayForm && (
                        <Text color="dimmed" mb={30}>
                            No comments have been made yet.
                        </Text>
                    )}
                </Box>
            )}
        </Stack>
    );
};

export default CommentsList;
