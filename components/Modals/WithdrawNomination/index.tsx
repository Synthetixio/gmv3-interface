import { Button, Flex } from 'components/old-ui';
import Connector from 'containers/Connector';
import Modal from 'containers/Modal';
import { DeployedModules } from 'containers/Modules/Modules';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { truncateAddress } from 'utils/truncate-address';
import BaseModal from '../BaseModal';

interface WithdrawModalProps {
	deployedModule: DeployedModules;
	council: string;
}

export default function WithdrawModal({ deployedModule, council }: WithdrawModalProps) {
	const { t } = useTranslation();
	const { setIsOpen } = Modal.useContainer();
	const { walletAddress, ensName, connectWallet } = Connector.useContainer();
	const withdrawNomination = useWithdrawNominationMutation(deployedModule);

	const handleWithdrawNomination = async () => {
		const tx = await withdrawNomination.mutateAsync();
		if (tx) {
			setIsOpen(false);
		}
	};

	return (
		<BaseModal headline={t('modals.withdraw.headline')}>
			<StyledBlackBox direction="column" alignItems="center">
				<StyledBlackBoxSubline>
					{t('modals.withdraw.nomination-for', { council })}
				</StyledBlackBoxSubline>
				<StyledWalletAddress>
					{ensName ? (
						ensName
					) : walletAddress ? (
						truncateAddress(walletAddress)
					) : (
						<Button onClick={() => connectWallet()} variant="primary" size="small">
							{t('modals.nomination.checkboxes.connect-wallet')}
						</Button>
					)}
				</StyledWalletAddress>
			</StyledBlackBox>
			<StyledButton onClick={() => handleWithdrawNomination()}>
				{t('modals.withdraw.button')}
			</StyledButton>
		</BaseModal>
	);
}

const StyledBlackBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.black};
	max-width: 314px;
	height: 80px;
	padding: 16px 50px;
	margin-bottom: ${({ theme }) => theme.spacings.medium};
`;

const StyledBlackBoxSubline = styled.h6`
	font-family: 'Inter Bold';
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledWalletAddress = styled.h3`
	font-family: 'Inter Bold';
	font-size: 2rem;
	margin: ${({ theme }) => theme.spacings.tiniest};
	color: ${({ theme }) => theme.colors.white};
`;

const StyledCheckboxWrapper = styled(Flex)`
	margin: ${({ theme }) => theme.spacings.superBig} 0px;
	width: 100%;
	> * {
		margin: ${({ theme }) => theme.spacings.medium};
	}
`;
const StyledButton = styled(Button)`
	max-width: 312px;
`;