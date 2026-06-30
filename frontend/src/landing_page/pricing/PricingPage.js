import React from 'react';
import Hero from '../home/Hero';
import Brokerage from './Brokerage';
import OpenAccount from '../OpenAccount';

function PricingPage() {
    return ( 
        <>
        <h1>Pricing</h1>
        <Hero/>
        <OpenAccount/>
        <Brokerage/>
        </>
     );
}

export default PricingPage;