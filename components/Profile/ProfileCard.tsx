import { ExternalLink } from '@synthetixio/ui';
import clsx from 'clsx';
import Avatar from 'components/Avatar';
import { DeployedModules } from 'containers/Modules';
import useVoteHistoryQuery from 'queries/eventHistory/useVoteHistoryQuery';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/truncate-address';

export interface ProfileCardProps {
	className?: string;
	pfpThumbnailUrl: string;
	walletAddress: string;
	discord: string;
	github: string;
	twitter: string;
	pitch: string;
	deployedModule?: DeployedModules;
}

const VoteHistory = ({
	deployedModule,
	walletAddress,
}: {
	deployedModule: DeployedModules;
	walletAddress: string;
}) => {
	const { t } = useTranslation();
	const voteHistory = useVoteHistoryQuery(deployedModule, walletAddress, null, null);
	return (
		<div className="flex flex-col mx-5">
			<h5 className="tg-content-bold text-gray-650">{t('profiles.votes')}</h5>
			<h5 className="tg-title-h5  mt-1">{voteHistory.data?.length || 0}</h5>
		</div>
	);
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
	className,
	pfpThumbnailUrl,
	walletAddress,
	discord,
	twitter,
	pitch,
	deployedModule,
}) => {
	const { t } = useTranslation();

	return (
		<div className={clsx('bg-dark-blue border border-gray-700 w-full p-3', className)}>
			<div className="flex items-center flex-wrap gap-4">
				<Avatar
					width={69}
					height={69}
					url={pfpThumbnailUrl}
					walletAddress={walletAddress}
					className="md:block hidden"
				/>

				{discord && (
					<div className="flex flex-col m-2">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.discord')}</h5>
						<ExternalLink
							className="py-1 mt-1"
							border
							link={`https://discord.com/${discord}`}
							text="Discord"
						/>
					</div>
				)}

				{twitter && (
					<div className="flex flex-col m-2">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.twitter')}</h5>
						<ExternalLink
							className="py-1 mt-1"
							border
							link={`https://twitter.com/${twitter}`}
							text="Twitter"
						/>
					</div>
				)}

				{deployedModule && walletAddress && (
					<VoteHistory deployedModule={deployedModule} walletAddress={walletAddress} />
				)}
			</div>
			<hr className="border-gray-700 my-4" />

			<div className="flex flex-col md:pl-[69px] ml-5 break-words">
				<h5 className="tg-content-bold text-gray-650">{t('profiles.wallet')}</h5>
				{truncateAddress(walletAddress)}
			</div>
			{pitch && (
				<>
					<hr className="border-gray-700 my-4" />
					<div className="flex flex-col md:pl-[69px] ml-5 whitespace-pre">
						<h5 className="tg-content-bold text-gray-650">{t('profiles.pitch')}</h5>
						{pitch}
					</div>
				</>
			)}
		</div>
	);
};
