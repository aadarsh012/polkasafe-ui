// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Identicon from '@polkadot/react-identicon';
import { Divider, message } from 'antd';
import React, { FC } from 'react';
import { useModalContext } from 'src/context/ModalContext';
import { CopyIcon, DeleteIcon, EditIcon, ExternalLinkIcon } from 'src/ui-components/CustomIcons';
import PrimaryButton from 'src/ui-components/PrimaryButton';

import EditAddress from './Edit';
import RemoveAddress from './Remove';

export interface IAddress {
	name: string;
	address: string;
}
interface IAddressProps {
    address: IAddress[];
}

const AddAddress: FC<IAddressProps> = ({ address }) => {
	const { openModal } = useModalContext();
	return (
		<div className='text-sm font-medium leading-[15px] '>
			<article className='grid grid-cols-4 gap-x-5 bg-bg-secondary text-text_secondary py-5 px-4 rounded-lg'>
				<span className='col-span-1'>
					Name
				</span>
				<span className='col-span-2'>
					Address
				</span>
				<span className='col-span-1'>
					Action
				</span>
			</article>
			{
				address.map(({ address, name }, index) => {
					const handleCopy = () => {
						navigator.clipboard.writeText(`${address}`);
						message.success('Copied!');
					};
					return (
						<>
							<article className='grid grid-cols-4 gap-x-5 py-6 px-4 text-white' key={index}>
								<p title={name} className='max-w-[100px] sm:w-auto overflow-hidden text-ellipsis col-span-1 flex items-center text-xs sm:text-sm'>
									{name}
								</p>
								<div className='col-span-2 flex items-center'>
									<Identicon
										className='image identicon mx-2'
										value={address}
										size={30}
										theme={'polkadot'}
									/>
									<span title={address} className='hidden sm:block ml-[6px] max-w-md text-ellipsis overflow-hidden'>{address}</span>
									<div className='ml-[14px] text-text_secondary text-base flex items-center gap-x-[6px]'>
										<button className='hover:text-primary' onClick={handleCopy}><CopyIcon /></button>
										<ExternalLinkIcon />
									</div>
								</div>
								<div className='col-span-1 flex items-center gap-x-[10px]'>
									<button
										onClick={() => openModal('Edit Address', <EditAddress />) }
										className='text-primary bg-highlight flex items-center justify-center p-1 sm:p-2 rounded-md sm:rounded-lg text-xs sm:text-sm w-6 h-6 sm:w-8 sm:h-8'>
										<EditIcon />
									</button>
									<button
										onClick={() => openModal('Remove Address', <RemoveAddress />) }
										className='text-failure bg-failure bg-opacity-10 flex items-center justify-center p-1 sm:p-2 rounded-md sm:rounded-lg text-xs sm:text-sm w-6 h-6 sm:w-8 sm:h-8'>
										<DeleteIcon />
									</button>
									<PrimaryButton className='bg-primary text-white w-fit'>
										<p className='font-normal text-sm'>Send</p>
									</PrimaryButton>
								</div>
							</article>
							{address.length - 1 !== index? <Divider className='bg-text_secondary my-0' />: null}
						</>
					);
				})
			}
		</div>
	);
};

export default AddAddress;