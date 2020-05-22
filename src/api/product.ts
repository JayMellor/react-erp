export const getProducts = (): Promise<Response> =>
    fetch('http://localhost:3000/products');