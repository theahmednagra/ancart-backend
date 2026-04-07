import { Schema, Document, model, Types } from "mongoose";
import counterModel from "./counter.model";

// INTERFACES

export interface IOrderItem {
    product: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrderData {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    paymentMethod: "COD" | "CARD";
}

export interface IAdminCancelled {
    adminId: Types.ObjectId;
    name: string;
    email: string;
}

export interface IOrder extends Document {
    orderId: string;
    user: Types.ObjectId;
    items: IOrderItem[];
    orderData: IOrderData;
    totalAmount: number;
    status: "PENDING" | "PAID" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    cancelledBy: IAdminCancelled;
    cancelReason: string;
    cancelledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// HELPER FUNCTIONS

// atomic counter (SAFE for concurrent requests)
const getNextOrderSequence = async () => {
    const counter = await counterModel.findOneAndUpdate(
        { name: "order" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    return counter.value;
};

const formatOrderId = (seq: number) => {
    return seq.toString().padStart(6, "0");
};

// SCHEMA

const orderSchema = new Schema<IOrder>(
    {
        orderId: {
            type: String,
            unique: true,
            index: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],

        orderData: {
            fullName: {
                type: String,
                required: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
            },
            addressLine: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            paymentMethod: {
                type: String,
                enum: ["COD", "CARD"],
                required: true,
            },
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "PAID", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PENDING",
        },

        cancelledBy: {
            adminId: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            name: String,
            email: String,
        },

        cancelReason: String,

        cancelledAt: Date,
    },
    {
        timestamps: true,
    }
);

// AUTO ORDER ID

orderSchema.pre("save", async function () {
    if (!this.orderId) {
        const seq = await getNextOrderSequence();
        this.orderId = formatOrderId(seq);
    }
});

// INDEXES

// fast search + admin sorting
orderSchema.index({ orderId: 1 });
orderSchema.index({ createdAt: -1 });

// EXPORT

export default model<IOrder>("Order", orderSchema);