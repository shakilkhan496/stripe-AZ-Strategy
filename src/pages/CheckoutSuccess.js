// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { PK, SK } from '../constant/cons';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
const stripePromise = loadStripe(PK);


const CheckoutSuccess = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const getClientSecret = async () => {
            const secret = new URLSearchParams(location.search).get('client_secret');
            setClientSecret(secret);
        };

        getClientSecret();
    }, [location.search]);

    const options = {
        // passing the client secret obtained in step 3
        clientSecret: clientSecret,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="card p-5 w-[500px] shadow-2xl bg-base-100">
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;


