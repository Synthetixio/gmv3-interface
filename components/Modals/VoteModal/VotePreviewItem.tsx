import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import { DeployedModules } from 'containers/Modules/Modules';
import { truncateAddress } from 'utils/truncate-address';
import Avatar from 'components/Avatar';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules/index';
import { getCrossChainClaim } from 'mutations/voting/useCastMutation';
import { BigNumber, utils } from 'ethers';
import { useConnectorContext } from 'containers/Connector';
import Wei from '@synthetixio/wei';
import { CouncilBadge } from 'components/CouncilBadge';
import { currency } from 'utils/currency';

interface VoteModalProps {
	address: string;
	deployedModule: DeployedModules;
}

export default function VotePreviewItem({ address, deployedModule }: VoteModalProps) {
	const { t } = useTranslation();
	const { setIsOpen } = useModalContext();
	const userDetailsQuery = useUserDetailsQuery(address);
	const { walletAddress } = useConnectorContext();
	const governanceModules = useModulesContext();
	const [votingPower, setVotingPower] = useState({ l1: new Wei(0), l2: new Wei(0) });
	const { push } = useRouter();
	const queryClient = useQueryClient();
	const { setVisible, setContent, state, setTxHash, visible, setState } =
		useTransactionModalContext();
	// useEffect(() => {
	// 	if (state === 'confirmed' && visible) {
	// 		setTimeout(() => {
	// 			queryClient.invalidateQueries('voting-result');
	// 			queryClient.invalidateQueries(['getCurrentVoteStateQuery', walletAddress]);
	// 			queryClient.resetQueries({
	// 				active: true,
	// 				stale: true,
	// 				inactive: true,
	// 			});

	// 			push('/profile/' + member.address);
	// 			setVisible(false);
	// 			setIsOpen(false);
	// 		}, 2000);
	// 	}
	// }, [
	// 	state,
	// 	setVisible,
	// 	setIsOpen,
	// 	push,
	// 	member.address,
	// 	visible,
	// 	queryClient,
	// 	deployedModule,
	// 	walletAddress,
	// ]);

	useEffect(() => {
		if (walletAddress && governanceModules[deployedModule]?.contract) {
			getCrossChainClaim(governanceModules[deployedModule]!.contract, walletAddress).then(
				(data) => {
					if (data) {
						console.log(data.amount);
						setVotingPower((state) => ({ ...state, l1: new Wei(BigNumber.from(data.amount)) }));
					}
				}
			);
			governanceModules[deployedModule]?.contract
				.getDebtShare(walletAddress)
				.then((share: BigNumber) => {
					setVotingPower((state) => ({ ...state, l2: new Wei(share) }));
				});
		}
	}, [walletAddress, governanceModules, deployedModule]);

	const member = userDetailsQuery.data;
	return (
		<tr className="border-b-gray-800 border-b border-b-solid">
			<td className="pr-5 py-4">
				{member && (
					<div className="flex items-center">
						<Avatar
							walletAddress={member.address}
							url={member.pfpThumbnailUrl}
							width={33}
							height={33}
							scale={4}
						/>
						<h3 className="tg-content mt-0.5 ml-2">{member.ens || truncateAddress(address)}</h3>
					</div>
				)}
			</td>
			<td className="pr-5">
				<CouncilBadge council={deployedModule} />
			</td>

			<td className="pr-5">
				{currency(
					utils.formatUnits(
						deployedModule === 'treasury council'
							? votingPower.l1.add(votingPower.l2).toBN().toString()
							: bnSqrt(votingPower.l1.add(votingPower.l2).toBN()).toString(),
						'wei'
					)
				)}
			</td>
			<td>
				<Button
					variant="outline"
					onClick={() => {
						setIsOpen(false);
						push('/profile/' + address);
					}}
				>
					{t('modals.vote.profile')}
				</Button>
			</td>
		</tr>
	);
}

const BN_ONE = BigNumber.from(1);
const BN_TWO = BigNumber.from(2);

function bnSqrt(value: BigNumber) {
	let z = value.add(BN_ONE).div(BN_TWO);
	let y = value;

	while (z.sub(y).isNegative()) {
		y = z;
		z = value.div(z).add(z).div(BN_TWO);
	}

	return y;
}
