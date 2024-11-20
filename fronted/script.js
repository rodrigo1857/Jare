document.addEventListener('DOMContentLoaded', () => {
document.getElementById('productForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar recarga de página

    const form = event.target;
    const imagesInput = document.getElementById('images');
    const files = imagesInput.files;

    if (files.length === 0) {
        alert('Por favor, selecciona al menos una imagen.');
        return;
    }

    let uploadedImageUrls = [];

    // Subir imágenes primero
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
        const imageResponse = await fetch('http://localhost:3000/joyeria/files/product', {
            method: 'POST',
            body: formData,
        });

        const imageResult = await imageResponse.json();

        if (imageResponse.ok) {
            uploadedImageUrls = Array.isArray(imageResult.secureUrl)
                ? imageResult.secureUrl
                : [imageResult.secureUrl];
            console.log('Imágenes subidas:', uploadedImageUrls);
        } else {
            alert(`Error al subir imágenes: ${imageResult.message}`);
            return;
        }
    } catch (error) {
        console.error('Error al subir imágenes:', error);
        alert('Hubo un error al subir las imágenes.');
        return;
    }

    // Preparar datos del producto
    const productData = {
        title: form.title.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        stock: parseInt(form.stock.value),
        sizes: form.sizes.value.split(',').map(size => parseInt(size.trim())),
        gender: form.gender.value,
        category: form.category.value,
        images: uploadedImageUrls // Usar las URLs subidas
    };

    console.log('Datos del producto a enviar:', productData);

    // Enviar datos del producto
    try {
        const response = await fetch('http://localhost:3000/joyeria/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('responseMessage').textContent = 'Producto creado con éxito.';
            alert('Producto creado con éxito.');
            form.reset(); // Limpiar el formulario
        } else {
            document.getElementById('responseMessage').textContent = `Error: ${result.message}`;
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        document.getElementById('responseMessage').textContent = 'Hubo un error al enviar el formulario.';
    }
});
});
