import { useColorMode } from '@chakra-ui/react';
import LandingPage from 'components/LandingPage';
import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

const Home: NextPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	useEffect(() => {
		if (colorMode === 'light') {
			toggleColorMode();
		}
	}, [colorMode, toggleColorMode]);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<div
					style={{
						color: 'black',
						fontWeight: 700,
						textAlign: 'center',
						fontSize: '20px',

						width: '100vw',
						paddingTop: '50vh',
					}}
				>
					🚧!!! Synthetix is in the process of migrating to V3 Governance on Synthetix Chain. This
					webpage will soon be redirected to a new governance UI !!!🚧
				</div>
			</Main>
		</>
	);
};

export default Home;
