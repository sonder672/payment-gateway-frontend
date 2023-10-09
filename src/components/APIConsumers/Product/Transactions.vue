<template>
    <section class="vh-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12">
                    <div class="mb-4">
                        <input type="text" class="form-control" placeholder="Search products..." v-model="searchQuery"
                            @input="searchAndPaginate" />
                        <small class="text-muted text-center">You can search by the name of your product or by date
                            purchase</small>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card-deck">
                        <div class="col-12 text-center" v-if="!products || products.length === 0">
                            <p>You havent made any transaction</p>
                        </div>
                        <div v-for="(transaction, index) in paginatedTransactions" :key="index" class="card shadow-sm mb-4">
                            <div class="row no-gutters">
                                <div class="col-md-2">
                                    <img :src="transaction.image ? `${backendApiBaseUrl}/${transaction.image}` : '/logo-payment-gateway.png'"
                                        alt="Product Image" class="img-thumbnail" />
                                </div>
                                <div class="col-md-10">
                                    <div class="card-body">
                                        <h5 class="card-title text-center">{{ transaction.productName }}</h5>
                                        <p class="card-text">Date purchase: {{ formatDate(transaction.date) }}</p>
                                        <p class="card-text">Price: ${{ transaction.productPrice }}</p>
                                        <div :class="{
                                            'text-success bg-light': transaction.status && !transaction.isOwner,
                                            'text-danger bg-light': !transaction.status && !transaction.isOwner,
                                            'text-primary bg-light': transaction.isOwner
                                        }">
                                            <span v-if="transaction.status && !transaction.isOwner">Payment Status:
                                                <strong>Approved</strong></span>
                                            <span v-else-if="!transaction.status && !transaction.isOwner">Payment Status:
                                                <strong>Rejected</strong></span>
                                            <span v-else-if="transaction.isOwner">Payment Status:
                                                <strong>Incoming</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div aria-label="Page navigation" v-if="transactions && transactions.length > 0">
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
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import DataService from '@/services/DataService';
import { format } from "date-fns";
import NotificationService from '@/services/NotificationService';

export default {
    data() {
        return {
            transactions: [],
            filteredTransactions: [],
            currentPage: 1,
            itemsPerPage: 5,
            searchQuery: '',
            backendApiBaseUrl: import.meta.env.VITE_BACKEND_API_BASE_URL,
        };
    },
    created() {
        this.loadTransactions();
    },
    computed: {
        paginatedTransactions() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredTransactions.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        },
    },
    methods: {
        async loadTransactions() {
            try {
                const response = await DataService.get('/Purchase/GetTransactions');
                console.log({ response });
                this.transactions = response.transactions;
                this.filteredTransactions = [...this.transactions];
                this.currentPage = 1;
            } catch (error) {
                NotificationService.showFailedNotification(
                    'Transactions loading failed',
                    'There was an error loading your transactions. Try again.'
                );
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return format(date, "dd MMMM yyyy, HH:mm");
        },
        searchAndPaginate() {
            this.filteredTransactions = this.transactions.filter((transaction) => {
                const searchQuery = this.searchQuery.toLowerCase();

                const includesSearchQuery = (str) => str.toLowerCase().includes(searchQuery);

                if ((searchQuery === 'incoming') && transaction.isOwner) {
                    return true;
                }

                if (searchQuery === 'approved' && transaction.status) {
                    return true;
                }

                if (searchQuery === 'rejected' && !transaction.status) {
                    return true;
                }

                return (
                    includesSearchQuery(transaction.productName) ||
                    includesSearchQuery(this.formatDate(transaction.date))
                );
            });
            this.currentPage = 1;
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
