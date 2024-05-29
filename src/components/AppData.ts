import { Model } from './base/Model';
import {
	IFormErrors,
	IAppState,
	ILot,
	IOrder,
	IOrderForm,
	IOrderStatus,
} from '../types';
import { IEvents } from './base/Events';

export type CatalogChangeEvent = {
	catalog: ILot[];
};

export class LotItem extends Model<ILot> {
	about: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
	isOrdered: boolean;
	status: IOrderStatus;
	category: string;
}

export class AppState extends Model<IAppState> {
	basket: ILot[];
	catalog: ILot[];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		address: '',
		payment: '',
	};
	preview: string | null;
	formErrors: IFormErrors = {};

	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
		this.events = events;
	}

	setCatalog(items: ILot[]) {
		this.catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	setPreview(item: LotItem): void {
		this.preview = item.id;
		this.emitChanges('card:open', item);
	}

	addToBasket(item: LotItem): void {
		this.catalog.map((el) => {
			if (item.id === el.id) {
				el.isOrdered = true;
			}
		});

		this.emitChanges('card:open', item);
		this.emitChanges('lot:changed', item);
	}

	deleteFromBasket(item: LotItem): void {
		this.catalog.map((el) => {
			if (item.id === el.id) {
				el.isOrdered = false;
			}
		});

		this.emitChanges('card:open', item);
		this.emitChanges('lot:changed', item);
	}
	clearBasket(): void {
		this.catalog.forEach((el) => {
			el.isOrdered = false;
		});
		this.emitChanges('lot:changed');
	}

	deleteFromBasketTotal(item: LotItem): void {
		this.catalog.map((el) => {
			if (item.id === el.id) {
				el.isOrdered = false;
			}
		});
		this.emitChanges('lot:changed', item);
	}

	handleBasket(item: LotItem): void {
		if (item.isOrdered) {
			this.deleteFromBasket(item);
		} else {
			this.addToBasket(item);
		}
	}

	getBasketLots = (): ILot[] => this.catalog.filter((item) => item.isOrdered);

	getTotal() {
		return this.catalog
			.filter((item) => item.isOrdered)
			.reduce((acc, el) => acc + el.price, 0);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrderAddress()) {
			this.events.emit('order:ready', this.order);
		}

		if (this.validateOrderContact()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrderAddress() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateOrderContact() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrorsContact:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}