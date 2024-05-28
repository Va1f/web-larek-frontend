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
- src/scss/styles.scss — корневой файл стилей
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
## Архитектура проекта

### Реализация

Данное приложение было реализовано с помощью архитектуры MVP:

Model - модель данных;
View - модель отображения интерфейса;
Presenter - связующая модель;

Архитекутра приложения,основанная на взаимодействии через события, обеспечивает гибкость и масштабируемость, делая код более модульным и легко поддерживаемым. Вот некоторые преимущества этой архитектуры:

Разделение ответственностей: Каждая часть приложения отвечает только за свои задачи. Модели отвечают за управление данными, контроллеры (слушатели событий) — за обработку событий и управление данными и представлениями, а представления — за отображение данных пользователю.

Модульность: Компоненты приложения могут быть легко переиспользованы и расширены благодаря их модульной структуре. Каждый компонент имеет четко определенную задачу и не зависит от внутренней реализации других компонентов.

Гибкость: Используя событийную архитектуру, вы можете легко добавлять новые функции и изменять поведение приложения, не затрагивая существующий код. Это делает приложение более гибким и адаптивным к изменениям.

Тестируемость: Каждая часть приложения может быть протестирована отдельно благодаря своей независимой структуре. Это упрощает процесс тестирования и обеспечивает надежность приложения.

Читаемость и понятность кода: Используя события для взаимодействия между компонентами, код становится более понятным и легко читаемым. Каждая часть приложения выполняет конкретную задачу, что упрощает понимание его работы как для текущих разработчиков, так и для новых участников проекта.

В целом, архитектура, основанная на взаимодействии через события, способствует созданию структурированного, гибкого и легко расширяемого приложения, что делает его поддержку и развитие более эффективными.

### Базовый код

#### Класс Api
Класс Api предоставляет методы для взаимодействия с серверным API. Он поддерживает выполнение GET и POST запросов, а также обработку ответов от сервера.

Типы данных
- ApiListResponse<Type>: Описывает стандартный ответ API, содержащий общее количество элементов (total) и массив элементов (items) типа Type.
- ApiPostMethods: Описывает допустимые HTTP методы для POST-запросов ('POST', 'PUT', 'DELETE').
Свойства
- baseUrl: string: Базовый URL для API запросов.
- options: RequestInit: Опции для конфигурации запросов. Содержат заголовки и другие параметры.
Конструктор

constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers as object ?? {})
        }
    };
}

- baseUrl: string: Строка, представляющая базовый URL для API запросов. Это обязательный параметр, который определяет начальную часть URL для всех запросов.
- options: RequestInit: Объект с дополнительными опциями для запросов. Это необязательный параметр, который по умолчанию равен пустому объекту. Опции могут включать в себя заголовки, методы и другие настройки для запросов.

- protected handleResponse(response: Response): Promise<object>
Обрабатывает ответ от сервера. Если ответ успешен (status 200), возвращает JSON данные. В противном случае, возвращает ошибку с сообщением об ошибке.
- get(uri: string): Promise<object>
Выполняет GET запрос к указанному URI и возвращает промис с ответом от сервера.
- post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>
Выполняет POST запрос к указанному URI с переданными данными и возвращает промис с ответом от сервера. Поддерживает методы POST, PUT и DELETE.

Класс Api инкапсулирует логику взаимодействия с сервером, обеспечивая удобный интерфейс для выполнения API запросов и обработки ответов. Это позволяет избежать дублирования кода и делает взаимодействие с сервером более структурированным и предсказуемым.

#### Класс EventEmitter
Класс EventEmitter реализует паттерн Observer, обеспечивая функциональность для установки обработчиков событий и уведомления подписчиков о возникновении событий. Это позволяет организовать взаимодействие между различными частями приложения через события.

Типы данных

 EventName: строка или регулярное выражение, представляющее имя события.
 Subscriber: функция, представляющая обработчик события.
 EmitterEvent: объект, представляющий событие, с полями eventName (строка) и data (произвольный тип).

Интерфейс IEvents

- on<T extends object>(event: EventName, callback: (data: T) => void): void: Устанавливает обработчик на событие.
- emit<T extends object>(event: string, data?: T): void: Инициирует событие с данными.
- trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void: Создает коллбек-триггер, генерирующий событие при вызове.

 Конструктор

 Свойства
 _events: Map<EventName, Set<Subscriber>>: Карта, где ключом является имя события, а значением - набор подписчиков на это событие.

	constructor() {
    	this._events = new Map<EventName, Set<Subscriber>>();
	}
Инициализирует новый экземпляр EventEmitter, создавая пустую карту событий.

Методы

- on<T extends object>(eventName: EventName, callback: (event: T) => void): Устанавливает обработчик на событие. Если событие еще не зарегистрировано, оно добавляется в карту событий.
- off(eventName: EventName, callback: Subscriber): Удаляет обработчик с события. Если после удаления обработчиков не остается, событие удаляется из карты.
- emit<T extends object>(eventName: string, data?: T): Инициирует событие с данными, вызывая все зарегистрированные обработчики для этого события.
- onAll(callback: (event: EmitterEvent) => void): Устанавливает обработчик для всех событий.
- offAll(): Удаляет все обработчики для всех событий.
- trigger<T extends object>(eventName: string, context?: Partial<T>): Создает коллбек-триггер, который генерирует событие при вызове, объединяя данные события и контекст.

Класс EventEmitter обеспечивает гибкий и расширяемый механизм для управления событиями и взаимодействием между различными частями приложения. Это позволяет строить архитектуру, основанную на событиях, что упрощает разработку и поддержку приложений.

#### Класс Component<T>

Класс Component<T> представляет собой абстрактный базовый класс для всех графических компонентов в проекте. Он обеспечивает общую функциональность для работы с DOM и может быть расширен другими компонентами для построения пользовательского интерфейса. Класс использует дженерик T для определения типа данных, с которыми будет работать компонент.

Конструктор

protected constructor(protected readonly container: HTMLElement)
Конструктор принимает один аргумент:
container: HTMLElement — корневой HTML-элемент, в который будет рендериться компонент. Тип: HTMLElement.

Методы
- toggleClass, переключает класс на элементе.
 1. element: HTMLElement — HTML-элемент, для которого нужно переключить класс. Тип: HTMLElement.
 2. className: string — Имя класса, который нужно переключить. Тип: string.
 3. force?: boolean — Опциональный аргумент, который определяет, нужно ли принудительно добавить или удалить класс. Тип: boolean.

- setText, устанавливает текстовое содержимое элемента.
 1. element: HTMLElement — HTML-элемент, текстовое содержимое которого нужно установить. Тип: HTMLElement.
 2. value: unknown — Значение, которое нужно установить как текстовое содержимое. Тип: unknown.

- setDisabled, устанавливает или снимает атрибут disabled для элемента.
 1. element: HTMLElement — HTML-элемент, для которого нужно установить или снять атрибут disabled. Тип: HTMLElement.
 2. state: boolean — Если true, атрибут disabled будет установлен, если false — снят. Тип: boolean.

- setHidden, скрывает элемент, устанавливая стиль display: none.
 1. element: HTMLElement — HTML-элемент, который нужно скрыть. Тип: HTMLElement.

- setVisible, показывает элемент, удаляя стиль display.
 1. element: HTMLElement — HTML-элемент, который нужно показать. Тип: HTMLElement.

- setImage, устанавливает источник и альтернативный текст для изображения.
 1. element: HTMLImageElement — HTML-элемент изображения, для которого нужно установить источник и альтернативный текст. Тип: HTMLImageElement.
 2. src: string — URL изображения. Тип: string.
 3. alt?: string — Опциональный альтернативный текст для изображения. Тип: string.

- render, рендерит компонент, обновляя его состояние на основе переданных данных.
 1. data?: Partial<T> — Опциональные данные для обновления состояния компонента. Тип: Partial<T>.
 2. Возвращает корневой HTML-элемент компонента. Тип: HTMLElement.

#### Класс Model<T>

Класс Model<T> представляет собой абстрактный базовый класс для всех моделей в проекте. Он используется для создания объектов, которые могут генерировать события при изменении их состояния, что позволяет следить за изменениями данных в приложении. Класс использует дженерик T для определения типа данных, которые будет хранить модель.

Конструктор
constructor(data: Partial<T>, protected events: IEvents)

Конструктор принимает два аргумента:

data: Partial<T> — начальные данные для модели. Тип: Partial<T>.
events: IEvents — экземпляр интерфейса IEvents для работы с событиями. Тип: IEvents.
Конструктор присваивает переданные данные объекту, используя Object.assign, и сохраняет ссылку на объект событий.
Методы
- emitChanges, генерирует событие, указывая, что модель изменилась.
 1. event: string — имя события, которое будет сгенерировано. Тип: string.
 2. payload?: object — дополнительные данные, которые будут переданы с событием. Тип: object.
Этот метод вызывает метод emit у объекта events, чтобы уведомить всех подписчиков об изменениях модели.

- isModel, функция-гард, которая проверяет, является ли объект экземпляром класса Model.
 1. obj: unknown — объект, который нужно проверить. Тип: unknown.
 2. Возвращает true, если объект является экземпляром Model, и false в противном случае.

Свойства:
1. data, модель может содержать любые данные, определенные типом T. Эти данные передаются в конструктор в виде частичного объекта Partial<T> и присваиваются экземпляру модели через Object assign.
2. events, событийный объект, который используется для управления событиями, связанными с моделью. Тип: IEvents.

### Компоненты модели данных

#### Класс AppState

Класс AppState представляет состояние всего приложения и наследуется от базового класса Model. Он используется для управления состоянием корзины, товаров и заказа.

Свойства
basket: Product[] — Корзина с товарами.
store: Product[] — Массив со всеми товарами.
order: IOrder — Объект заказа клиента.
formErrors: FormErrors — Объект с ошибками форм.

Конструктор
constructor(data: Partial<IAppState>, events: IEvents)
Конструктор принимает два параметра:
- data: Partial<IAppState> — начальные данные для состояния приложения.
- events: IEvents — объект для управления событиями.

Методы

- addToBasket, добавляет продукт в корзину.
- deleteFromBasket, удаляет продукт из корзины по его идентификатору.
- clearBasket, очищает корзину.
- getBasketAmount, возвращает количество продуктов в корзине.
- setItems, устанавливает идентификаторы товаров в заказе на основе корзины.
- setOrderField, устанавливает значение поля заказа и валидирует данные заказа и контактные данные.
- validateContacts, валидирует контактные данные и генерирует события в случае ошибок.
- validateOrder, валидирует данные заказа и генерирует события в случае ошибок.
- refreshOrder, сбрасывает данные заказа.
- getTotalBasketPrice, возвращает общую стоимость товаров в корзине.
- setStore, устанавливает товары в хранилище и генерирует событие изменения товаров.
- resetSelected, сбрасывает состояние выбранных товаров в хранилище.

#### Класс Card 

Класс Card представляет собой базовый компонент для карточки товара. Он предоставляет методы и свойства для управления элементами карточки, такими как заголовок, изображение, категория, цена и кнопка действия.

Параметры
Класс Card принимает дженерик ICard, который представляет тип данных для карточки товара.

Свойства
_title: HTMLElement — элемент заголовка карточки.
_image: HTMLImageElement — элемент изображения карточки.
_category: HTMLElement — элемент категории карточки.
_price: HTMLElement — элемент цены карточки.
_button: HTMLButtonElement — кнопка действия карточки.
Конструктор
constructor(blockName: string, container: HTMLElement, actions?: ICardActions)

Конструктор принимает три параметра:

blockName: string — имя блока для определения классов CSS.
container: HTMLElement — корневой элемент карточки.
actions?: ICardActions — объект с функцией обратного вызова для обработки событий клика.
В конструкторе устанавливаются ссылки на внутренние элементы карточки и добавляются обработчики событий.

Методы
- set id(value: string) - устанавливает уникальный идентификатор карточки.
- get id(): string - возвращает уникальный идентификатор карточки.
- set title(value: string) - устанавливает заголовок карточки.
- get title(): string - возвращает заголовок карточки.
- set image(value: string) - устанавливает изображение карточки.
- set selected(value: boolean) - устанавливает состояние выбора карточки.
- set price(value: number | null) - устанавливает цену карточки.
- set category(value: CategoryType) - устанавливает категорию карточки.

#### Компоненты представления

#### Класс Basket

Класс Basket представляет корзину покупок и наследуется от базового класса Component<IBasketView>. Он используется для управления и отображения корзины в интерфейсе пользователя.

Свойства
_list: HTMLElement — Элемент списка корзины.
_total: HTMLElement — Элемент, отображающий общую стоимость товаров.
_button: HTMLButtonElement — Кнопка для оформления заказа.

Конструктор
constructor(container: HTMLElement, events: EventEmitter)

Конструктор принимает два параметра:
container: HTMLElement — корневой элемент, в который будет встроен компонент.
events: EventEmitter — объект для управления событиями.
Методы
- items, устанавливает элементы в корзину и обновляет интерфейс.
- selected, устанавливает выбранные элементы и обновляет состояние кнопки.
- total, устанавливает общую стоимость товаров и обновляет интерфейс.

#### Класс BasketItem

Класс BasketItem представляет отдельный элемент корзины и наследуется от базового класса Component<IBasketItem>. Он используется для отображения информации о продукте в корзине.
Свойства
_title: HTMLElement — Элемент, отображающий название продукта.
_id: HTMLElement — Элемент, отображающий идентификатор продукта.
_price: HTMLElement — Элемент, отображающий цену продукта.
_button: HTMLButtonElement — Кнопка для взаимодействия с продуктом.
_prices: number[] — Массив цен для продукта.
онструктор
constructor(container: HTMLElement, actions?: IClick)

Конструктор принимает два параметра:

container: HTMLElement — корневой элемент, в который будет встроен компонент.
actions?: IClick — объект, содержащий обработчик событий для кнопки.
Методы
- title, устанавливает название продукта и обновляет интерфейс.
- id, устанавливает идентификатор продукта и обновляет интерфейс.
- price, устанавливает цену продукта и обновляет интерфейс.

#### Класс Form

Класс Form представляет собой компонент для работы с HTML-формами и наследуется от базового класса Component<IFormState>. Он используется для управления состоянием формы, валидацией и обработки событий ввода и отправки.

Параметры
Класс Form принимает дженерик T, который представляет тип данных формы.

Свойства
_submit: HTMLButtonElement — Кнопка отправки формы.
_errors: HTMLElement — Элемент для отображения ошибок формы.
Конструктор
constructor(container: HTMLFormElement, events: IEvents)

Конструктор принимает два параметра:

container: HTMLFormElement — корневой элемент формы.
events: IEvents — объект для управления событиями.
В конструкторе устанавливаются обработчики событий ввода и отправки формы.

Методы
- onInputChange, метод вызывается при изменении значения поля ввода и генерирует событие с обновленным значением поля.
- valid, сеттер для свойства valid. Управляет состоянием кнопки отправки формы (включена или отключена).
- errors, сеттер для свойства errors. Обновляет текст ошибок в интерфейсе.
- render, метод рендеринга. Принимает состояние формы и обновляет интерфейс на основе переданных данных.

Класс Form<T> предназначен для работы с HTML-формами, управления их состоянием, валидацией и обработки событий. Он предоставляет методы для установки валидности формы, отображения ошибок и рендеринга состояния. Использование дженерика T позволяет гибко определять тип данных формы, что делает этот класс универсальным для различных форм.

#### Класс Modal

Класс Modal представляет собой компонент модального окна и наследуется от базового класса Component<IModalData>. Он используется для управления состоянием модального окна, включая открытие и закрытие, а также установку контента внутри модального окна.

Параметры
Класс Modal принимает дженерик IModalData, который представляет тип данных для модального окна.

Свойства
_closeButton: HTMLButtonElement — Кнопка закрытия модального окна.
_content: HTMLElement — Элемент для отображения содержимого модального окна.
Конструктор
constructor(container: HTMLElement, events: IEvents)

Конструктор принимает два параметра:

container: HTMLElement — корневой элемент модального окна.
events: IEvents — объект для управления событиями.
В конструкторе устанавливаются обработчики событий для кнопки закрытия и самого модального окна.

Методы
- content, сеттер для свойства content. Обновляет содержимое модального окна.
- open, метод для открытия модального окна. Добавляет класс modal_active и генерирует событие modal:open.
- close, метод для закрытия модального окна. Удаляет класс modal_active, очищает содержимое и генерирует событие modal:close.
- render, метод рендеринга. Принимает данные для модального окна, обновляет интерфейс и открывает модальное окно.

Класс Modal предназначен для управления модальными окнами в приложении. Он предоставляет методы для открытия и закрытия модального окна, а также для установки его содержимого. Использование дженерика IModalData позволяет гибко определять тип данных для модального окна, что делает этот класс универсальным для различных ситуаций.


#### Класс StoreItem

Класс StoreItem наследуется от класса Card и используется для создания элемента товара в магазине.

Конструктор
constructor(container: HTMLElement, actions?: ICardActions)

Параметры:
container: HTMLElement - корневой элемент карточки товара.
actions?: ICardActions - объект с функцией обратного вызова для обработки событий клика.

#### Класс StoreItemPreview

Класс StoreItemPreview также является дочерним классом Card и расширяет функционал карточки, добавляя элемент описания товара.
Конструктор
constructor(container: HTMLElement, actions?: ICardActions)

Параметры:
container: HTMLElement - корневой элемент карточки товара.
actions?: ICardActions - объект с функцией обратного вызова для обработки событий клика.
Свойства:
_description: HTMLElement - элемент описания товара.
Методы:
set description(value: string) - устанавливает описание товара.

#### Класс OrderContact

Класс OrderContact наследуется от Form<IOrderContactsForm> и представляет собой форму для ввода контактных данных заказа. Он используется для управления полями ввода телефона и электронной почты.

Конструктор
constructor(container: HTMLFormElement, events: IEvents)

Параметры:
container: HTMLFormElement - HTML-форма, в которой содержатся поля для ввода контактных данных.
events: IEvents - объект для управления событиями.

Свойства:
container: HTMLFormElement - HTML-форма, содержащая элементы формы.
events: IEvents - объект для управления событиями.

#### Класс OrderAddress

Класс OrderAddress наследуется от Form<IOrderAddressForm> и представляет собой форму для ввода адресных данных заказа, а также для выбора способа оплаты.

Конструктор
constructor(container: HTMLFormElement, events: IEvents)

Параметры:
container: HTMLFormElement - HTML-форма, в которой содержатся поля для ввода адресных данных.
events: IEvents - объект для управления событиями.

Свойства:
payment: string - строка, представляющая способ оплаты.
_containerPay: HTMLDivElement - контейнер для кнопок выбора способа оплаты.
_buttonsPayCash: HTMLButtonElement - кнопка для выбора оплаты наличными.
_buttonsPayOnline: HTMLButtonElement - кнопка для выбора оплаты онлайн.

Методы:
set address(value: string) - устанавливает значение для поля ввода адреса.
protected setPayment(field: keyof IOrderForm, value: string) - устанавливает способ оплаты и отправляет событие.

Классы OrderContact и OrderAddress используются для создания форм ввода контактных и адресных данных соответственно. Оба класса наследуются от базового класса Form и имеют специфические методы и свойства для управления формами.


#### Класс Page

Класс Page наследуется от Component<IPage> и представляет собой компонент главной страницы, включающий в себя счетчик товаров в корзине, каталог товаров и возможность блокировки прокрутки страницы.

Конструктор
constructor(container: HTMLElement, events: IEvents)

Параметры:

container: HTMLElement - родительский элемент страницы.
events: IEvents - объект для управления событиями.
Свойства:

counter: HTMLElement - элемент, отображающий количество товаров в корзине.
catalog: HTMLElement - элемент, содержащий список товаров.
wrapper: HTMLElement - элемент-обертка для всей страницы.
basket: HTMLElement - элемент корзины, который открывает корзину при клике.

Методы:
- set counter(value: number), устанавливает значение для счетчика товаров в корзине.
- set catalog(items: HTMLElement[]), устанавливает список товаров на странице.
- set locked(value: boolean), блокирует или разблокирует прокрутку страницы.

#### Класс Success

Класс Success является компонентом для отображения сообщения об успешном заказе. Он принимает объект ISuccess в качестве данных для отображения и объект ISuccessActions для определения действия при закрытии сообщения.

Конструктор
constructor(container: HTMLElement, actions: ISuccessActions)

Параметры:
container: HTMLElement - HTML-элемент, в который будет вставлен компонент.
actions: ISuccessActions - объект, содержащий обработчик события закрытия сообщения.

Свойства:
_close: HTMLElement - ссылка на HTML-элемент для закрытия сообщения.
_total: HTMLElement - ссылка на HTML-элемент для отображения общей суммы заказа.

Методы:
set total(total: number), устанавливает общую сумму заказа и отображает сообщение об этом.

Класс Success используется для создания компонента, отображающего сообщение об успешном заказе. При необходимости, можно передать обработчик события для закрытия сообщения.

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
	category: string;
	price: number | null;
	isOrdered: boolean;
}

```

Интерфейс, отслеживание карточки

```

export interface IOrderStatus {
	isOrdered: boolean;
}


```
Интерфейс формы введения адреса и способа оплаты
```
export interface IOrderAddressForm {
	address: string;
	payment: string;
}

```
Интефрейс формы введения контактных данных
```

export interface IOrderContactsForm {
	email: string;
	phone: string;
}

```
Интерфейс, описывающий внутренне состояние приложения.
Используется для хранения карточек, корзины, заказа пользователя

```

export interface IAppState {
	catalog: ILot[];
	basket: ILot[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

```