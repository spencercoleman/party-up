import {
    createStyles,
    Card,
    Avatar,
    Text,
    Group,
    Stack,
    MediaQuery,
} from '@mantine/core';
import {
    IconUser,
    IconUsers,
    IconSearch,
    IconQuestionMark,
} from '@tabler/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const useStyles = createStyles((theme) => ({
    link: {
        color: 'inherit',
        textDecoration: 'none',
    },

    card: {
        backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderTop: `1px solid ${
            theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[2]
        }`,
        borderRadius: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px',

        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            padding: 0,
            border: 'none',
            borderRadius: theme.radius.lg,
            transition: 'all 0.25s',

            '&:hover': {
                boxShadow:
                    'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
                transform: 'translateY(-1px)',
            },
        },
    },

    inner: {
        padding: 0,

        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            padding: `${theme.spacing.sm}px`,
            paddingLeft: `${theme.spacing.md}px`,
        },
    },

    partyImage: {
        width: 60,
        height: 60,
        flexShrink: 0,

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            width: 70,
            height: 70,
        },
    },

    mobileHidden: {
        display: 'none',

        [`@media (min-width: 370px)`]: {
            display: 'inline',
        },
    },

    userIcon: {
        color: theme.colors.teal[7],
    },

    searchIcon: {
        color: theme.colors.violet[7],
    },
}));

const PartyCard = ({ party }) => {
    const { classes } = useStyles();
    const openings = party.lookingFor - (party.members.length - 1); // Subtract one for the slot filled by leader

    return (
        <Link to={`/parties/${party._id}`} className={classes.link}>
            <Card className={classes.card}>
                <Group className={classes.inner} noWrap spacing="sm">
                    <Avatar
                        className={classes.partyImage}
                        src={party.game.cover ? party.game.cover.url : null}
                        radius="lg"
                    >
                        <IconQuestionMark />
                    </Avatar>
                    <Stack spacing={0}>
                        <MediaQuery
                            largerThan={390}
                            styles={{ display: 'none' }}
                        >
                            <Text color="dimmed" size="xs" weight={500}>
                                {dayjs(party.date).format(
                                    'ddd, MMM. D, YYYY, h:mm A'
                                )}
                            </Text>
                        </MediaQuery>
                        <MediaQuery
                            smallerThan={390}
                            styles={{ display: 'none' }}
                        >
                            <Text color="dimmed" size="xs" weight={500}>
                                {dayjs(party.date).format(
                                    'ddd, MMMM. D, YYYY, h:mm A'
                                )}
                            </Text>
                        </MediaQuery>
                        <Text weight={500} size="sm">
                            {party.name}
                        </Text>
                        <Text size="xs" color="dimmed" mb={2}>
                            {party.game.name}
                        </Text>
                        <Group spacing="xs">
                            <Group noWrap spacing={4}>
                                {party.members.length > 1 ? (
                                    <IconUsers
                                        className={classes.userIcon}
                                        size={14}
                                    />
                                ) : (
                                    <IconUser
                                        size={14}
                                        className={classes.userIcon}
                                    />
                                )}
                                <Text size="xs">
                                    <strong>{party.members.length}</strong>{' '}
                                    <span className={classes.mobileHidden}>
                                        member
                                        {party.members.length > 1 && 's'}
                                    </span>
                                </Text>
                            </Group>
                            <Group
                                className={classes.memberDetails}
                                noWrap
                                spacing={4}
                            >
                                <IconSearch
                                    className={classes.searchIcon}
                                    size={14}
                                />
                                <Text size="xs">
                                    {openings > 0 ? (
                                        <>
                                            <span
                                                className={classes.mobileHidden}
                                            >
                                                Looking for
                                            </span>{' '}
                                            <strong>{openings}</strong>{' '}
                                            <span
                                                className={classes.mobileHidden}
                                            >
                                                more
                                            </span>
                                        </>
                                    ) : (
                                        'Filled'
                                    )}
                                </Text>
                            </Group>
                        </Group>
                    </Stack>
                </Group>
            </Card>
        </Link>
    );
};

export default PartyCard;
