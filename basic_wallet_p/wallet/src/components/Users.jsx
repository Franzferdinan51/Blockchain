import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';

const Users = ({ user, users, isLoaded }) => {
	const filterUsers = (users, filter) => users.filter((u) => u != filter && u != 'Choose a user').sort();
	const [ selected, setSelected ] = useState(user ? user : isLoaded ? 'Choose a user' : 'Loading wallets...');
	const [ userList, setUserList ] = useState(filterUsers(users, selected));

	const selectUser = ({ key }) => {
		setSelected(key);
		setUserList(filterUsers([ ...userList, selected ], key));
	};

	const menu = isLoaded && (
		<Menu onClick={selectUser}>
			{userList.map((current) => (
				<Menu.Item key={current}>
					<Link to={`/wallet/${current}`}>{current}</Link>
				</Menu.Item>
			))}
		</Menu>
	);

	return (
		<Dropdown overlay={menu}>
			<a>
				{selected} <Icon type='down' />
			</a>
		</Dropdown>
	);
};

export default Users;
