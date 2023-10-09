<template>
    <section class="vh-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card shadow-2-strong" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">

                            <h3 class="mb-5">Sign in</h3>

                            <div class="form-outline mb-4">
                                <input type="email" id="emailInput" class="form-control form-control-lg" v-model="email"
                                    ref="emailInput" placeholder="Email" :class="{ 'invalid-input': !isValidEmail }" />
                            </div>

                            <div class="form-outline mb-4">
                                <input type="password" id="passwordInput" class="form-control form-control-lg"
                                    v-model="password" ref="passwordInput" placeholder="Password"
                                    :class="{ 'invalid-input': !password }" />
                            </div>

                            <button class="btn btn-primary btn-lg btn-block" type="submit" @click="login">Login</button>
                            <router-link to="/register" class="btn btn-secondary btn-lg btn-block">Register</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
import AuthService from '@/services/AuthService';
import DataService from '@/services/DataService';
import NotificationService from '@/services/NotificationService';

export default {
    data() {
        return {
            email: '',
            password: '',
        };
    },
    computed: {
        isValidEmail() {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

            return emailRegex.test(this.email);
        }
    },
    methods: {
        async login() {
            if (!this.email || !this.password) {
                return;
            }

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regex.test(this.email)) {

                return;
            }

            try {
                const response = await DataService.post('/User/Login', false, {
                    email: this.email,
                    password: this.password,
                });

                AuthService.setAuthToken(response.jwt);
                localStorage.setItem('canSell', response.canSell);

                NotificationService.showSuccessNotification(
                    'Successful login',
                    'You have successfully logged in'
                );

                this.$router.push({ name: 'home' });
            } catch (error) {
                if (!error.response.data.message) {
                    NotificationService.showFailedNotification(
                        'Login failed',
                        'An error occurred while logging in. Please try again.'
                    );

                    return;
                }

                NotificationService.showFailedNotification(
                    'Login failed',
                    error.response.data.message
                );
            }
        },
    },
};
</script>

<style>
.invalid-input {
    border-color: red;
}
</style>
  