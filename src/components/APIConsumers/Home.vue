<template>
    <section class="mt-4">
        <div class="container py-5">
            <div class="row d-flex justify-content-center align-items-center">
                <div class="col-12">
                    <h1 class="text-center mb-4 font-weight-bold">Your memberships</h1>
                    <div class="row mb-4">
                        <div class="col-6">
                            <div class="mb-4">
                                <input type="text" class="form-control" placeholder="Search membership..."
                                    v-model="searchQuery" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row">
                        <div class="col-12 text-center" v-if="!products || products.length === 0">
                            <p>You havent purchased any membership</p>
                        </div>
                        <div class="col-12 col-md-4 col-lg-4 col-xl-4" v-for="(product, index) in displayedProducts"
                            :key="index">
                            <div class="card mb-4">
                                <img class="card-img-top custom-image-size" :class="{ 'fixed-image-height': product.image }"
                                    :src="product.image ? `${backendApiBaseUrl}/${product.image}` : '/logo-payment-gateway.png'" />
                                <div class="card-body card-body-cascade text-center pb-0">
                                    <h5 class="card-title"><strong>{{ product.name }}</strong></h5>
                                    <p>Price: ${{ product.price }}</p>

                                    <div v-if="product.type === 0">
                                        <p>Last payment date: {{ formatDate(product.lastMembershipPaymentDate) }}</p>
                                        <p v-if="product.activeMembership === true">Next payment date: {{
                                            formatDate(product.nextPaymentDate) }}</p>
                                        <div class="card-footer text-muted text-center mt-4">
                                            <p v-if="product.activeMembership === true">Payment is made every: {{
                                                formatPaymentPeriod(product.paymentPeriod) }}</p>
                                            <a href="#" v-if="product.activeMembership === true"
                                                @click="cancelSubscription(product)"><small>Cancel
                                                    subscription</small></a>
                                            <p v-if="product.activeMembership === false">Canceled membership</p>
                                        </div>
                                    </div>

                                    <p v-else-if="product.type === 1">Date purchase: {{ formatDate(product.purchaseItemDate)
                                    }}</p>
                                </div>
                            </div>
                        </div>
                        <div aria-label="Page navigation" v-if="products && products.length > 0">
                            <ul class="pagination justify-content-center">
                                <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                                    <a class="page-link" href="#" @click="previousPage">Previous</a>
                                </li>
                                <li class="page-item" v-for="page in totalPages" :key="page"
                                    :class="{ 'active': currentPage === page }">
                                    <a class="page-link" href="#" @click="goToPage(page)">{{ page }}</a>
                                </li>
                                <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                                    <a class="page-link" href="#" @click="nextPage">Next</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
import DataService from '@/services/DataService';
import { format, addMonths, addDays } from "date-fns";
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 3,
            products: [],
            backendApiBaseUrl: import.meta.env.VITE_BACKEND_API_BASE_URL,
            searchQuery: ""
        };
    },
    created() {
        this.loadPurchasedProducts();
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        },
        displayedProducts() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.filteredProducts.slice(startIndex, endIndex);
        },
        filteredProducts() {
            return this.products.filter(product => {
                const searchTerm = this.searchQuery.toLowerCase();
                const nameMatch = product.name.toLowerCase().includes(searchTerm);
                const typeMatch =
                    (searchTerm === 'membership' && product.type === 0) ||
                    (searchTerm === 'item' && product.type === 1) ||
                    (searchTerm.includes('membership') && product.type === 0) ||
                    (searchTerm.includes('item') && product.type === 1);

                return nameMatch || typeMatch;
            });
        }
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return format(date, "dd MMMM yyyy, HH:mm");
        },
        async loadPurchasedProducts() {
            try {
                const response = await DataService.get('/Purchase/GetPurchasedProducts');
                console.log({ response });
                this.products = response.products;
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Memberships loading failed',
                    text: 'There was an error loading your memberships. Try again.',
                });

                console.error(error);
            }
        },
        previousPage() {
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
        calculateNextPaymentDate(lastPaymentDate, paymentPeriod) {
            const lastPaymentDateInstance = new Date(lastPaymentDate);
            switch (paymentPeriod) {
                case 0:
                    return format(addMonths(lastPaymentDateInstance, 1), "dd MMMM yyyy, HH:mm");
                case 1:
                    return format(addDays(lastPaymentDateInstance, 15), "dd MMMM yyyy, HH:mm");
                case 2:
                    return format(addDays(lastPaymentDateInstance, 1), "dd MMMM yyyy, HH:mm");
                default:
                    return "";
            }
        },
        async cancelSubscription(product) {
            try {
                const response = await DataService.post(
                    '/Sales/CancelMembership',
                    true,
                    { productId: product.productId });

                Swal.fire({
                    icon: 'success',
                    title: 'Successful membership cancellation',
                    text: response.message,
                });
            } catch (error) {
                if (!error.response.data.message) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed membership cancellation',
                        text: 'An error occurred while canceling membership. Try again.',
                    });

                    return;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Failed membership cancellation',
                    text: error.response.data.message,
                });
            }
        },
        formatPaymentPeriod(paymentPeriod) {
            switch (paymentPeriod) {
                case 0:
                    return "One month";
                case 1:
                    return "Half month";
                case 2:
                    return "Daily";
                default:
                    return "";
            }
        }
    },
};
</script>  

<style>
.fixed-image-height {
    height: 200px;
    object-fit: cover;
    width: 100%;
}
</style>