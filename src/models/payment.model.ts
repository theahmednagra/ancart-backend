import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IPayment extends Document {
    userId: Types.ObjectId;
    orderId: Types.ObjectId;
    amount: number;
    currency: string;
    status: "PENDING" | "PAID" | "FAILED";
    provider: string;
    paymentRef?: string;
    metadata?: Record<string, any>;
    checkoutUrl?: string;

    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        orderId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Order",
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "PKR",
        },
        status: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
        },
        provider: {
            type: String,
            required: true,
        },
        paymentRef: {
            type: String,
            unique: true,
            sparse: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        checkoutUrl: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

// important indexes
PaymentSchema.index({ orderId: 1 }); // fast lookup for order

export default mongoose.models.Payment || model<IPayment>("Payment", PaymentSchema);