// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Divider, message,Timeline } from 'antd';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import profileImg from 'src/assets/icons/profile-img.png';
import { ArrowRightIcon, Circle3DotsIcon, CirclePlusIcon, ClockIcon, CopyIcon, ExternalLinkIcon } from 'src/ui-components/CustomIcons';
import styled from 'styled-components';

interface ISentInfoProps {
	amount: string;
	amountType: string;
	date: string;
	time: string;
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SentInfo: FC<ISentInfoProps> = (props) => {
	const { amount, amountType, className, date, time } = props;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [address, setAddress] = useState('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLs');
	const handleCopy = () => {
		navigator.clipboard.writeText(`${address}`);
		message.success({
			className: 'fixed top-2 w-[100%] m-auto',
			content: 'Copied'
		});
	};
	return (
		<div
			className={classNames('flex gap-x-4', className)}
		>
			<article
				className='p-4 rounded-lg bg-bg-main flex-1'
			>
				<p
					className='flex items-center gap-x-1 text-white font-medium text-sm leading-[15px]'
				>
					<span>
							Received
					</span>
					<span
						className='text-failure'
					>
						{amount} {amountType}
					</span>
					<span>
							from:
					</span>
				</p>
				<div
					className='mt-3 flex items-center gap-x-4'
				>
					<img className='w-10 h-10 block' src={profileImg} alt="profile image" />
					<div
						className='flex flex-col gap-y-[6px]'
					>
						<p
							className='font-medium text-sm leading-[15px] text-white'
						>
								Akshit
						</p>
						<p
							className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'
						>
							<span>
								{address}
							</span>
							<span
								className='flex items-center gap-x-2 text-sm'
							>
								<button onClick={handleCopy}><CopyIcon className='hover:text-primary'/></button>
								<ExternalLinkIcon />
							</span>
						</p>
					</div>
				</div>
				<Divider className='bg-text_secondary my-5' />
				<div
					className='flex items-center justify-between gap-x-5'
				>
					<span
						className='text-text_secondary font-normal text-sm leading-[15px]'
					>
							Txn Hash:
					</span>
					<p
						className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'
					>
						<span
							className='text-white font-normal text-sm leading-[15px]'
						>
								0xfb92...ed30
						</span>
						<span
							className='flex items-center gap-x-2 text-sm'
						>
							<button onClick={handleCopy}><CopyIcon className='hover:text-primary'/></button>
							<ExternalLinkIcon />
						</span>
					</p>
				</div>
				<div
					className='flex items-center justify-between gap-x-5 mt-3'
				>
					<span
						className='text-text_secondary font-normal text-sm leading-[15px]'
					>
							Created:
					</span>
					<p
						className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'
					>
						<span
							className='text-white font-normal text-sm leading-[15px]'
						>
							{date}, {time}
						</span>
					</p>
				</div>
				<div
					className='flex items-center justify-between gap-x-5 mt-3'
				>
					<span
						className='text-text_secondary font-normal text-sm leading-[15px]'
					>
							Executed:
					</span>
					<p
						className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'
					>
						<span
							className='text-white font-normal text-sm leading-[15px]'
						>
							{date}, {time}
						</span>
					</p>
				</div>
				<p
					className='text-primary font-medium text-sm leading-[15px] mt-5 flex items-center gap-x-3'
				>
					<span className='cursor-pointer'>
                        Advanced Details
					</span>
					<ArrowRightIcon />
				</p>
			</article>
			<article
				className='p-8 rounded-lg bg-bg-main max-w-[328px] w-full'
			>
				<div>
					<Timeline
						className=''
					>
						<Timeline.Item
							dot={
								<span className='bg-success bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6'>
									<CirclePlusIcon className='text-success text-sm' />
								</span>
							}
							className='success'
						>
							<div
								className='text-white font-normal text-sm leading-[15px]'
							>
                                Created
							</div>
						</Timeline.Item>
						<Timeline.Item
							dot={
								<span className='bg-waiting bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6'>
									<ClockIcon className='text-waiting text-sm' />
								</span>
							}
							className='warning'
						>
							<div
								className='text-white font-normal text-sm leading-[15px]'
							>
                                Confirmations <span className='text-text_secondary'>(1 of 2)</span>
							</div>
						</Timeline.Item>
						<Timeline.Item
							dot={
								<span className='bg-waiting bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6'>
									<Circle3DotsIcon className='text-waiting text-sm' />
								</span>
							}
							className='warning'
						>
							<div
								className='text-primary font-normal text-sm leading-[15px] bg-highlight px-2 py-1 rounded-md'
							>
                                Show All Confirmations
							</div>
						</Timeline.Item>
						<Timeline.Item
							dot={
								<span className='bg-waiting bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6'>
									<ClockIcon className='text-waiting text-sm' />
								</span>
							}
							className='warning'
						>
							<div
								className='text-white font-normal text-sm leading-[15px]'
							>
								<p>Executed</p>
								<div
									className='mt-2 flex items-center gap-x-4'
								>
									<p className='text-text_secondary'>The transaction will be executed once the threshold is reached.</p>
								</div>
							</div>
						</Timeline.Item>
					</Timeline>
				</div>
			</article>
		</div>
	);
};

export default styled(SentInfo)`
    .ant-timeline-item-tail {
        border-inline-width: 0.5px !important;
    }
    .ant-timeline-item-last {
        padding: 0;
    }
    .ant-timeline-item:not(:first-child, :last-child) {
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .ant-timeline-item-content {
        display: flex;
        min-height: 24px !important;
        height: auto !important;
        align-items: center;
    }
    .success .ant-timeline-item-tail {
        border-inline-color: #06D6A0;
    }
    .warning .ant-timeline-item-tail {
        border-inline-color: #FF9F1C;
    }
`;