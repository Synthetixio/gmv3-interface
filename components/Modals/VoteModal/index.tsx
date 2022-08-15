import { useTranslation } from 'react-i18next';
import BaseModal from '../BaseModal';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { useMultipleCast } from 'mutations/voting/useMultipleCast';
import { useApplicationContext } from 'containers/Application';
import VotePreviewItem from './VotePreviewItem';
import { truncateAddress } from 'utils/truncate-address';
import { useQueryClient } from 'react-query';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function VoteModal() {
	const { t } = useTranslation();
	const { votes, resetVotes } = useApplicationContext();

	const multipleCast = useMultipleCast();
	const { setIsOpen } = useModalContext();
	const { walletAddress, isWalletConnected } = useConnectorContext();
	const { setVisible, setContent, state, setTxHash, visible, setState } =
		useTransactionModalContext();
	const queryClient = useQueryClient();
	const { push } = useRouter();

	useEffect(() => {
		const reset = () => {
			queryClient.invalidateQueries('voting-result');
			queryClient.invalidateQueries(['getCurrentVoteStateQuery', walletAddress]);
			queryClient.resetQueries({
				active: true,
				stale: true,
				inactive: true,
			});

			push('/profile/' + walletAddress);
			setVisible(false);
			resetVotes();
			setIsOpen(false);
		};

		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				reset();
			}, 2000);
		}
	}, [push, queryClient, resetVotes, setIsOpen, setVisible, state, visible, walletAddress]);

	const handleVote = async () => {
		setState('signing');
		setVisible(true);
		try {
			setContent(
				<>
					<h6 className="tg-title-h5 mb-2">{t('modals.vote.ctaAll')}</h6>
					{votes.map((voteItem) => (
						<h3 key={voteItem.address} className="tg-title-h4 py-1">
							{truncateAddress(voteItem.address)}
						</h3>
					))}
				</>
			);
			const tx = await multipleCast.cast();
			setTxHash(tx.hash);
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};

	return (
		<BaseModal
			headline={
				<>
					<h5 className="tg-title-h5 mb-0.5">Confirm Your</h5>
					<h2 className="tg-title-h2">Ballot Summary</h2>
				</>
			}
		>
			<div className="flex flex-col items-center mt-12">
				<table className="text-white text-left">
					<tr className="border-b-gray-800 border-b border-b-solid">
						<th className="py-2">Name / ID</th>
						<th>Council</th>
						<th>Combined Voting Power</th>
						<th></th>
					</tr>
					{votes.map((voteItem) => (
						<VotePreviewItem
							key={voteItem.address}
							address={voteItem.address}
							deployedModule={voteItem.council}
						/>
					))}
				</table>
				<Button onClick={handleVote} size="lg" className="w-[249px] mt-12">
					Submit Vote
				</Button>
			</div>
		</BaseModal>
	);
}
