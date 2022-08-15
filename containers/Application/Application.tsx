import { DeployedModules } from 'constants/config';
import { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

interface IBallot {
	address: string;
	council: DeployedModules;
}
type ApplicationContextType = {
	votes: IBallot[];
	vote: (address: string, council: DeployedModules) => void;
	removeVote: (address: string, council: DeployedModules) => void;
	resetVotes: () => void;
};

const ApplicationContext = createContext<unknown>(null);

export const useApplicationContext = () => {
	return useContext(ApplicationContext) as ApplicationContextType;
};

export const ApplicationContextProvider: React.FC = ({ children }) => {
	const [votes, setVotes] = useState<IBallot[]>([]);

	const vote = useCallback(
		(address: string, council: DeployedModules) => {
			const newVotes = votes.filter((item) => item.council !== council);
			newVotes.push({
				address,
				council,
			});
			setVotes([...newVotes]);
			toast.success('Nominee added to your ballot.');
		},
		[votes]
	);

	const removeVote = useCallback(
		(address: string, council: DeployedModules) => {
			const newVotes = votes.filter((item) => item.council !== council && item.address !== address);
			setVotes([...newVotes]);
		},
		[votes]
	);

	const resetVotes = useCallback(() => setVotes([]), []);

	return (
		<ApplicationContext.Provider
			value={{
				votes,
				vote,
				removeVote,
				resetVotes,
			}}
		>
			{children}
		</ApplicationContext.Provider>
	);
};
