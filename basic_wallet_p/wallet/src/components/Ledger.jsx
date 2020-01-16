import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'react-moment';

import './Ledger.scss';

const Ledger = ({ transactions }) => {
	const { user } = useParams();
	const userTransactions = transactions[user] || [];
	const [ balance, setBalance ] = useState();

	useEffect(
		() => {
			setBalance(
				userTransactions.reduce((total, { amount, recipient }) => {
					return (total += recipient === user ? amount : 0 - amount);
				}, 0)
			);
		},
		[ user, userTransactions ]
	);

	console.log(balance);

	return (
		<div className='Ledger'>
			{userTransactions.length ? (
				<div>
					<h1>Ledger for {user}</h1>
					<h2>Balance: {balance} LC</h2>
					<div className='transactions'>
						{userTransactions.reverse().map(({ amount, recipient, sender, timestamp }) => {
							const direction = recipient === user ? 'receiver' : 'sender';
							return (
								<div className={`line-item ${direction}`}>
									<div className='field'>
										<Moment fromNow>{timestamp * 1000}</Moment>
									</div>
									<div className='field'>Sender: {sender}</div>
									<div className='field'>Recipient: {recipient}</div>
									<div className='field'>Amount: {amount}</div>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div>No transactions found</div>
			)}
		</div>
	);
};

export default Ledger;
