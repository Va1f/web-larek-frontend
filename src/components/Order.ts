import { Form } from './common/Form';
import { IOrderAddressForm, IOrderContactsForm, IOrderForm } from '../types';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class OrderContact extends Form<IOrderContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}

export class OrderAddress extends Form<IOrderAddressForm> {
    payment: string;
    protected _containerPay: HTMLDivElement;
    protected _buttonsPayCash: HTMLButtonElement;
    protected _buttonsPayOnline: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._containerPay = ensureElement<HTMLDivElement>('.order__buttons', this.container);
        this._buttonsPayCash = this._containerPay.querySelector('[name=cash]');
        this._buttonsPayOnline = this._containerPay.querySelector('[name=card]');

        if (this._buttonsPayCash) {
            this._buttonsPayCash.addEventListener('click', (e) => {
                e.preventDefault();
                this.setPayment('payment', 'При получении');
                this.toggleClass(this._buttonsPayCash, 'button_alt-active', true);
                this.toggleClass(this._buttonsPayOnline, 'button_alt-active', false);
            });
        }

        if (this._buttonsPayOnline) {
            this._buttonsPayOnline.addEventListener('click', (e) => {
                e.preventDefault();
                this.setPayment('payment', 'Онлайн');
                this.toggleClass(this._buttonsPayOnline, 'button_alt-active', true);
                this.toggleClass(this._buttonsPayCash, 'button_alt-active', false);
            });
        }
    }

    set address(value: string) {
        (this.container.elements?.namedItem('address') as HTMLInputElement).value = value;
    }

    protected setPayment(field: keyof IOrderForm, value: string) {
        this.events.emit('order.payment:change', {
            field,
            value,
        });
    }
}