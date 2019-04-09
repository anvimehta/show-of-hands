import React from 'react';

const CATEGORIES = [
	'Entertainment',
	'Food',
	'Lifestyle',
	'Miscellanous',
	'Survey',
	'Technology'
];

export const getCategoryOptions = () => {
	return CATEGORIES.map((category, i) =>
        <option key={i} value={i}>{category}</option>
    );
}

export default CATEGORIES;
