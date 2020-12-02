import React, { useMemo, useState, useCallback } from 'react';
import { Box, Table, Flex } from '@rocket.chat/fuselage';
import { useMediaQuery } from '@rocket.chat/fuselage-hooks';

import UserAvatar from '../../components/basic/avatar/UserAvatar';
import MarkdownText from '../../components/basic/MarkdownText';
import FilterByText from '../../components/FilterByText';
import GenericTable from '../../components/GenericTable';
import NotAuthorizedPage from '../../components/NotAuthorizedPage';
import { usePermission } from '../../contexts/AuthorizationContext';
import { useRoute } from '../../contexts/RouterContext';
import { useTranslation } from '../../contexts/TranslationContext';
import { useEndpointData } from '../../hooks/useEndpointData';
import { useFormatDate } from '../../hooks/useFormatDate';
import { useQuery } from './hooks';

function UserTable({
	workspace = 'local',
}) {
	const [params, setParams] = useState({ current: 0, itemsPerPage: 25 });
	const [sort, setSort] = useState(['name', 'asc']);
	const canViewFullOtherUserInfo = usePermission('view-full-other-user-info');
	const t = useTranslation();

	const federation = workspace === 'external';

	const query = useQuery(params, sort, 'users', workspace);

	const mediaQuery = useMediaQuery('(min-width: 1024px)');

	const onHeaderClick = useCallback((id) => {
		const [sortBy, sortDirection] = sort;

		if (sortBy === id) {
			setSort([id, sortDirection === 'asc' ? 'desc' : 'asc']);
			return;
		}
		setSort([id, 'asc']);
	}, [sort]);

	const header = useMemo(() => [
		<GenericTable.HeaderCell key={'name'} direction={sort[1]} active={sort[0] === 'name'} onClick={onHeaderClick} sort='name'>{t('Name')}</GenericTable.HeaderCell>,
		mediaQuery && canViewFullOtherUserInfo && <GenericTable.HeaderCell key={'email'} direction={sort[1]} active={sort[0] === 'email'} onClick={onHeaderClick} sort='email' style={{ width: '200px' }} >{t('Email')}</GenericTable.HeaderCell>,
		federation && <GenericTable.HeaderCell key={'origin'} direction={sort[1]} active={sort[0] === 'origin'} onClick={onHeaderClick} sort='origin' style={{ width: '200px' }} >{t('Domain')}</GenericTable.HeaderCell>,
		mediaQuery && <GenericTable.HeaderCell key={'createdAt'} direction={sort[1]} active={sort[0] === 'createdAt'} onClick={onHeaderClick} sort='createdAt' style={{ width: '200px' }}>{t('Joined_at')}</GenericTable.HeaderCell>,
	].filter(Boolean), [sort, onHeaderClick, t, mediaQuery, canViewFullOtherUserInfo, federation]);

	const directRoute = useRoute('direct');

	const { value: data = {} } = useEndpointData('directory', query);

	const onClick = useCallback((username) => (e) => {
		if (e.type === 'click' || e.key === 'Enter') {
			directRoute.push({ rid: username });
		}
	}, [directRoute]);


	const formatDate = useFormatDate();

	const renderRow = useCallback(({ createdAt, emails, _id, username, name, domain, bio, avatarETag, nickname }) => <Table.Row key={_id} onKeyDown={onClick(username)} onClick={onClick(username)} tabIndex={0} role='link' action>
		<Table.Cell>
			<Flex.Container>
				<Box>
					<Flex.Item>
						<UserAvatar size='x40' title={username} username={username} etag={avatarETag} />
					</Flex.Item>
					<Box withTruncatedText grow={1} mi='x8'>
						<Box display='flex'>
							<Box fontScale='p2' withTruncatedText>{name || username}{nickname && ` (${ nickname })`}</Box> <Box mi='x4'/> <Box fontScale='p1' color='hint' withTruncatedText>{username}</Box>
						</Box>
						<MarkdownText fontScale='p1' color='hint' content={bio}/>
					</Box>
				</Box>
			</Flex.Container>
		</Table.Cell>
		{mediaQuery && canViewFullOtherUserInfo
			&& <Table.Cell withTruncatedText >
				{emails && emails[0].address}
			</Table.Cell>}
		{federation
		&& <Table.Cell withTruncatedText>
			{domain}
		</Table.Cell>}
		{mediaQuery && <Table.Cell fontScale='p1' color='hint' withTruncatedText>
			{formatDate(createdAt)}
		</Table.Cell>}
	</Table.Row>, [mediaQuery, federation, canViewFullOtherUserInfo, formatDate, onClick]);

	return <GenericTable
		header={header}
		renderFilter={({ onChange, ...props }) => <FilterByText placeholder={t('Search_Users')} onChange={onChange} {...props} />}
		renderRow={renderRow}
		results={data.result}
		setParams={setParams}
		total={data.total}
	/>;
}

export default function UserTab(props) {
	const canViewOutsideRoom = usePermission('view-outside-room');
	const canViewDM = usePermission('view-d-room');

	if (canViewOutsideRoom && canViewDM) {
		return <UserTable {...props} />;
	}

	return <NotAuthorizedPage />;
}
