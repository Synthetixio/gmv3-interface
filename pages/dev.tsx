import { DeployedModules } from 'containers/Modules/Modules';
import useNominationHistoryForWalletQuery from 'queries/nomination/useNominationHistoryForWalletQuery';

export default function Dev() {
	const history = useNominationHistoryForWalletQuery(
		DeployedModules.SPARTAN_COUNCIL,
		'0x9b395C336FF7FeEb99F057e66185b34Cf82A9DF6'
	);

	console.log(history);

	return <>Go for it here</>;
}
