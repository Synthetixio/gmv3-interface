import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';

export const useProfileProgress = async (walletAddress: string) => {
	const userDetailsQuery = useUserDetailsQuery(walletAddress);

	// @TODO: add discord here to
	let about,
		twitter = '';

	if (userDetailsQuery.isSuccess && userDetailsQuery.data) {
		({ about, twitter } = userDetailsQuery.data);
	}

	const progress = {
		about: about !== '',
		twitter: twitter !== '',
	};

	return progress;
};
