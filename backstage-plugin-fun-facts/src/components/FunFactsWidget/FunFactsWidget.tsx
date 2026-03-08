import React, { useState, useEffect } from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { Button, Typography, makeStyles } from '@material-ui/core';
import CasinoIcon from '@material-ui/icons/Casino';
import { useApi } from '@backstage/core-plugin-api';
import { funFactsApiRef, FunFact } from '../../api/types';

const useStyles = makeStyles({
    factText: {
        marginBottom: '1.5rem',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        lineHeight: 1.6,
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

export const FunFactsWidget = () => {
    const classes = useStyles();
    const funFactsApi = useApi(funFactsApiRef);
    const [facts, setFacts] = useState<FunFact[]>([]);
    const [factIndex, setFactIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchFacts = async () => {
            try {
                const fetchedFacts = await funFactsApi.getFacts();
                setFacts(fetchedFacts);
                if (fetchedFacts.length > 0) {
                    setFactIndex(Math.floor(Math.random() * fetchedFacts.length));
                }
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchFacts();
    }, [funFactsApi]);

    const showNextFact = () => {
        if (facts.length <= 1) return;

        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * facts.length);
        } while (nextIndex === factIndex);
        setFactIndex(nextIndex);
    };

    if (loading) {
        return <Progress />;
    }

    if (error) {
        return (
            <InfoCard title="🎶 Fun Facts" divider={false}>
                <Typography color="error">Error loading facts: {error.message}</Typography>
            </InfoCard>
        );
    }

    return (
        <InfoCard title="🎶 Fun Facts" divider={false}>
            {facts.length > 0 ? (
                <>
                    <Typography variant="body1" className={classes.factText}>
                        "{facts[factIndex]?.fact}"
                    </Typography>
                    <div className={classes.buttonContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CasinoIcon />}
                            onClick={showNextFact}
                        >
                            Next Fact
                        </Button>
                    </div>
                </>
            ) : (
                <Typography variant="body1">No fun facts available. Add some to the database!</Typography>
            )}
        </InfoCard>
    );
};
