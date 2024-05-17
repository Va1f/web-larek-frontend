type CardCategory =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CardCategory;
	price: number | null;
	selected: boolean;
}

export interface IOrder {
	items: string[];
	payment: string;
	total: number;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IShoppingState {
	basketItems: IProduct[];
	storeItems: IProduct[];
	currentOrder: IOrder;
	addItemToBasket(product: IProduct): void;
	removeItemFromBasket(productId: string): void;
	emptyBasket(): void;
	calculateBasketItemCount(): number;
	calculateTotalBasketPrice(): number;
	loadStoreItems(): void;
	validateContactInformation(): boolean;
	validateCurrentOrder(): boolean;
	resetCurrentOrder(): boolean;
	resetSelectedItems(): void;
  }