async function checkProductById() {
    try {
        const response = await fetch('http://localhost:3001/api/products/3f32568a-633c-4510-b1ca-7072713d289c');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(error);
    }
}

checkProductById();
