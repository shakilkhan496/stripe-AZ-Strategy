// Import necessary dependencies
import { useState } from 'react';
import axios from 'axios';
import { SK } from '../constant/cons';

const FuturePaymentComponent = () => {
    const [futurePaymentAmount, setFuturePaymentAmount] = useState(0);

    const handleFuturePayment = async () => {
        // Retrieve customer ID from local storage
        const storedCustomerId = localStorage.getItem('stripeCustomerId');


        try {
            const paymentIntentResponse = await axios.post(
                'https://api.stripe.com/v1/payment_intents',
                {
                    amount: futurePaymentAmount * 100,
                    currency: 'usd',
                    customer: storedCustomerId,
                    payment_method_types: ['card'],
                    setup_future_usage: 'off_session',
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${SK}`,
                    },
                }
            );

            const clientSecret = paymentIntentResponse.data.client_secret;

            // Redirect the user to the Checkout Success Page
            window.location.href = `http://localhost:3000/checkout-success?client_secret=${clientSecret}`;
        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Future Payment Amount"
                value={futurePaymentAmount}
                onChange={(e) => setFuturePaymentAmount(e.target.value)}
            />
            <button onClick={handleFuturePayment}>Initiate Future Payment</button>
        </div>
    );
};

export default FuturePaymentComponent;
