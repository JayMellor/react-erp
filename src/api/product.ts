export const fetchProducts = (): Promise<Response> =>
    fetch('http://localhost:3000/products');