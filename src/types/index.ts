//Карточка
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	isOrdered: boolean;
}

//Отслеживание карточки
export interface IOrderStatus {
	isOrdered: boolean;
}

//Общий тип лота
export type ILot = IProduct & IOrderStatus;

//Интерфейс формы введения адреса и способа оплаты
export interface IOrderAddressForm {
	address: string;
	payment: string;
}
//Интефрейс формы введения контактных данных
export interface IOrderContactsForm {
	email: string;
	phone: string;
}

//Общий тип формы заказа
export type IOrderForm = IOrderAddressForm & IOrderContactsForm;

export interface IOrder extends IOrderForm {
	items: ILot[];
}

export interface IOrderAPI extends IOrderForm {
	items: string[];
	total: number;
}

export type CatalogChangeEvent = {
	catalog: ILot[];
};

export type IFormErrors = Partial<Record<keyof IOrderForm, string>>;

export type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'>;

export interface IAppState {
	catalog: ILot[];
	basket: ILot[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}