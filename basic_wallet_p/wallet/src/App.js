import React, { useEffect, useState } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';

import Users from './components/Users';

import { PageHeader, Pagination } from 'antd';
import 'antd/dist/antd.css';

const App = (props) => {
	const [ isLoaded, setIsLoaded ] = useState(true);
	const [ users, setUsers ] = useState([ 'bob', 'erin', 'alice' ]);

	// useEffect(
	// 	() => {
	// 		setUser(props.match.params.id);
	// 	},
	// 	[ props.match.params.id ]
	// );

	return (
		<div className='App'>
			<Switch>
				<Route path='/' exact>
					<PageHeader
						style={{
							border: '1px solid rgb(235, 237, 240)'
						}}
						title='LambdaWallet'
					/>
				</Route>
				<Route
					path='/wallet/:id?'
					render={(props) => (
						<PageHeader
							style={{
								border: '1px solid rgb(235, 237, 240)'
							}}
							onBack={() => props.history.push('/')}
							title='LambdaWallet'
							subTitle={<Users user={props.match.params.id} users={users} isLoaded={isLoaded} />}
						/>
					)}
				/>
				<Route
					render={(props) => (
						<PageHeader
							style={{
								border: '1px solid rgb(235, 237, 240)'
							}}
							onBack={() => props.history.push('/')}
							title='Page Not Found'
						/>
					)}
				/>
			</Switch>
		</div>
	);
};

export default withRouter(App);
