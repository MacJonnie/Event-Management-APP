import axios from "axios"
import dotenv from "dotenv";
dotenv.config();

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const paystackBaseUrl = process.env.PAYSTACK_BASE_URL;

export const initializePayment = async (email, amount) => {
    try{
        const response = await axios.post(
            `${paystackBaseUrl}/transaction/initialize`,
            {   email, amount: amount * 100 },
            {   headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                    "Content-Type": "application/json"
                },
            }                       
        );
        return response.data;
    } catch (error) {
        console.log(error)
        return res.status(500).json({mesage: "Payment init failed", error: error.message})
    }
}

export const verifyPayment = async (reference) => {
    try {
        const response = await axios.get(
            `${paystackBaseUrl}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`
                },
            }
        )
        return response.data
    } catch (error){
        console.log(error)
        return res.status(500).json({mesage: "Payment verification failed", error: error.message})
    }
}