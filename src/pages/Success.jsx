import React from 'react';
import Confetti from 'react-confetti';

const Success = () => {
    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Thanks for the payment!</h1>
                    </div>
                    <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default Success;