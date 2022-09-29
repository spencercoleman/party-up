import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Box, Title, Group, Select, Checkbox, Text } from '@mantine/core';
import { IconCalendarOff } from '@tabler/icons';
import MinimalLoader from '../components/general/MinimalLoader';
import PartiesList from '../components/parties/PartiesList';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

const Parties = () => {
    const { data: parties, error } = useFetch('/api/parties');
    const [range, setRange] = useState('Today');
    const [showFilled, setShowFilled] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    const getPartiesInRange = () => {
        switch (range) {
            case 'Today':
                return parties.filter((party) => dayjs(party.date).isToday());
            case 'This Week':
                return parties.filter((party) =>
                    dayjs(party.date).isBetween(
                        dayjs().day(0),
                        dayjs().day(6),
                        '[]'
                    )
                );
            case 'This Month':
                return parties.filter(
                    (party) => dayjs(party.date).month() === dayjs().month()
                );
            default:
                return parties;
        }
    };

    const getFilteredParties = () => {
        let filteredParties = getPartiesInRange();

        if (!showFilled) {
            filteredParties = filteredParties.filter(
                (party) => party.members.length - 1 !== party.lookingFor
            );
        }

        if (!showCompleted) {
            filteredParties = filteredParties.filter((party) =>
                dayjs(party.date).isSameOrAfter(Date.now())
            );
        }

        return filteredParties.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
    };

    if (parties) {
        const filtered = getFilteredParties();

        return (
            <Box
                sx={(theme) => ({
                    paddingTop: theme.spacing.md,
                    paddingBottom: 68,
                })}
            >
                <Title order={1} size={20} mb="sm" mx="md">
                    Parties
                </Title>

                <Group mb="md" mx="md" noWrap>
                    <Select
                        value={range}
                        onChange={setRange}
                        data={['Today', 'This Week', 'This Month', 'All Time']}
                        radius="md"
                        size="sm"
                        sx={{
                            maxWidth: 140,
                        }}
                        variant="filled"
                    />
                    <Checkbox
                        label="Show filled"
                        checked={showFilled}
                        onChange={(event) =>
                            setShowFilled(event.currentTarget.checked)
                        }
                        size="xs"
                    />
                    <Checkbox
                        label="Show completed"
                        checked={showCompleted}
                        onChange={(event) =>
                            setShowCompleted(event.currentTarget.checked)
                        }
                        size="xs"
                    />
                </Group>

                {filtered.length > 0 ? (
                    <Box
                        sx={(theme) => ({
                            [`@media (min-width: ${theme.breakpoints.md}px)`]: {
                                paddingLeft: theme.spacing.md,
                                paddingRight: theme.spacing.md,
                            },
                        })}
                    >
                        <PartiesList parties={filtered} />
                    </Box>
                ) : (
                    <Group mx="md" spacing="xs" align="start" noWrap>
                        <Text color="dimmed">
                            <IconCalendarOff stroke={1.5} />
                        </Text>
                        <Text color="dimmed">No parties found.</Text>
                    </Group>
                )}
            </Box>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <MinimalLoader />;
};

export default Parties;
