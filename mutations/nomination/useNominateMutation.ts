import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useNominateMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const governanceModules = useModulesContext();

	return useMutation(
		'nominate',
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				const gasLimit = await contract.estimateGas.nominate();
				let tx = await contract.nominate({ gasLimit });
				const receipt = tx.wait();
				return receipt;
			} else {
				return new Error();
			}
		},
		{
			onSuccess: async () => {
				await queryClient.refetchQueries();
			},
		}
	);
}

export default useNominateMutation;
