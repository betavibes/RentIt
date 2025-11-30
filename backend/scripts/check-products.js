async function checkProducts() {
    try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        console.log(JSON.stringify(data[0], null, 2));
    } catch (error) {
        console.error(error);
    }
}

checkProducts();
