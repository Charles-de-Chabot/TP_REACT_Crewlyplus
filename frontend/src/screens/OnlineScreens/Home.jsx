import React from 'react';
import Hero from '../../components/Home/Hero';
import Features from '../../components/Home/Features';
import LatestBoats from '../../components/Home/LatestBoats';
import useHomeData from '../../hooks/useHomeData';

const Home = () => {
    const { isLoading, latestBoats } = useHomeData();

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
            <Hero />
            <Features />
            <LatestBoats isLoading={isLoading} latestBoats={latestBoats} />
        </div>
    );
};

export default Home;
