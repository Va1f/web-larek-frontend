import { Api, ApiListResponse } from './base/api';
import { IOrderAPI, ILot } from '../types';

export interface ILarekAPI {
	getLotList: () => Promise<ILot[]>;
	getLotItem: (id: string) => Promise<ILot>;
	orderLots: (order: IOrderAPI) => Promise<IOrderAPI>;
}

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getLotItem(id: string): Promise<ILot> {
		return this.get(`/product/${id}`).then((item: ILot) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getLotList(): Promise<ILot[]> {
		return this.get('/product').then((data: ApiListResponse<ILot>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
				isOrdered: false,
			}))
		);
	}

	orderLots(order: IOrderAPI): Promise<IOrderAPI> {
		return this.post('/order', order).then((data: IOrderAPI) => data);
	}
}