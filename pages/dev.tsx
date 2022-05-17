import { DeployedModules } from 'containers/Modules/Modules';
import useCouncilMemberHistoryQuery from 'queries/historical/useCouncilMemberHistoryQuery';
import useNominationHistoryQuery from 'queries/historical/useNominationHistoryQuery';
import useVoteHistoryQuery from 'queries/historical/useVoteHistoryQuery';

export default function Dev() {
	// const nomination = useNominationHistoryQuery(DeployedModules.SPARTAN_COUNCIL);
	// const votes = useVoteHistoryQuery(DeployedModules.SPARTAN_COUNCIL);
	const members = useCouncilMemberHistoryQuery(DeployedModules.SPARTAN_COUNCIL, null, '3');

	return (
		<div style={{ color: 'white' }}>
			{/* <h1>Nominees</h1>
			{nomination.data &&
				nomination.data.map((e, i) => {
					return (
						<li key={i}>
							<ul>Nominee: {e}</ul>
							<hr />
						</li>
					);
				})}
			<p>------</p>
			<h1>Votes</h1>
			{votes.data &&
				votes.data.map((e, i) => {
					return (
						<li key={i}>
							<ul>Voter: {e.voter}</ul>
							<ul>BallotId: {e.ballotId}</ul>
							<ul>Voting Power: {Number(e.voterPower)}</ul>
							<hr />
						</li>
					);
				})} */}
			<p>------</p>
			<h1>Members</h1>
			{members.data &&
				members.data.map((e, i) => {
					return (
						<li key={i}>
							<ul>Member: {e}</ul>
							<hr />
						</li>
					);
				})}
		</div>
	);
}
