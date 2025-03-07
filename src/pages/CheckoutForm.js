import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [load, setLoad] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        setLoad(true);
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: 'https://azstrategy.com/payment-confirmation-page/',
            },
        });


        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrorMessage(error.message);
            setLoad(false);

        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            setLoad(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button className='btn text-[white] hover:bg-[#F69A35] bg-[#221066] mt-3' disabled={!stripe}>
                {
                    load ? <>
                        <span className="loading loading-infinity loading-lg"></span>
                    </> :
                        "Pay now"
                }
            </button>
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    )
};

export default CheckoutForm;