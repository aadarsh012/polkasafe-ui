// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, MenuProps, Modal } from 'antd';
import { Checkbox, Dropdown } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useGlobalApiContext } from 'src/context/ApiContext';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { firebaseFunctionsHeader } from 'src/global/firebaseFunctionsHeader';
import { FIREBASE_FUNCTIONS_URL } from 'src/global/firebaseFunctionsUrl';
import { CHANNEL,ITriggerPreferences, NotificationStatus } from 'src/types';
import { BellIcon, CircleArrowDownIcon, DiscordIcon, MailIcon, OutlineCloseIcon, TelegramIcon } from 'src/ui-components/CustomIcons';
import PrimaryButton from 'src/ui-components/PrimaryButton';
import queueNotification from 'src/ui-components/QueueNotification';

import DiscordInfoModal from './DiscordInfoModal';
import SlackInfoModal from './SlackInfoModal';
import TelegramInfoModal from './TelegramInfoModal';

const Notifications = () => {

	const { network } = useGlobalApiContext();
	const { notification_preferences, setUserDetailsContextState } = useGlobalUserDetailsContext();
	const [notifyAfter, setNotifyAfter] = useState<number>(2);
	const [email, setEmail] = useState<string>('');
	const [emailValid, setEmailValid] = useState<boolean>(true);
	const [newTxn, setNewTxn] = useState<boolean>(true);
	const [txnExecuted, setTxnExecuted] = useState<boolean>(true);
	const [pendingTxn, setPendingTxn] = useState(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [verificationLoading, setVerificationLoading] = useState<boolean>(false);

	const [openTelegramModal, setOpenTelegramModal] = useState<boolean>(false);
	const [openDiscordModal, setOpenDiscordModal] = useState<boolean>(false);
	const [openSlackModal, setOpenSlackModal] = useState<boolean>(false);

	const emailVerificationRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	useEffect(() => {
		if(email){
			const validEmail = emailVerificationRegex.test(email);
			if(validEmail){
				setEmailValid(true);
			}
			else{
				setEmailValid(false);
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]);

	useEffect(() => {
		const triggerPreferences = notification_preferences?.triggerPreferences;
		if(triggerPreferences){
			setNewTxn(triggerPreferences?.newTransaction);
			setTxnExecuted(triggerPreferences?.transactionExecuted);
			setPendingTxn(triggerPreferences?.pendingTransaction === 0 ? false : true);
			setNotifyAfter(triggerPreferences?.pendingTransaction || 2);
		}
	}, [notification_preferences]);

	const notifyAfterHours: MenuProps['items'] = [1, 2, 4, 6, 8, 12, 24, 48].map((hr) => {
		return {
			key: hr,
			label: <span className={`${hr === notifyAfter ? 'text-primary' : 'text-white'}`}>{hr === 1 ? `${hr} hr` : `${hr} hrs`}</span>
		};
	});

	const onNotifyHoursChange: MenuProps['onClick'] = ({ key }) => {
		setNotifyAfter(Number(key));
		updateNotificationPreferences({ executed: txnExecuted, newT: newTxn, notifyHr: Number(key), pending: true });
	};

	const updateNotificationPreferences = async ({ executed, newT, notifyHr, pending }: { newT: boolean, executed: boolean, pending: boolean, notifyHr: number }) => {

		try{
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if(!userAddress || !signature) {
				console.log('ERROR');
				return;
			}
			else{
				const newPreferences: ITriggerPreferences = {
					newTransaction: newT,
					pendingTransaction: pending ? notifyHr : 0,
					transactionExecuted: executed
				};
				setLoading(true);

				const updateNotificationTriggerRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/updateNotificationTriggerPreferences`, {
					body: JSON.stringify({
						triggerPreferences: newPreferences
					}),
					headers: firebaseFunctionsHeader(network),
					method: 'POST'
				});

				const { data: updateNotificationTriggerData, error: updateNotificationTriggerError } = await updateNotificationTriggerRes.json() as { data: string, error: string };

				if(updateNotificationTriggerError) {
					queueNotification({
						header: 'Failed!',
						message: updateNotificationTriggerError,
						status: NotificationStatus.ERROR
					});
					setLoading(false);
					return;
				}

				if(updateNotificationTriggerData){
					queueNotification({
						header: 'Success!',
						message: 'Your Notification Preferences has been Updated.',
						status: NotificationStatus.SUCCESS
					});
					setUserDetailsContextState(prev => ({
						...prev,
						notification_preferences: { ...prev.notification_preferences, triggerPreferences: newPreferences }
					}));
					setLoading(false);
				}

			}
		} catch (error){
			console.log('ERROR', error);
			queueNotification({
				header: 'Failed!',
				message: 'Error in Updating Notification Preferences.',
				status: NotificationStatus.ERROR
			});
			setLoading(false);
		}
	};

	const verifyEmail = async () => {

		try{
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if(!userAddress || !signature) {
				console.log('ERROR');
				return;
			}
			else{
				setVerificationLoading(true);

				const verifyTokenRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/notify`, {
					body: JSON.stringify({
						args:{
							email: email
						},
						trigger: 'verifyEmail'
					}),
					headers: { ...firebaseFunctionsHeader(network), 'x-api-key': process.env.NOTIFICATION_ENGINE_API_KEY || '', 'x-source': 'polkasafe' },
					method: 'POST'
				});

				const { data: verifyEmailUpdate, error: verifyTokenError } = await verifyTokenRes.json() as { data: string, error: string };

				if(verifyTokenError) {
					queueNotification({
						header: 'Failed!',
						message: verifyTokenError,
						status: NotificationStatus.ERROR
					});
					setVerificationLoading(false);
					return;
				}

				if(verifyEmailUpdate){
					queueNotification({
						header: 'Success!',
						message: 'Verification Email Sent.',
						status: NotificationStatus.SUCCESS
					});
					setUserDetailsContextState(prev => ({
						...prev,
						notification_preferences: { ...prev.notification_preferences, channelPreferences: {
							...prev.notification_preferences.channelPreferences,
							['email']: {
								enabled: false,
								handle: email,
								name: CHANNEL.EMAIL,
								verified: false
							}
						} }
					}));
					setVerificationLoading(false);
				}

			}
		} catch (error){
			console.log('ERROR', error);
			queueNotification({
				header: 'Failed!',
				message: 'Error in Sending Verification Email.',
				status: NotificationStatus.ERROR
			});
			setVerificationLoading(false);
		}
	};

	const getVerifyToken = async (channel: CHANNEL) => {

		try{
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if(!userAddress || !signature) {
				console.log('ERROR');
				return;
			}
			else{

				const verifyTokenRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/getChannelVerifyToken`, {
					body: JSON.stringify({
						channel
					}),
					headers: firebaseFunctionsHeader(network),
					method: 'POST'
				});

				const { data: verifyToken, error: verifyTokenError } = await verifyTokenRes.json() as { data: string, error: string };

				if(verifyTokenError) {
					queueNotification({
						header: 'Failed!',
						message: verifyTokenError,
						status: NotificationStatus.ERROR
					});
					return;
				}

				if(verifyToken){
					return verifyToken;
				}

			}
		} catch (error){
			console.log('ERROR', error);
			queueNotification({
				header: 'Failed!',
				message: 'Error in generating token.',
				status: NotificationStatus.ERROR
			});
		}
	};

	const TelegramModal: FC = () => {
		return (
			<>
				<Button onClick={() => setOpenTelegramModal(true)} icon={<PlusCircleOutlined className='text-primary' />} className='flex items-center outline-none border-none bg-transparant text-primary'>ADD THE PSAFE BOT</Button>
				<Modal
					centered
					footer={false}
					closeIcon={
						<button
							className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center'
							onClick={() => setOpenTelegramModal(false)}
						>
							<OutlineCloseIcon className='text-primary w-2 h-2' />
						</button>}
					title={<h3 className='text-white mb-8 text-lg font-semibold flex items-center gap-x-2'><TelegramIcon className='text-text_secondary'/> How to add Den to Telegram</h3>}
					open={openTelegramModal}
					className={' w-auto md:min-w-[500px] max-w-[600px] scale-90'}
				>
					<TelegramInfoModal getVerifyToken={getVerifyToken} />
				</Modal>
			</>
		);
	};

	const DiscordModal: FC = () => {
		return (
			<>
				<Button onClick={() => setOpenDiscordModal(true)} icon={<PlusCircleOutlined className='text-primary' />} className='flex items-center outline-none border-none bg-transparant text-primary'>ADD THE PSAFE BOT</Button>
				<Modal
					centered
					footer={false}
					closeIcon={
						<button
							className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center'
							onClick={() => setOpenDiscordModal(false)}
						>
							<OutlineCloseIcon className='text-primary w-2 h-2' />
						</button>}
					title={<h3 className='text-white mb-8 text-lg font-semibold flex items-center gap-x-2'><DiscordIcon className='text-text_secondary'/> How to add Discord Bot</h3>}
					open={openDiscordModal}
					className={' w-auto md:min-w-[500px] max-w-[600px] scale-90'}
				>
					<DiscordInfoModal getVerifyToken={getVerifyToken} />
				</Modal>
			</>
		);
	};

	const SlackModal: FC = () => {
		return (
			<>
				<Button onClick={() => setOpenSlackModal(true)} icon={<PlusCircleOutlined className='text-primary' />} className='flex items-center outline-none border-none bg-transparant text-primary'>ADD THE PSAFE BOT</Button>
				<Modal
					centered
					footer={false}
					closeIcon={
						<button
							className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center'
							onClick={() => setOpenSlackModal(false)}
						>
							<OutlineCloseIcon className='text-primary w-2 h-2' />
						</button>}
					title={<h3 className='text-white mb-8 text-lg font-semibold flex items-center gap-x-2'><DiscordIcon className='text-text_secondary'/> How to add Discord Bot</h3>}
					open={openSlackModal}
					className={' w-auto md:min-w-[500px] max-w-[600px] scale-90'}
				>
					<SlackInfoModal getVerifyToken={getVerifyToken} />
				</Modal>
			</>
		);
	};

	return (
		<div className='flex flex-col gap-y-4 scale-[80%] h-[125%] w-[125%] origin-top-left'>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-text_secondary'>
				<div className='col-span-3'><span className='flex items-center gap-x-2'><BellIcon /> General</span></div>
				<div className='col-span-7'>
					<p className='mb-4'>Configure the notifications you want Polkasafe to send in your linked channels</p>
					<div className='flex flex-col gap-y-3'>
						<Checkbox disabled={loading} className='text-white m-0 [&>span>span]:border-primary' checked={newTxn} onChange={(e) => { setNewTxn(e.target.checked); updateNotificationPreferences({ executed: txnExecuted, newT: e.target.checked, notifyHr: notifyAfter, pending: pendingTxn });}}>New Transaction needs to be signed</Checkbox>
						<Checkbox disabled={loading} className='text-white m-0 [&>span>span]:border-primary' checked={txnExecuted} onChange={(e) => { setTxnExecuted(e.target.checked); updateNotificationPreferences({ executed: e.target.checked, newT: newTxn, notifyHr: notifyAfter, pending: pendingTxn });}}>Transaction has been signed and executed</Checkbox>
						<div className='flex items-center gap-x-3'>
							<Checkbox disabled={loading} className='text-white m-0 [&>span>span]:border-primary' checked={pendingTxn} onChange={(e) => { setPendingTxn(e.target.checked); updateNotificationPreferences({ executed: txnExecuted, newT: newTxn, notifyHr: notifyAfter, pending: e.target.checked });}}>For Pending Transactions remind signers every:</Checkbox>
							<Dropdown disabled={!pendingTxn || loading} className='text-white' trigger={['click']} menu={{ items: notifyAfterHours, onClick: onNotifyHoursChange }} >
								<button className={`'flex items-center gap-x-2 border ${!pendingTxn || loading ? 'border-text_secondary': 'border-primary'} rounded-md px-3 py-1 text-sm leading-[15px] text-text_secondary`}>{`${notifyAfter} ${notifyAfter === 1 ? 'hr' : 'hrs'}`} <CircleArrowDownIcon className='hidden md:inline-flex text-base text-primary'/></button>
							</Dropdown>
						</div>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4'>
				<div className='col-span-3'><span className='flex items-center gap-x-2 text-text_secondary'><MailIcon /> Email Notifications</span></div>
				<Form className='col-span-5 flex items-start gap-x-3'>
					<Form.Item
						name='email'
						rules={[{ required: true }]}
						help={!emailValid && 'Please enter a valid email'}
						className='border-0 outline-0 my-0 p-0 w-full'
						validateStatus={!emailValid ? 'error' : 'success'}
					>
						<Input
							id='email'
							onChange={(a) => setEmail(a.target.value)}
							placeholder={'Enter email'}
							className="w-full text-sm font-normal leading-[15px] border-0 outline-0 p-2 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
						/>
					</Form.Item>
					<PrimaryButton loading={verificationLoading} className={`text-white ${!email || !emailValid ? 'bg-highlight' : 'bg-primary'}`} onClick={verifyEmail} disabled={!email || !emailValid}>
						<p className='font-normal text-sm'>Verify</p>
					</PrimaryButton>
				</Form>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-white'>
				<div className='col-span-3'><span className='flex items-center gap-x-2 text-text_secondary'><TelegramIcon /> Telegram Notifications</span></div>
				<div className='col-span-5 flex items-center'>
					<TelegramModal/>
					<span>to a Telegram chat to get Telegram notifications</span>
				</div>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-white'>
				<div className='col-span-3'><span className='flex items-center gap-x-2 text-text_secondary'><DiscordIcon /> Discord Notifications</span></div>
				<div className='col-span-5 flex items-center'>
					<DiscordModal/>
					<span>to a Discord channel to get Discord notifications</span>
				</div>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-white'>
				<div className='col-span-3'><span className='flex items-center gap-x-2 text-text_secondary'><DiscordIcon /> Discord Notifications</span></div>
				<div className='col-span-5 flex items-center'>
					<SlackModal/>
					<span>to a Slack channel to get Slack notifications</span>
				</div>
			</div>
		</div>
	);
};

export default Notifications;