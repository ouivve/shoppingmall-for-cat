import { Schema } from 'mongoose';

const OrderStatusSchema = new Schema({
    orderStatus: {
        type: String,
        required: true
    },
}, {
    collection: 'orderStatus',
    timestamps: true,
}
);

export { OrderStatusSchema };
