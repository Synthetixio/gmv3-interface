import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { useTransactionModalContext } from '@synthetixio/ui';
import { useConnectorContext } from 'containers/Connector';
import { getCrossChainClaim } from './useCastMutation';
import { useCallback } from 'react';

import { MulticallCall, useMulticall } from 'hooks/useMulticall';

export const useMultipleCast = () => {
	const { setState } = useTransactionModalContext();
	const governanceModules = useModulesContext();
	const { walletAddress } = useConnectorContext();
	const { call } = useMulticall();

	const cast = useCallback(async () => {
		try {
			const ElectionModule1 = governanceModules[DeployedModules.SPARTAN_COUNCIL]?.contract;
			const ElectionModule2 = governanceModules[DeployedModules.GRANTS_COUNCIL]?.contract;

			const a1 = '0x09634E139c628Bc5D594FBc09dede0005dC52391';
			const a2 = '0xBD5455be47a8C28cd6407765F8dB942f007F9b40';

			if (!walletAddress) throw new Error('Missing walletAddress');
			if (!ElectionModule1 || !ElectionModule2) throw new Error('Missing contract');

			const claim1 = await getCrossChainClaim(ElectionModule1, walletAddress);
			const claim2 = await getCrossChainClaim(ElectionModule2, walletAddress);

			const contractCallContext: MulticallCall[] = [];
			if (claim1) {
				const crossChainDebt = await ElectionModule1.getDeclaredCrossChainDebtShare(walletAddress);
				if (Number(crossChainDebt) === 0) {
					contractCallContext.push([
						ElectionModule1,
						'declareAndCast',
						[claim1.amount, claim1.proof, [a1]],
					]);
				} else {
					contractCallContext.push([ElectionModule1, 'cast', [[a1]]]);
				}
			}
			if (claim2) {
				const crossChainDebt = await ElectionModule2.getDeclaredCrossChainDebtShare(walletAddress);
				if (Number(crossChainDebt) === 0) {
					contractCallContext.push([
						ElectionModule2,
						'declareAndCast',
						[claim2.amount, claim2.proof, [a2]],
					]);
				} else {
					contractCallContext.push([ElectionModule2, 'cast', [[a2]]]);
				}
			}

			return call(contractCallContext);
		} catch (error) {
			setState('error');
			console.error(error);
		}
	}, [call, governanceModules, setState, walletAddress]);

	return {
		cast,
	};
};
