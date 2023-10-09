<template>
    <section class="vh-100 gradient-form">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-xl-10">
                    <div class="card rounded-3 text-black">
                        <div class="row g-0">
                            <div class="col-lg-6 d-flex align-items-center">
                                <div class="card-body p-md-5 mx-md-4">
                                    <div class="text-center mb-4">
                                        <img :src="product.image ? `${backendApiBaseUrl}/${product.image}` : '/logo-payment-gateway.png'"
                                            class="card-img-top custom-image-size" />
                                    </div>
                                    <h5 class="card-title"><strong>{{ product.name }}</strong></h5>
                                    <p class="card-text">This product is priced at <span
                                            style="text-decoration: underline red;">${{
                                                product.price }}</span>.</p>

                                    <div class="card-footer text-muted text-center mt-4">

                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 d-flex align-items-center">
                                <div class="card-body p-md-5 mx-md-4">
                                    <form @submit.prevent="purchaseProduct">

                                        <!-- Sección de información de la tarjeta de crédito -->
                                        <div class="row">
                                            <div class="col-12 mb-2">
                                                <div class="form-outline">
                                                    <input type="text" class="form-control" v-model="creditCard.number"
                                                        placeholder="Card number"
                                                        :class="{ 'invalid-input': !creditCard.number || creditCard.number.length < 12 }" />
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-2">
                                                <input type="text" class="form-control" v-model="creditCard.expiration"
                                                    placeholder="MM/yyyy"
                                                    :class="{ 'invalid-input': !isValidExpiration }" />
                                            </div>
                                            <div class="col-md-6 mb-2">
                                                <div class="form-outline">
                                                    <input type="password" class="form-control" v-model="creditCard.cvv"
                                                        placeholder="CVV"
                                                        :class="{ 'invalid-input': !creditCard.cvv || creditCard.cvv.length < 2 }" />
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="form-outline">
                                                    <select id="creditCardQuotes" class="form-select"
                                                        v-model="creditCard.quotes">
                                                        <option value="1" selected>1 month</option>
                                                        <option value="2">2 months</option>
                                                        <option value="3">3 months</option>
                                                        <option value="4">4 months</option>
                                                        <option value="5">5 months</option>
                                                        <option value="6">6 months</option>
                                                        <option value="12">12 months</option>
                                                        <option value="24">24 months</option>
                                                        <option value="36">36 months</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Sección de información del usuario -->
                                        <div class="row mt-5">
                                            <div class="col-md-6 mb-2">
                                                <div class="form-outline">
                                                    <input type="text" class="form-control" v-model="user.name"
                                                        placeholder="Name" :class="{ 'invalid-input': !user.name }" />
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-2">
                                                <div class="form-outline">
                                                    <input type="text" class="form-control" v-model="user.lastName"
                                                        placeholder="LastName"
                                                        :class="{ 'invalid-input': !user.lastName }" />
                                                </div>
                                            </div>
                                            <div class="col-12 mb-2">
                                                <div class="form-outline">
                                                    <input type="text" class="form-control" v-model="user.email"
                                                        placeholder="Email" :class="{ 'invalid-input': !isValidEmail }" />
                                                </div>
                                            </div>
                                            <div class="col-4 mb-2">
                                                <select id="identityType" class="form-select">
                                                    <option value="CC" selected>CC</option>
                                                </select>
                                            </div>
                                            <div class="col-8 mb-2">
                                                <div class="form-outline">
                                                    <input type="text" class="form-control" v-model="user.identity"
                                                        placeholder="Identity"
                                                        :class="{ 'invalid-input': !user.identity || user.identity.length < 4 }" />
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="form-outline">
                                                    <input type="text" class="form-control" v-model="user.phone"
                                                        placeholder="Phone"
                                                        :class="{ 'invalid-input': !user.phone || user.phone.length < 9 }" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Botón de compra -->
                                        <div class="text-center pt-4">
                                            <button class="btn btn-primary btn-block fa-lg gradient-custom-2 m-2"
                                                type="submit">Purchase</button>
                                            <router-link class="btn btn-secondary btn-block fa-lg gradient-custom-2"
                                                :to="{ name: 'home' }">Regresar</router-link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
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
            product: {
                image: null,
                name: null,
                paymentPeriod: null,
                price: 0,
                type: null
            },
            creditCard: {
                number: null,
                quotes: 1,
                expiration: null,
                cvv: null
            },
            user: {
                name: null,
                lastName: null,
                identity: null,
                phone: null,
                email: null
            },
            productId: null,
            backendApiBaseUrl: import.meta.env.VITE_BACKEND_API_BASE_URL,
        };
    },
    computed: {
        isValidEmail() {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

            return emailRegex.test(this.user.email);
        },
        isValidExpiration() {
            const regexExpiration = /^(0[1-9]|1[0-2])\/\d{4}$/;
            return regexExpiration.test(this.creditCard.expiration);
        }
    },
    created() {
        this.productId = this.$route.params.productId;
        this.loadProduct();
    },
    methods: {
        async loadProduct() {
            try {
                const response = await DataService.get(`/Sales/GetProduct?productUuid=${this.productId}`);
                this.product = response;
            } catch (error) {
                NotificationService.showFailedNotification(
                    'Failed product loading',
                    'There was a problem loading the product you want to purchase. Try later'
                );

                this.$router.push({ name: 'home' });
                console.error(error);
            }
        },
        async purchaseProduct() {
            try {
                if (!this.creditCard.number || !this.creditCard.expiration || !this.creditCard.cvv) {
                    return;
                }

                if (!this.user.name || !this.user.lastName || !this.user.identity || !this.user.phone || !this.user.email) {
                    return;
                }

                const regexExpiration = /^(0[1-9]|1[0-2])\/\d{4}$/;
                if (!regexExpiration.test(this.creditCard.expiration)) {
                    return;
                }

                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!regex.test(this.user.email)) {

                    return;
                }

                const date = this.creditCard.expiration.split('/');

                const month = date[0];
                const year = date[1];

                console.log({ date });

                const requestData = {
                    productUuid: this.productId,
                    email: this.user.email,
                    name: this.user.name,
                    paymentInformation: {
                        expirationMonth: month,
                        expirationYear: year,
                        number: this.creditCard.number,
                        bin: this.creditCard.cvv
                    }
                };

                const response = await DataService.post('/Purchase/PurchaseProduct', true, requestData);
                NotificationService.showSuccessNotification(
                    'Successful purchase',
                    response.message
                );

                this.resetCreditCardAndUser();
            } catch (error) {
                if (!error.response.data.message) {
                    NotificationService.showFailedNotification(
                        'Failed purchase',
                        'An error occurred while paying. Try again.'
                    );

                    return;
                }

                NotificationService.showFailedNotification(
                    'Failed purchase',
                    error.response.data.message
                );
            }
        },
        resetCreditCardAndUser() {
            this.creditCard = {
                number: null,
                quotes: 1,
                expiration: null,
                cvv: null
            };

            this.user = {
                name: null,
                lastName: null,
                identity: null,
                phone: null
            };
        },
        handleExpirationInput() {
            const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
            if (!regex.test(this.creditCard.expiration)) {
                this.creditCard.expiration = '';
            }
        },
    }
};
</script>

<style>
.error-border {
    border: 1px solid red;
}
</style>