// "use client";

// import {
//     PaymentElement,
//     useStripe,
//     useElements,
// } from "@stripe/react-stripe-js";
// import { useEffect, useState } from "react";

// export default function CheckoutForm() {
//     const stripe = useStripe();
//     const elements = useElements();

//     const [clientSecret, setClientSecret] = useState("");

//     useEffect(() => {
//         fetch("/api/create-payment-intent", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ amount: 50000 }), // ₹500
//         })
//             .then((res) => res.json())
//             .then((data) => setClientSecret(data.clientSecret));
//     }, []);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!stripe || !elements) return;

//         const result = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: "http://localhost:3000/success",
//             },
//         });

//         if (result.error) {
//             console.error(result.error.message);
//         }
//     };

//     if (!clientSecret) return <p>Loading...</p>;

//     return (
//         <form onSubmit={handleSubmit}>
//             <PaymentElement />
//             <button disabled={!stripe}>Pay</button>
//         </form>
//     );
// }
