import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';
import { Menu, Dropdown, Icon, Button, Modal, Input } from 'antd';

const Users = (props) => {
	const { user } = useParams();
	const { users, isLoaded } = props;
	const [ selected, setSelected ] = useState('Loading...');
	const [ userList, setUserList ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const newUserRef = useRef();
	const filterUsers = (users, filter) => users.filter((u) => u !== filter && u !== 'Choose a user').sort();

	const selectUser = ({ key }) => {
		if (key !== 'wait') {
			setSelected(key);
			setUserList(filterUsers([ ...userList, selected ], key));
		}
	};

	const handleOk = () => {
		const newUser = newUserRef.current.input;
		setVisible(false);
		setSelected(newUser.value);
		props.history.push(`/${newUser.value}`);
		newUser.value = '';
	};

	const handleCancel = () => {
		const newUser = newUserRef.current.input;
		newUser.value = '';
		setVisible(false);
	};

	useEffect(
		() => {
			if (user) {
				setSelected(user);
			} else if (users.length !== 0) {
				setSelected(users[0]);
			} else if (isLoaded && !users.length) {
				setSelected('No users found');
			}
			setUserList(filterUsers(users, selected));
		},
		[ selected, user, users, isLoaded ]
	);

	const menu = (
		<Menu onClick={selectUser}>
			{isLoaded &&
				userList.map((current) => (
					<Menu.Item key={current}>
						<Link to={`/${current}`}>{current}</Link>
					</Menu.Item>
				))}
		</Menu>
	);

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
			<Button
				onClick={() => setVisible(true)}
				style={{ marginLeft: '10px', fontSize: '12px' }}
				type='primary'
				size='small'
			>
				New
				<Icon type='plus-circle' />
			</Button>
			<Modal title='Add user' visible={visible} onOk={handleOk} onCancel={handleCancel}>
				<Input ref={newUserRef} placeholder='username' onPressEnter={handleOk} />
			</Modal>
		</div>
	);
};

export default withRouter(Users);
