
const imageUrlsField = document.getElementById('imageUrls');
let uploadedImageUrls = [];

document.getElementById('uploadImages').addEventListener('click', async function (event) {
    // Evitar cualquier comportamiento predeterminado, incluyendo recarga del formulario
    event.preventDefault();
    const imagesInput = document.getElementById('images');
    const files = imagesInput.files;

    if (files.length === 0) {
        alert('Por favor, selecciona al menos una imagen.');
        return;
    }

    // Crear el FormData para enviar las imágenes
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
        // Enviar las imágenes al servidor
        const response = await fetch('http://localhost:3000/joyeria/files/product', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        

        console.log(result);
        if (response.ok) {
            // Asegurarse de que el backend devuelva las URLs de las imágenes subidas
            uploadedImageUrls = [result.secureUrl] || [];
            //imageUrlsField.value = uploadedImageUrls.join(', ');  // Mostrar URLs en el campo correspondiente
            alert('Imagen subida correctamente y URL añadida.');
        } else {
            alert(`Error al subir imagen: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al subir imágenes:', error);
        alert('Hubo un error al subir las imágenes.');
    }
});

document.getElementById('productForm').addEventListener('submit', async function (event) {
    // Evitar que se envíe el formulario y recargue la página
    event.preventDefault();
    console.log(uploadedImageUrls);

    const form = event.target;
    const productData = {
        title: form.title.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        stock: parseInt(form.stock.value),
        sizes: form.sizes.value.split(',').map(size => parseInt(size.trim())),
        gender: form.gender.value,
        category: form.category.value,
        images: uploadedImageUrls  
    };
    console.log('Datos del producto:', productData);

    try {
        const response = await fetch('http://localhost:3000/joyeria/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('responseMessage').textContent = 'Producto creado con éxito.';
        } else {
            document.getElementById('responseMessage').textContent = `Error: ${result.message}`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = 'Hubo un error al enviar el formulario.';
    }
});
