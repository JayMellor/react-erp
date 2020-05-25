export interface Product {
    reference: string;
    description: string;
    price: number;
}

export interface ProductLine extends Product {
    quantity: number;
}

const parseToProduct = (maybeProduct: object): maybeProduct is Product => {
    if (typeof (maybeProduct as Product).reference !== 'string') {
        throw new Error('Field reference not found');
    }
    if (typeof (maybeProduct as Product).price !== 'number') {
        throw new Error('Field price not found');
    }
    if (typeof (maybeProduct as Product).description !== 'string') {
        throw new Error('Field description not found');
    }
    return true;
};

export const parseProductResponse = (
    response: unknown,
):
    | { success: true; response: Product[] }
    | { success: false; message: string } => {
    if (!Array.isArray(response)) {
        return {
            success: false,
            message: 'Response is not an array',
        };
    }
    try {
        response.forEach((obj) => {
            parseToProduct(obj);
        });
    } catch ({ message }) {
        return {
            success: false,
            message,
        };
    }
    return {
        success: true,
        response,
    };
};
