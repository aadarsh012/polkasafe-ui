import axios from 'axios';
import { IQueueItem } from '../types';
import { SUBSCAN_API_HEADERS } from '../constants/subscan_consts';
import { responseMessages } from '../constants/response_messages';
import dayjs from 'dayjs';

interface IResponse {
	error?: string | null;
	data: IQueueItem[];
}

export default async function getMultisigQueueByAddress(multisigAddress: string, network: string, entries: number, page: number): Promise<IResponse> {
	const returnValue: IResponse = {
		error: '',
		data: []
	};

	try {
		const { data: response } = await axios.post(`https://${network}.api.subscan.io/api/scan/multisigs`, {
			'row': entries || 1,
			'page': page - 1 || 0, // pages start from 0
			'account': multisigAddress
		}, {
			headers: SUBSCAN_API_HEADERS
		});

		const queueItems: IQueueItem[] = [];

		if (response.data && response.data.multisig?.length) {
			for (const multisigQueueItem of response.data.multisig) {
				if (multisigQueueItem.status !== 'Approval') continue;

				const { data: multisigData } = await axios.post(`https://${network}.api.subscan.io/api/scan/multisig`, {
					'multi_id': multisigQueueItem.multi_id,
					'call_hash': multisigQueueItem.call_hash
				}, {
					headers: SUBSCAN_API_HEADERS
				});

				const newQueueItem: IQueueItem = {
					callHash: multisigQueueItem.call_hash,
					status: multisigQueueItem.status,
					network: network,
					created_at: dayjs(multisigData?.data?.process?.reduce((minTimestamp: number, processObj: any) => {
						return processObj?.timestamp < minTimestamp ? processObj?.timestamp : minTimestamp;
					}, Infinity)).toDate(),
					threshold: multisigQueueItem.threshold,
					approvals: multisigData?.data?.process?.filter((item: any) => item.status === 'Approval').map((item: any) => item.account_display.address)
				};

				queueItems.push(newQueueItem);
			}
		}

		returnValue.data = queueItems;
	} catch (err) {
		console.log('Error in getTransfersByAddress:', err);
		returnValue.error = String(err) || responseMessages.transfers_fetch_error;
	}

	return returnValue;
}
