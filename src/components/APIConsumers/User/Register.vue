<template>
    <section class="vh-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card shadow-2-strong" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">

                            <h3 class="mb-5">Sign up</h3>

                            <div class="form-outline mb-4">
                                <input type="email" id="emailInput" class="form-control form-control-lg" v-model="name"
                                    ref="nameInput" placeholder="Full name" :class="{ 'invalid-input': !name }" />
                            </div>

                            <div class="form-outline mb-4">
                                <input type="email" id="emailInput" class="form-control form-control-lg" v-model="email"
                                    ref="emailInput" placeholder="Email" :class="{ 'invalid-input': !isValidEmail }" />
                            </div>

                            <div class="form-outline mb-4">
                                <input type="password" id="passwordInput" class="form-control form-control-lg"
                                    v-model="password" ref="passwordInput" placeholder="Password"
                                    :class="{ 'invalid-input': !password || password.length < 9 }" />
                            </div>

                            <div class="form-outline mb-4">
                                <input type="password" id="confirmPasswordInput" class="form-control form-control-lg"
                                    v-model="confirmPassword" ref="confirmPasswordInput" placeholder="Confirm password"
                                    :class="{ 'invalid-input': !isValidPassword }" />
                            </div>

                            <button class="btn btn-primary btn-lg btn-block" type="submit" @click="login">Register</button>
                            <router-link to="/login" class="btn btn-secondary btn-lg btn-block">Login</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
import DataService from '@/services/DataService';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    },
    computed: {
        isValidEmail() {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

            return emailRegex.test(this.email);
        },
        isValidPassword() {
            return this.password == this.confirmPassword && this.password;
        }
    },
    methods: {
        async login() {
            if (!this.email || !this.password || !this.name || !this.confirmPassword) {
                return;
            }

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regex.test(this.email)) {
                return;
            }

            if (this.password !== this.confirmPassword) {

                return;
            }

            try {
                const response = await DataService.post('/User/Register', false, {
                    email: this.email,
                    password: this.password,
                    name: this.name
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message,
                });

                this.$router.push({ name: 'login' });
            } catch (error) {
                if (!error.response.data.message) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Creation error',
                        text: 'An error occurred while logging in. Please try again.',
                    });

                    return;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Creation error',
                    text: error.response.data.message,
                });
            }
        },
    },
};
</script>
  