import { Button } from '@synthetixio/ui';
import VoteModal from 'components/Modals/VoteModal';
import { Timer } from 'components/Timer';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useApplicationContext } from 'containers/Application';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules/Modules';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useTranslation } from 'react-i18next';
import { BallotVote } from './BallotVote';

export default function VoteBanner({ deployedModule }: { deployedModule: DeployedModules }) {
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(deployedModule);
	const { votes } = useApplicationContext();
	const { setContent, setIsOpen } = useModalContext();

	if (votes.length) {
		return (
			<div className="w-full bg-[#02060D] py-1 border-b-gray-800 border-b border-b-solid">
				<div className="container flex justify-around md:flex-nowrap flex-wrap items-center p-2">
					{COUNCILS_DICTIONARY.map((council, index) => (
						<BallotVote
							key={council.slug.concat(index.toString())}
							walletAddress={votes.find((vote) => vote.council === council.module)?.address}
							council={council}
						/>
					))}
					<Button
						onClick={() => {
							setContent(<VoteModal />);
							setIsOpen(true);
						}}
					>
						Vote Candidates
					</Button>
				</div>
			</div>
		);
	}
	return (
		<div className="flex justify-center md:flex-nowrap flex-wrap items-center bg-green-vote p-2">
			<div
				className="md:mr-8 text-black tg-caption-bold md:p-0 p-2"
				data-testid="vote-banner-headline"
			>
				{t('banner.vote.headline')}
			</div>
			<div className="darker-60 flex py-2 rounded px-4" data-testid="vote-banner-timer-text">
				{t('banner.vote.closes')}
				{data?.votingPeriodEndDate && (
					<Timer
						expiryTimestamp={data.votingPeriodEndDate}
						className="ml-5"
						data-testid="vote-banner-timer"
					></Timer>
				)}
			</div>
		</div>
	);
}
