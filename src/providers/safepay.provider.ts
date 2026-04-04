import axios from "axios";

interface Data {
    amount: number;
    paymentId: string;
    orderId: string;
}

const SANDBOX_BASE = "https://sandbox.api.getsafepay.com";
const SANDBOX_CHECKOUT = "https://sandbox.api.getsafepay.com/checkout/pay";

export const createSafepayCheckoutUrl = async (data: Data): Promise<string> => {

    // Step 1: Create tracker using the simple v1 endpoint
    const { data: responseData } = await axios.post(
        `${SANDBOX_BASE}/order/v1/init`,
        {
            client: process.env.SAFEPAY_PUBLIC_KEY,
            amount: data.amount,
            currency: "PKR",
            environment: "sandbox",
        }
    );

    const token: string = responseData.data.token;

    if (!token) {
        throw new Error(`Safepay error: ${JSON.stringify(responseData)}`);
    }

    // Step 2: Build checkout URL — simple redirect
    const params = new URLSearchParams({
        env: "sandbox",
        beacon: token,
        source: "custom",
        order_id: data.paymentId,
        redirect_url: `${process.env.BASE_URL}/user/order/my-orders/${data.orderId}`,
        cancel_url: `${process.env.BASE_URL}/user/order/my-orders/${data.orderId}`,
    });

    return `${SANDBOX_CHECKOUT}?${params.toString()}`;
};