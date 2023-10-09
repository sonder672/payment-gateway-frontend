<template>
    <section class="vh-100">
        <div class="container py-5">
            <div class="row d-flex justify-content-center">
                <div class="col-12">
                    <div class="card shadow-2-strong" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">
                            <h2 class="card-title">Create product</h2>
                            <form @submit.prevent="createProduct">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <small for="name" class="form-label">Product Name</small>
                                            <input type="text" class="form-control" v-model="newProduct.name"
                                                ref="nameInput" :class="{ 'invalid-input': !newProduct.name }">
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <small for="price" class="form-label">Price</small>
                                            <input type="number" class="form-control" v-model="newProduct.price"
                                                ref="priceInput" :class="{ 'invalid-input': !newProduct.price }">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <small for="type" class="form-label">Product Type</small>
                                            <select class="form-select" v-model="newProduct.type"
                                                :class="{ 'invalid-input': !newProduct.type }" ref="typeInputSelect">
                                                <option value="Item">Item</option>
                                                <option value="Membership">Service</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-6" v-if="newProduct.type === 'Membership'">
                                        <div class="mb-3">
                                            <small for="paymentPeriod" class="form-label">Payment Period</small>
                                            <select class="form-select" v-model="newProduct.paymentPeriod"
                                                ref="paymentPeriodInputSelect"
                                                :class="{ 'invalid-input': !newProduct.paymentPeriod }">
                                                <option value="2">1 day</option>
                                                <option value="1">15 days (Half a month)</option>
                                                <option value="0">30 days (1 month)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <small for="image" class="form-label">Upload Image</small>
                                            <input type="file" class="form-control" @change="validateImage" accept="image/*"
                                                ref="imageInput">
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row d-flex justify-content-center">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="mb-4">
                        <input type="text" class="form-control" placeholder="Search products..." v-model="searchQuery" />
                        <small class="text-muted text-center">You can search by the name of your product or by the
                            URL</small>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row">
                        <div v-for="(product, index) in paginatedProducts" :key="index" class="col-md-4">
                            <div class="card mb-4">
                                <img :src="product.image ? `${backendApiBaseUrl}/${product.image}` : '/logo-payment-gateway.png'"
                                    class="card-img-top custom-image-size" />
                                <div class="card-body card-body-cascade text-center pb-0">
                                    <h5 class="card-title"><strong>{{ product.name }}</strong></h5>
                                    <p class="card-text">This product is priced at <span
                                            style="text-decoration: underline red;">${{
                                                product.price }}</span>. It has sold a total of <span
                                            style="text-decoration: underline red;">{{ product.quantitySold }}
                                            units</span>,
                                        generating a total revenue of <span style="text-decoration: underline red;">${{
                                            product.amountSold }}</span>.</p>

                                    <div class="card-footer text-muted text-center mt-4">
                                        <button @click="copyToClipboard(product.url, product.uuid)" class="btn btn-success">
                                            {{ copyingProductId == product.uuid ? 'Copied ✔' : 'Copy Link' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav aria-label="Page navigation" v-if="products && products.length > 0">
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                                <a class="page-link" href="#" @click="prevPage">Previous</a>
                            </li>
                            <li class="page-item" v-for="page in totalPages" :key="page"
                                :class="{ 'active': currentPage === page }">
                                <a class="page-link" href="#" @click="goToPage(page)">{{ page }}</a>
                            </li>
                            <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                                <a class="page-link" href="#" @click="nextPage">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
import DataService from '@/services/DataService';
import NotificationService from '@/services/NotificationService';

export default {
    data() {
        return {
            newProduct: {
                name: null,
                image: null,
                price: 0,
                type: null,
                paymentPeriod: null,
            },
            products: [],
            copyingProductId: null,
            imagePreviewUrl: null,
            backendApiBaseUrl: import.meta.env.VITE_BACKEND_API_BASE_URL,
            searchQuery: "",
            currentPage: 1,
            itemsPerPage: 3,
        };
    },
    computed: {
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredProducts.slice(start, end);
        },
        filteredProducts() {
            if (this.searchQuery) {
                return this.products.filter((product) =>
                    product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    `${import.meta.env.VITE_OWN_DOMAIN}/${product.url}`.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            } else {
                return this.products;
            }
        },
        totalPages() {
            return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        },
    },
    created() {
        this.loadSoldProducts();
    },
    methods: {
        async loadSoldProducts() {
            try {
                const response = await DataService.get('/Sales/GetSoldProducts');
                console.log({ response });
                this.products = response.productList;
            } catch (error) {
                NotificationService.showFailedNotification(
                    'Products loading failed',
                    'There was an error loading your products. Try again.'
                );
            }
        },
        async copyToClipboard(url, productId) {
            try {
                const completeUrl = `${import.meta.env.VITE_OWN_DOMAIN}/${url}`;
                await navigator.clipboard.writeText(completeUrl);
                this.copyingProductId = productId;

                setTimeout(() => {
                    this.copyingProductId = null;
                }, 2000);
            } catch ($e) {
                console.error($e);
                NotificationService.showFailedNotification(
                    'Error when copying',
                    `An error occurred while copying the URL, here it is: ${url}`
                );
            }
        },
        validateImage(event) {
            const selectedFile = event.target.files[0];

            if (!selectedFile) {
                this.imagePreviewUrl = null;

                NotificationService.showFailedNotification(
                    'Error loading image',
                    'No image uploaded'
                );

                return;
            }

            const allowedExtensions = ["jpg", "jpeg", "png"];
            const extension = selectedFile.name.split(".").pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                NotificationService.showFailedNotification(
                    'Error loading image',
                    'Invalid file extension. Please choose a valid image file (jpg, jpeg, png).'
                );

                return;
            }

            const maxFileSize = 5 * 1024 * 1024; //5MB
            if (selectedFile.size > maxFileSize) {
                NotificationService.showFailedNotification(
                    'Error loading image',
                    'The selected image is too large. The maximum size allowed is 5 MB'
                );

                return;
            }

            this.newProduct.image = selectedFile;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreviewUrl = e.target.result;
            };
            reader.readAsDataURL(selectedFile);
        },
        async createProduct() {
            try {
                if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.type) {
                    return;
                }

                if (this.newProduct.type === 'Membership' && !this.newProduct.paymentPeriod) {
                    return;
                }

                let uploadedImage = null;
                if (this.newProduct.image) {
                    try {
                        const response = await DataService.post(
                            '/Sales/UploadImage',
                            true,
                            { file: this.newProduct.image },
                            'multipart/form-data'
                        );

                        this.newProduct.image = response.imageUrl;
                        uploadedImage = true;
                    } catch {
                        this.image = null;
                        uploadedImage = false;
                    }
                }

                if (this.newProduct.type === 'Membership') {
                    this.newProduct.type = 0;
                    this.newProduct.paymentPeriod = parseInt(this.newProduct.paymentPeriod)
                } else {
                    this.newProduct.type = 1;
                }

                const response = await DataService.post('/Sales/CreateProduct', true, this.newProduct);
                const url = `${import.meta.env.VITE_OWN_DOMAIN}/${response.url}`;
                NotificationService.showSuccessNotification(
                    'Successful creation',
                    `Successfully created product. ${uploadedImage === false ? 'However, there was a problem saving your image.' : ''
                    } This is the URL for purchases: ${url}`
                );

                await this.loadSoldProducts();
                this.newProduct.name = null;
                this.newProduct.image = null;
                this.newProduct.price = 0;
                this.newProduct.type = null;
                this.newProduct.paymentPeriod = null;
            } catch (error) {
                if (!error.response.data.message) {
                    NotificationService.showFailedNotification(
                        'Creation failed',
                        'There was an error creating the product. Please try again.'
                    );

                    return;
                }

                NotificationService.showFailedNotification(
                    'Creation failed',
                    error.response.data.message)
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        goToPage(page) {
            this.currentPage = page;
        },
    },
};
</script>
  