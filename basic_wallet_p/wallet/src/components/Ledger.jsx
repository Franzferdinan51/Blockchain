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

	return (
		<div className='Ledger'>
			{user && userTransactions.length ? (
				<div>
					<h1>Ledger for {user}</h1>
					<h2>Balance: {balance} LC</h2>
					<div className='transactions'>
						{userTransactions.reverse().map(({ amount, recipient, sender, timestamp }) => {
							return (
								<div className='line-item'>
									<div className='field'>
										<strong>
											<Moment fromNow>{timestamp * 1000}</Moment>
										</strong>
									</div>
									{recipient === user ? (
										<div className='field'>
											<strong>From:</strong> {sender}
										</div>
									) : (
										<div className='field'>
											<strong>To:</strong> {recipient}
										</div>
									)}
									{recipient === user ? (
										<div className='field receiver'>+{amount}</div>
									) : (
										<div className='field sender'>-{amount}</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div>
					<h1>No transactions found</h1>
				</div>
			)}
		</div>
	);
};

export default Ledger;
