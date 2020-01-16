import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';

const Users = ({ user, users, isLoaded }) => {
	const filterUsers = (users, filter) => users.filter((u) => u !== filter && u !== 'Choose a user').sort();
	const [ selected, setSelected ] = useState('Loading...');
	const [ userList, setUserList ] = useState([]);

	const selectUser = ({ key }) => {
		if (key !== 'wait') {
			setSelected(key);
			setUserList(filterUsers([ ...userList, selected ], key));
		}
	};

	useEffect(
		() => {
			if (user) {
				setSelected(user);
			} else if (isLoaded && !users.length) {
				setSelected('No users found');
			} else if (users.length) {
				setSelected('Choose a user');
				setUserList(filterUsers(users, user));
			}
		},
		[ user, users, isLoaded ]
	);

	const menu = (
		<Menu onClick={selectUser}>
			{isLoaded ? (
				userList.map((current) => (
					<Menu.Item key={current}>
						<Link to={`/${current}`}>{current}</Link>
					</Menu.Item>
				))
			) : (
				<Menu.Item key={'wait'}>Loading users...</Menu.Item>
			)}
		</Menu>
	);

	console.log(isLoaded, users);

	return (
		<div>
			{users.length > 1 ? (
				<Dropdown overlay={menu}>
					<a>
						{selected} <Icon type='down' />
					</a>
				</Dropdown>
			) : (
				<a>{selected}</a>
			)}
		</div>
	);
};

export default Users;
