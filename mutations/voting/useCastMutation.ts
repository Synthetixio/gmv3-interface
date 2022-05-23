import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { useConnectorContext } from 'containers/Connector';

type Address = string;

async function transact(contract: any, methodName: string, ...args: any[]) {
	const gasLimit = await contract.estimateGas[methodName](...args);
	const tx = await contract[methodName](...args, { gasLimit });
	return tx.wait();
}

function useCastMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const governanceModules = useModulesContext();
	const { walletAddress } = useConnectorContext();

	return useMutation(
		'cast',
		async (addresses: Address[]) => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (!walletAddress) throw new Error('Missing walletAddress');
			if (!contract) throw new Error('Missing contract');

			const blockNumber = await contract.getCrossChainDebtShareMerkleRootBlockNumber();

			const tree = await fetch(`/data/${blockNumber}-l1-debts.json`)
				.then((res) => res.json())
				.catch((err) => {
					console.log(err);
					return null;
				});

			const claim = tree?.claims[walletAddress];

			if (claim) {
				const crossChainDebt = await contract.getDeclaredCrossChainDebtShare(walletAddress);

				if (Number(crossChainDebt) === 0) {
					return await transact(contract, 'declareAndCast', claim.amount, claim.proof, addresses);
				}
			}

			return await transact(contract, 'cast', addresses);
		},
		{
			onSuccess: async () => {
				await queryClient.refetchQueries();
			},
		}
	);
}

export default useCastMutation;
