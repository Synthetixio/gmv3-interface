import { DeployedModules } from 'containers/Modules';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import { Badge, Icon, IconButton } from '@synthetixio/ui';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { CouncilsDictionaryType } from 'constants/config';
import { useApplicationContext } from 'containers/Application';
import { useModalContext } from 'containers/Modal';

interface Props {
	council: CouncilsDictionaryType;
	walletAddress: string | undefined;
}

export const BallotVote: React.FC<Props> = ({ council, walletAddress }) => {
	const { t } = useTranslation();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const { push } = useRouter();
	const { removeVote } = useApplicationContext();

	if (userDetailsQuery.isLoading) return null;

	return walletAddress && userDetailsQuery.data ? (
		<div className="flex items-center justify-between relative">
			<Avatar
				walletAddress={userDetailsQuery.data.address}
				url={userDetailsQuery.data.pfpThumbnailUrl}
				width={33}
				height={33}
				scale={4}
			/>
			<div className="flex flex-col ml-2 mr-3">
				<span className="tg-caption-bold text-primary">
					{t(`vote.councils.${council.abbreviation}`)}
				</span>
				<span className="tg-content mt-0.5 ml-0.5">
					{userDetailsQuery.data?.ens || truncateAddress(userDetailsQuery.data.address)}
				</span>
			</div>
			<IconButton onClick={() => removeVote(walletAddress, council.module)}>
				<Icon name="Bin" />
			</IconButton>
		</div>
	) : (
		<div className="flex items-center rounded">
			<IconButton size="sm" onClick={() => push('/vote/' + council.slug)} rounded>
				<Icon name="Plus" className="text-primary" />
			</IconButton>
			<span className="tg-caption-bold ml-2 text-primary">
				{t(`vote.councils.${council.abbreviation}`)}
			</span>
		</div>
	);
};
