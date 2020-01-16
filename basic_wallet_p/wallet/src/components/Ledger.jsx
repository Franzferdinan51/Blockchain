import React from 'react';
import { useParams } from 'react-router-dom';

const Ledger = (props) => {
	const { user } = useParams();
	return <div className='Ledger'>Ledger for {user}</div>;
};

export default Ledger;
