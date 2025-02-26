import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PK, SK } from '../constant/cons';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(PK);

const Home = () => {
    const [formData, setFormData] = useState({
        email: '',
        amount: '$0.00',
    });
    const [load, setLoad] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    const options = {
        // passing the client secret obtained in step 3
        clientSecret: clientSecret,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
    };

    function removeDollarSign(inputString) {
        // Check if the inputString starts with '$'
        if (inputString.startsWith('$')) {
            // Remove the '$' sign and return the rest of the string
            return inputString.slice(1);
        }

        // If the inputString doesn't start with '$', return it unchanged
        return inputString;
    }





    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle the "amount" field separately
        if (name === 'amount') {
            // Remove any non-numeric characters except for digits and one decimal point
            const numericValue = value.replace(/[^0-9.]/g, '');

            // Update the state with "$" sign and numeric values
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: `$${numericValue}`
            }));
        } else {
            // For other fields, update the state without modification
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    console.log(formData)

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoad(true);

        try {
            // Step 1: Create a Customer
            const customerResponse = await axios.post(
                'https://api.stripe.com/v1/customers',
                {
                    email: formData.email,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${SK}`,
                    },
                }
            );

            const customerId = customerResponse.data.id;

            // Save the customer ID in local storage
            localStorage.setItem('stripeCustomerId', customerId);

            // Step 2: Create a PaymentIntent
            const paymentIntentResponse = await axios.post(
                'https://api.stripe.com/v1/payment_intents',
                {
                    amount: removeDollarSign(formData.amount) * 100,
                    currency: 'usd',
                    customer: customerId,
                    payment_method_types: ['card'],
                    setup_future_usage: 'off_session', // Save payment method for future use
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${SK}`,
                    },
                }
            );

            // const clientSecret = paymentIntentResponse.data.client_secret;
            setClientSecret(paymentIntentResponse.data.client_secret)
            // Redirect the user to the Checkout Success Page
            // window.location.href = `http://localhost:3000/checkout-success?client_secret=${clientSecret}`;
            setLoad(false);
        } catch (error) {
            console.error('Error:', error);
            setLoad(false);
        }
    };



    return (
        <div className="hero min-h-screen ">
            <div className="hero-content flex-col">

                <div className="card shrink-0 w-full shadow-2xl ">
                    <form onSubmit={handleCheckout} className="card-body   w-full">
                        {/* Your existing form controls */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                disabled={clientSecret}
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="input input-bordered"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Amount ($)</span>
                            </label>
                            <input
                                disabled={clientSecret}
                                type="text"  // Use type="text" to allow non-numeric characters like "$"
                                name="amount"
                                placeholder="Amount($)"
                                className="input input-bordered"
                                required
                                value={formData.amount}  // Prepend '$' by default
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`form-control mt-6 ${clientSecret ? 'hidden' : ''}`}>
                            <button type="submit" className="btn hover:bg-[#F69A35] text-[white] bg-[#221066] text-[16px]">
                                {
                                    load ?
                                        <>
                                            <span className="loading loading-infinity loading-lg"></span>
                                        </> :
                                        'Next'
                                }
                            </button>
                        </div>
                    </form>
                    {
                        clientSecret &&
                        <div className='px-5 pb-5' >
                            <Elements stripe={stripePromise} options={options}>
                                <CheckoutForm />
                            </Elements>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Home;
