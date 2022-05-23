import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { useConnectorContext } from 'containers/Connector';

type Address = string;

function useCastMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const governanceModules = useModulesContext();
	const { walletAddress } = useConnectorContext();

	return useMutation(
		'cast',
		async (addresses: Address[]) => {
			const ElectionModule = governanceModules[moduleInstance]?.contract;

			if (!walletAddress) throw new Error('Missing walletAddress');
			if (!ElectionModule) throw new Error('Missing contract');

			const claim = await getCrossChainClaim(ElectionModule, walletAddress);

			if (claim) {
				const crossChainDebt = await ElectionModule.getDeclaredCrossChainDebtShare(walletAddress);

				if (Number(crossChainDebt) === 0) {
					return await transact(
						ElectionModule,
						'declareAndCast',
						claim.amount,
						claim.proof,
						addresses
					);
				}
			}

			return await transact(ElectionModule, 'cast', addresses);
		},
		{
			onSuccess: async () => {
				await queryClient.refetchQueries();
			},
		}
	);
}

async function transact(ElectionModule: any, methodName: string, ...args: any[]) {
	const gasLimit = await ElectionModule.estimateGas[methodName](...args);
	const tx = await ElectionModule[methodName](...args, { gasLimit });
	return tx.wait();
}

async function getCrossChainClaim(ElectionModule: any, walletAddress: string) {
	try {
		const blockNumber = await ElectionModule.getCrossChainDebtShareMerkleRootBlockNumber();
		const tree = await fetch(`/data/${blockNumber}-l1-debts.json`).then((res) => res.json());
		return tree?.claims[walletAddress] || null;
	} catch (err) {
		console.log(err);
		return null;
	}
}

export default useCastMutation;
