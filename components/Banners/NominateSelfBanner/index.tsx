import NominateModal from 'components/Modals/Nominate';
import { DeployedModules } from 'containers/Modules/Modules';
import { useModalContext } from 'containers/Modal';
import { useTranslation } from 'react-i18next';
import { Timer } from 'components/Timer';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import { Card, Icon, IconButton } from '@synthetixio/ui';
import useIsMobile from 'hooks/useIsMobile';

export default function NominateSelfBanner({
	deployedModule,
}: Record<'deployedModule', DeployedModules>) {
	const { t } = useTranslation();
	const { data } = useNominationPeriodDatesQuery(deployedModule);
	const { setContent, setIsOpen } = useModalContext();
	const isMobile = useIsMobile();

	return (
		<Card
			variant="orange"
			className="flex justify-center items-center p-2"
			wrapperClassName="rounded-none"
		>
			<div
				className="flex p-2 darker-60 text-white items-center flex-wrap rounded max-w-[200px] md:mr-4 md:max-w-[400px] mr-auto"
				data-testid="nominate-self-banner-container"
			>
				{t('banner.nominate.closes')}&nbsp;
				{data?.nominationPeriodEndDate && (
					<Timer
						expiryTimestamp={data.nominationPeriodEndDate}
						data-testid="nominate-self-banner-timer"
					/>
				)}
			</div>
			{!isMobile ? (
				<IconButton
					onClick={() => {
						setContent(<NominateModal />);
						setIsOpen(true);
					}}
					size="sm"
					rounded
					className="w-[160px] pl-2"
					data-testid="nominate-self-banner-button-desktop"
				>
					{t('banner.nominate.headline')}
					<Icon name="Right" />
				</IconButton>
			) : (
				<IconButton
					onClick={() => {
						setContent(<NominateModal />);
						setIsOpen(true);
					}}
					size="sm"
					rounded
					className="p-2"
					data-testid="nominate-self-banner-button-mobile"
				>
					<Icon name="Right" />
				</IconButton>
			)}
		</Card>
	);
}
