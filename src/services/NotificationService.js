import Swal from 'sweetalert2';

export default {
    showSuccessNotification(title, message) {
        Swal.fire({
            icon: 'success',
            title,
            text: message
        });
    },
    showFailedNotification(title, message) {
        Swal.fire({
            icon: 'error',
            title,
            text: message,
        });
    }
};