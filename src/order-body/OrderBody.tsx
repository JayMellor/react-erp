import React, { useState, useCallback } from 'react';
import { NewProduct } from '../add-product/AddProduct';
import { ProductList } from '../product-list/ProductList';
import { ProductLine, SubmitLine } from '../products/models';

const useProductList = (
    initialState: ProductLine[],
): [ProductLine[], SubmitLine] => {
    const [products, setProducts] = useState<ProductLine[]>(initialState);
    const updateProducts = useCallback(
        (product: ProductLine) => {
            setProducts([...products, product]);
        },
        [products],
    );
    return [products, updateProducts];
};

export function OrderBody(): JSX.Element {
    const [products, setProducts] = useProductList([
        {
            reference: 'DXP5180',
            description: 'Howdens Mondello Glazed External Door',
            price: 25,
            quantity: 1,
        },
        {
            reference: '408779310',
            description: 'Denso Spark Plug',
            price: 6.5,
            quantity: 10,
        },
        {
            reference: 'BRCTN924',
            description: 'CARLTON FACING BRICKS RED 65MM',
            price: 0.96,
            quantity: 200,
        },
    ]);

    return (
        <div>
            <NewProduct submitLine={setProducts}></NewProduct>
            <ProductList products={products}></ProductList>
        </div>
    );
}