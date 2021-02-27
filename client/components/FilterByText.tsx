import { Box, Icon, TextInput, Button } from '@rocket.chat/fuselage';
import React, { FC, ChangeEvent, FormEvent, memo, useCallback, useEffect, useState } from 'react';

import { useTranslation } from '../contexts/TranslationContext';

type FilterByTextProps = {
	placeholder?: string;
	onChange: (filter: { text: string }) => void;
	displayButton: boolean;
	textButton: string;
	onButtonClick: () => void;
	inputRef: () => void;
};

const FilterByText: FC<FilterByTextProps> = ({
	placeholder,
	onChange: setFilter,
	displayButton: display = false,
	textButton = '',
	onButtonClick,
	inputRef,
	...props
}) => {
	const t = useTranslation();

	const [text, setText] = useState('');

	const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setText(event.currentTarget.value);
	}, []);

	useEffect(() => {
		setFilter({ text });
	}, [setFilter, text]);

	const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	}, []);

	return <Box mb='x16' is='form' onSubmit={handleFormSubmit} display='flex' flexDirection='row' {...props}>
<<<<<<< HEAD
		<TextInput placeholder={placeholder ?? t('Search')} autoFocus={true} addon={<Icon name='magnifier' size='x20'/>} onChange={handleInputChange} value={text} />
=======
		<TextInput placeholder={placeholder ?? t('Search')} ref={inputRef} addon={<Icon name='magnifier' size='x20'/>} onChange={handleInputChange} value={text} />
>>>>>>> 8a5c5f3971059116222a0abb2646b4dfe628c96f
		<Button onClick={onButtonClick} display={display ? 'block' : 'none'} mis='x8' primary>{textButton}</Button>
	</Box>;
};

export default memo(FilterByText);
