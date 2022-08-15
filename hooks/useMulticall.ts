import { useConnectorContext } from 'containers/Connector';
import MulticallV3 from 'contracts/Multicall.json';
import { CallOverrides, Contract, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';

// contact, funcion name, arguments
// [ethers.Contract, functionName, arguments, overrides (i.e value, gasLimit, gasPrice)]
export type MulticallCall = [Contract, string, any[], CallOverrides?];

export const useMulticall = () => {
	const { signer } = useConnectorContext();
	const multicall = useMemo(() => {
		if (!signer) return null;
		return new ethers.Contract(MulticallV3.address, MulticallV3.abi, signer);
	}, [signer]);

	const call = useCallback(
		async (calls: MulticallCall[]) => {
			if (!multicall) return;

			let callContract: ethers.Contract | undefined,
				callFunc: string | undefined,
				callArgs: any[] | undefined;

			if (calls.length === 1) {
				[callContract, callFunc, callArgs] = calls[0];
				const tx = await callContract[callFunc](...callArgs);
				return tx;
			} else {
				const args = [
					calls.map((c) => {
						const callData = c[0].interface.encodeFunctionData(c[1], c[2] || []);
						return {
							target: c[0].address,
							callData,
							allowFailure: false,
							value: 0,
						};
					}),
				];
				const tx = await multicall.aggregate3Value(...args, { gasLimit: 10000000 });

				return tx;
			}
		},
		[multicall]
	);

	return {
		call,
	};
};
