import React, { useEffect, useState } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Users from './components/Users';

import { PageHeader, Pagination } from 'antd';
import 'antd/dist/antd.css';

const App = (props) => {
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ users, setUsers ] = useState([]);
	const [ transactions, setTransactions ] = useState({});

	useEffect(() => {
		axios
			.get('http://0.0.0.0:5000/chain')
			.then((res) => {
				console.log('Loading...');
				let trans = {};
				res.data.chain.forEach((block) => {
					block.transactions.forEach((t) => {
						trans[t.recipient] = trans[t.recipient] ? [ ...trans[t.recipient], t ] : [ t ];
						trans[t.sender] = trans[t.sender] ? [ ...trans[t.sender], t ] : [ t ];
					});
				});

				setUsers(Object.keys(trans).filter((sender) => sender !== '0'));
				setIsLoaded(true);

				console.log('Finished loading');
			})
			.catch((err) => {
				setIsLoaded(true);
			});
	}, []);

	return (
		<div className='App'>
			<Switch>
				<Route
					path='/:id?'
					render={(props) => (
						<PageHeader
							style={{
								border: '1px solid rgb(235, 237, 240)'
							}}
							title='LambdaWallet'
							subTitle={<Users user={props.match.params.id} users={users} isLoaded={isLoaded} />}
						/>
					)}
				/>
			</Switch>
		</div>
	);
};

export default withRouter(App);
