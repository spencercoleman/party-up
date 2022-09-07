import { Stack, Title } from '@mantine/core';
import Comment from './Comment';

const CommentsList = ({ title, comments }) => {
    return (
        <Stack mt="lg">
            <Title order={2} size={21}>
                {title}
            </Title>
            {comments.map((comment) => (
                <Comment
                    key={comment._id}
                    user={comment.user}
                    comment={comment.comment}
                    createdAt={comment.createdAt}
                />
            ))}
        </Stack>
    );
};

export default CommentsList;
