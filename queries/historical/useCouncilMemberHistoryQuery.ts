import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';
import { ethers } from 'ethers';

/**
 * Query Council Member Added and Council Member Removed Events from Solidity Contracts
 *
 *  event CouncilMemberAdded(address member);
 *  event CouncilMemberRemoved(address member);
 *
 * @param {DeployedModules} moduleInstance The smart contract instance of the governance body to query
 * @param {string} [member] If needed, a specific wallets nomination history can be queried
 * @param {string} [epochIndex] If needed, we can select a specific epoch to query
 * @return {string[]} A list of addresses
 */
function useCouncilMemberHistoryQuery(
	moduleInstance: DeployedModules,
	member?: string,
	epochIndex?: string
) {
	const { governanceModules } = Modules.useContainer();

	// @TODO: make generic enough so we can query entire history, per wallet and per epochIndex
	return useQuery<string[]>(
		['councilMemberHistory', moduleInstance, member, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract as ethers.Contract;

			// @TODO: add custom filtering here
			const memberAddedFilter = contract.filters.CouncilMemberAdded();
			const memberRemovedFilter = contract.filters.CouncilMemberRemoved();

			const addedEvents = await contract.queryFilter(memberAddedFilter);
			const removedEvents = await contract.queryFilter(memberRemovedFilter);

			let councilMembers = [] as string[];

			addedEvents.forEach((event: ethers.Event) => {
				councilMembers.push(event.args?.member);
			});

			removedEvents.forEach((event: ethers.Event) => {
				if (councilMembers.includes(event.args?.member)) {
					councilMembers.splice(councilMembers.indexOf(event.args?.member), 1);
				}
			});

			return councilMembers;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useCouncilMemberHistoryQuery;
