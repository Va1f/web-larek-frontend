import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	title: string;
	description?: string | string[];
	image: string;
	price: number | null;
	category: string;
	button?: boolean;
}

export class Card extends Component<ICard> {
	protected _id: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _categoty?: HTMLElement;
	protected _price?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set price(value: string) {
		if (value == null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, value + ' синапсов');
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set category(value: string) {
		const categoryElement = this.container.querySelector(
			`.${this.blockName}__category`
		);

		categoryElement.textContent = value;

		let categoryValue = '';

		switch (value) {
			case 'софт-скил':
				categoryValue = 'soft';
				break;
			case 'другое':
				categoryValue = 'other';
				break;
			case 'кнопка':
				categoryValue = 'button';
				break;
			case 'хард-скил':
				categoryValue = 'hard';
				break;
			case 'дополнительное':
				categoryValue = 'additional';
				break;
			default:
				categoryValue = '';
				break;
		}
		categoryElement.classList.add(
			`${this.blockName}__category_${categoryValue}`
		);
	}

	get category(): string {
		return this._categoty.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}

export class AuctionItem extends Card {
	protected _status: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}

	set button(value: boolean) {
		const price = this._price.innerText;

		if (price === 'Бесценно') {
			this._button.disabled = true;
		} else {
			this._button.disabled = false;
		}

		this.setText(this._button, value ? 'Удалить' : 'В корзину');
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}