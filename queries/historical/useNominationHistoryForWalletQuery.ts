import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

// @notice - this query is used to get the entire nomination history for a body per wallet
function useNominationHistoryForWalletQuery(
	moduleInstance: DeployedModules,
	walletAddress: string
) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<any>(
		['nominationHistoryForWallet', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			const events = contract.filters.CandidateNominated(walletAddress);

			return events;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useNominationHistoryForWalletQuery;
