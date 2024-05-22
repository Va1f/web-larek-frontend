# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении 

Тип описывающий все возможные категории товара

```
type CardCategory =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

```

Интерфейс, описывающий карточку товара в магазине

```

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CardCategory;
	price: number | null;
	selected: boolean;
}

```

Интерфейс, описывающий поля заказа товара

```

export interface IOrder {
	items: string[];
	payment: string;
	total: number;
	address: string;
	email: string;
	phone: string;
}

```
Интерфейс, описывающий формы заказа товара 

```

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

```
Интерфейс, описывающий внутренне состояние приложения.
Используется для хранения карточек, корзины, заказа пользователя

```

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

```

## Архитектура приложения 

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Класс Api предназначен для взаимодействия с RESTful API. Он обеспечивает выполнение HTTP-запросов и обработку ответов от сервера. В его функции входит отправка GET и POST (PUT, DELETE) запросов и обработка полученных данных.
- конструктор, инициализирует объект с базовым URL и опциями для запросов.
- метод get, выполняет GET-запрос на указанный URI и возвращает ответ от сервера.
- метод post, выполняет POST, PUT или DELETE-запрос с передачей данных на указанный URI и возвращает ответ от сервера.
- метод handleResponse, обрабатывает ответ от сервера, преобразуя его в JSON-формат или бросая ошибку при неуспешном запросе.

#### Класс EventEmitter
Класс EventEmitter реализует брокер событий, который позволяет компонентам подписываться на события, инициировать события и обрабатывать их. Это классическая реализация системы событий, которая позволяет подписываться на конкретные события, снимать обработчики событий и инициировать события с передачей данных.
- конструктор, инициализирует пустую карту событий _events, которая хранит подписчиков для каждого события.
- метод on, добавляет обработчик для указанного события.Если события нет в карте _events, создает новую запись для этого события.
- метод off, удаляет обработчик для указанного события.Если после удаления обработчиков для события больше не остается, событие удаляется из карты _events.
- метод emit, инициирует событие и вызывает все связанные с ним обработчики, передавая данные.Поддерживает как строковые, так и регулярные выражения для названий событий.
- метод onAll, подписывает обработчик на все события. Использует специальный символ * для обозначения всех событий.
- метод offAll, удаляет все обработчики всех событий, очищая карту _events.
- метод trigger, создает функцию-триггер, которая генерирует указанное событие при вызове.Полезен для создания обработчиков, которые автоматически инициируют события.

### Слой данных

#### Класс Basket
Класс Cart управляет состоянием корзины в интернет-магазине. Он предоставляет методы для добавления и удаления товаров из корзины, очистки корзины, подсчета количества товаров и общей стоимости товаров в корзине, а также для управления заказами.

- конструктор, инициализирует пустой массив для хранения товаров в корзине и пустой объект для текущего заказа.
- метод addItemToBasket, добавляет товар в корзину. Если товар уже существует в корзине, увеличивает его количество.
- метод removeItemFromBasket, удаляет товар из корзины по его идентификатору.
- метод emptyBasket, очищает корзину, удаляя все товары.
- метод calculateBasketItemCount, возвращает общее количество товаров в корзине.
- метод calculateTotalBasketPrice, рассчитывает и возвращает общую стоимость товаров в корзине.
- метод loadStoreItems, загружает товары в магазин.
- метод validateContactInformation, проверяет правильность заполнения контактной информации.
- метод validateCurrentOrder, проверяет правильность текущего заказа.
- метод resetCurrentOrder, сбрасывает текущий заказ.
- метод resetSelectedItems, сбрасывает состояние выбранных товаров.

#### Класс Card
Класс Card представляет собой модель товара, которая включает в себя информацию о товаре, такие как идентификатор, описание, изображение, название, категория, цена и состояние выбранности. Этот класс обеспечивает централизованное управление свойствами товара и методы для изменения состояния товара.

- конструктор, инициализирует свойства товара, такие как идентификатор, описание, изображение, название, категория, цена и состояние выбранности.
- методы для получения свойств товара, предоставляют доступ к свойствам товара, таким как идентификатор, описание, изображение, название, категория, цена и состояние выбранности.
- методы для изменения состояния товара, позволяют изменять состояние выбранности товара.

#### Класс Order
Класс Order представляет собой модель заказа в интернет-магазине. Он включает в себя информацию о товарах в заказе, способе оплаты, общей стоимости, адресе доставки и контактных данных покупателя. Этот класс предоставляет методы для управления содержимым заказа, валидации данных и сброса состояния заказа.

- конструктор, инициализирует свойства заказа, такие как список товаров, способ оплаты, общая стоимость, адрес доставки, электронная почта и телефон покупателя.
- методы для получения свойств заказа, предоставляют доступ к свойствам заказа, таким как список товаров, способ оплаты, общая стоимость, адрес доставки, электронная почта и телефон покупателя.
- методы для изменения содержимого заказа, позволяют добавлять и удалять товары из заказа, изменять способ оплаты и адрес доставки.
- методы для валидации данных, проверяют правильность заполнения контактной информации и данных заказа.
- метод для сброса состояния заказа, сбрасывает все свойства заказа к их начальным значениям.

все