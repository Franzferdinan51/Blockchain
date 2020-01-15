import React, { useEffect, useState } from 'react';
import { withRouter, Route, Switch, useParams } from 'react-router-dom';
import { PageHeader, Pagination } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

const App = (props) => {
	const [ users, setUsers ] = useState([]);

	useEffect(() => {
		return null;
	}, []);

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
							subTitle={props.match.params.id || null}
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
