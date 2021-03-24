import validator from 'validator';

export default class SignValidator {
    constructor(form) {
        this.form = form;
        this.init();
    }

    fieldError(field, message) {
        field.classList.add('border-danger');
        let errorDiv = document.createElement('div');
        errorDiv.classList.add('text-danger');
        errorDiv.innerHTML = message;
        field.insertAdjacentElement('afterend', errorDiv);
    }

    validate() {
        let valid = true;
        const [email, password] = this.form.querySelectorAll('.form-control');

        for (let errorText of this.form.querySelectorAll('.text-danger')) {
            errorText.remove();
        }
        email.classList.remove('border-danger');
        password.classList.remove('border-danger');

        if (validator.isEmpty(email.value)) {
            this.fieldError(email, 'Email não pode estar vazio');
            valid = false;
        }
        if (!validator.isEmail(email.value)) {
            this.fieldError(email, 'Email deve ser válido');
            valid = false;
        }

        if (validator.isEmpty(password.value)) {
            this.fieldError(password, 'Senha não pode estar vazia');
            valid = false;
        }
        if (password.value < 3 || password.value > 50) {
            this.fieldError(password, 'Senha deve conter entre 3 e 50 caracteres');
            valid = false;
        }

        return valid;
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const isValid = this.validate();

            if (isValid) {
                this.form.submit();
            }
        });
    }
}
