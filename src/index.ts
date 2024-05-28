import { AppState, LotItem } from './components/AppData';
import { LarekAPI } from './components/LarekAPI';
import { OrderAddress, OrderContact } from './components/Order';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket, BasketItem } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { CatalogChangeEvent, IOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { AuctionItem, Card } from './components/Card';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// карточки
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// //заказ
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
//карзина
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);

const order = new OrderAddress(cloneTemplate(orderTemplate), events);
const contact = new OrderContact(cloneTemplate(contactTemplate), events);

// запрос карточек
api
	.getLotList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.error(err);
	});

// отрисовка карточек
events.on<CatalogChangeEvent>('catalog:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// открытие модалки карточки событие
events.on('card:select', (item: LotItem) => {
	appState.setPreview(item);
});

events.on('card:basket', (item: LotItem) => {
	appState.handleBasket(item);
});

// Отрисовка модалки карточки
events.on('card:open', (item: LotItem) => {
	const card = new AuctionItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', item);
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			button: item.isOrdered,
		}),
	});
});

// открытие и отрисовка корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

//событие удаление по кнопке в корзине
events.on('basket:delItem', (item: LotItem) => {
	appState.deleteFromBasketTotal(item);
});
//добавление в корзину и отрисовка добавленного
events.on('lot:changed', () => {
	page.counter = appState.getBasketLots()?.length;

	basket.items = appState.getBasketLots().map((item, id) => {
		const CardItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delItem', item);
			},
		});
		return CardItem.render({
			title: item.title,
			price: item.price,
			id: id + 1,
		});
	});

	basket.total = appState.getTotal();
});

// мадальное окно с адресом при заказе
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: order.address,
			payment: order.payment,
			valid: false,
			errors: [],
		}),
	});
});
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// мадальное окно с телефоном
events.on('order:submit', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setOrderField(data.field, data.value);
	}
);

events.on('formErrorsContact:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	api
		.orderLots({
			...appState.order,
			total: appState.getTotal(),
			items: appState.getBasketLots().map((el) => el.id),
		})
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appState.clearBasket();
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});