import { Schema, Document, model, Types } from "mongoose";

export interface IOrderItem {
    product: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    user: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

const orderSchema = new Schema<IOrder>(
    {
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
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PENDING",
        }
    },
    {
        timestamps: true,
    }
);

export default model<IOrder>("Order", orderSchema);






































// const orderItemSchema = new Schema(
//   {
//     product: {
//       type: Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//   },
//   { _id: false }
// );

// const orderSchema = new Schema(
//   {
//     user: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     items: {
//       type: [orderItemSchema],
//       required: true,
//     },

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
//       default: "PENDING",
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["COD"],
//       default: "COD",
//     },
//   },
//   { timestamps: true }
// );

// export default model("Order", orderSchema);
