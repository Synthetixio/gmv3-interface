import { useModulesContext } from 'containers/Modules';
import { useTransactionModalContext } from '@synthetixio/ui';
import { useConnectorContext } from 'containers/Connector';
import { getCrossChainClaim } from './useCastMutation';
import { useCallback } from 'react';

import { MulticallCall, useMulticall } from 'hooks/useMulticall';
import { useApplicationContext } from 'containers/Application';

export const useMultipleCast = () => {
	const { setState } = useTransactionModalContext();
	const governanceModules = useModulesContext();
	const { walletAddress } = useConnectorContext();
	const { call } = useMulticall();
	const { votes } = useApplicationContext();

	const cast = useCallback(async () => {
		try {
			const contractCallContext: MulticallCall[] = [];
			const promises = votes.map(async (vote) => {
				const ElectionModule = governanceModules[vote.council]?.contract;

				if (!ElectionModule || !walletAddress) return;
				const claim = await getCrossChainClaim(ElectionModule, walletAddress);
				if (claim) {
					const crossChainDebt = await ElectionModule.getDeclaredCrossChainDebtShare(walletAddress);
					if (Number(crossChainDebt) === 0) {
						contractCallContext.push([
							ElectionModule,
							'declareAndCast',
							[claim.amount, claim.proof, [vote.address]],
						]);
						return;
					}
				}
				contractCallContext.push([ElectionModule, 'cast', [[vote.address]]]);
			});
			await Promise.all(promises);

			return call(contractCallContext);
		} catch (error) {
			setState('error');
			console.error(error);
		}
	}, [call, governanceModules, setState, votes, walletAddress]);

	return {
		cast,
	};
};
