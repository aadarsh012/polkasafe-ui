import { ChainProperties } from './types';

export const networks = {
	POLKADOT: 'polkadot',
	KUSAMA: 'kusama'
};

export const chainProperties: ChainProperties = {
	[networks.POLKADOT]: {
		blockTime: 6000,
		keyringType: 'sr25519',
		rpcEndpoint: 'wss://rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: 'DOT'
	},
	[networks.KUSAMA]: {
		blockTime: 6000,
		keyringType: 'ed25519',
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 2,
		tokenDecimals: 12,
		tokenSymbol: 'KSM'
	}
};

export const responseMessages = {
	missing_params: 'Missing parameters.',
	invalid_params: 'Invalid parameters passed to the function call.',
	invalid_signature: 'Invalid signature.',
	internal: 'Internal error occured.',
	min_singatories: 'Minimum number of signatories is 2.',
	invalid_threshold: 'Threshold should be a number less than or equal to the number of signatories.',
	multisig_exists: 'Multisig already exists.',
	multisig_create_error: 'Error while creating multisig.',
	onchain_multisig_fetch_error: 'Error while fetching multisig from chain.'
};

export const SUBSCAN_API_KEY = '056b677410ac226bea971a3e03de66fa';
