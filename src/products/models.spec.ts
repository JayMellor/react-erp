import { Product, parseProductResponse } from './models';

describe('Product parsinh', () => {
    describe('parseProductResponse', () => {
        it('should pass an array of products', () => {
            const testProductArray: Product[] = [
                {
                    description: 'test desc',
                    price: 1,
                    reference: 'soemthing',
                },
                {
                    description: 'another desc',
                    price: 2,
                    reference: 'ref',
                },
            ];

            const response = parseProductResponse(testProductArray);

            expect(response).toEqual({
                success: true,
                response: testProductArray,
            });
        });

        it('should throw an error for array of non-products', () => {
            const invalidProductArray = [
                {
                    description: 2,
                },
                {
                    price: 'seven',
                },
            ];

            const response = parseProductResponse(invalidProductArray);

            expect(response).toEqual({
                success: false,
                message: 'Reference field not found',
            });
        });

        it('should throw an error for a non-array', () => {
            const product: Product = {
                description: 'desc',
                price: 0,
                reference: 'ref',
            };

            const response = parseProductResponse(product);

            expect(response).toEqual({
                success: false,
                message: 'Response is not an array',
            });
        });
    });
});
