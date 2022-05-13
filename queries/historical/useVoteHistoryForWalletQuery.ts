import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

// @notice - this query is used to get the entire vote history for a body per wallet
function useVoteHistoryForWalletQuery(moduleInstance: DeployedModules, walletAddress: string) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<any>(
		['voteHistoryForWallet', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			const events = contract.filters.VoteRecorded(walletAddress);

			return events;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useVoteHistoryForWalletQuery;
