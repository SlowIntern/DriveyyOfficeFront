declare global {
    interface Window {
        Razorpay: any;
    }
}

export function openRazorpayCheckout({
    orderId,
    amount,
    currency,
}: {
    orderId: string;
    amount: number;
    currency: string;
}) {
    if (!window) return;

    const options = {
        key: "rzp_test_Rn1Mbn7CHLlW1b",
        amount,
        currency,
        name: "My Ride App",
        order_id: orderId,
        handler: function (response: any) {
            console.log("Payment success:", response);
            // You can now hit verify API
        },
        theme: {
            color: "#3399cc",
        },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
}
