/**
 * External dependencies
 */
const { groupBy, escapeRegExp } = require( 'lodash' );
const Octokit = require( '@octokit/rest' );

/**
 * Internal dependencies
 */
const { getNextMajorVersion } = require( '../lib/version' );
const { log, formats } = require( '../lib/logger' );
const config = require( '../config' );
// @ts-ignore
const manifest = require( '../../../package.json' );

/** @typedef {import('@octokit/rest')} GitHub */
/** @typedef {import('@octokit/rest').IssuesListForRepoResponseItem} IssuesListForRepoResponseItem */
/** @typedef {import('@octokit/rest').IssuesListMilestonesForRepoResponseItem} OktokitIssuesListMilestonesForRepoResponseItem */

/**
 * @typedef WPChangelogCommandOptions
 *
 * @property {string=} milestone Optional Milestone title.
 * @property {string=} token     Optional personal access token.
 */

/**
 * @typedef WPChangelogSettings
 *
 * @property {string}  owner     Repository owner.
 * @property {string}  repo      Repository name.
 * @property {string=} token     Optional personal access token.
 * @property {string}  milestone Milestone title.
 */

/**
 * Changelog normalization function, returning a string to use as title, or
 * undefined if entry should be omitted.
 *
 * @typedef {(text:string,issue:IssuesListForRepoResponseItem)=>string|undefined} WPChangelogNormalization
 */

/**
 * Mapping of label names to grouping heading text to be used in release notes,
 * intended to be more readable in the context of release notes. Also used in
 * merging multiple related groupings to a single heading.
 *
 * @type {Record<string,string>}
 */
const LABEL_GROUP_TITLES = {
	Bug: 'Bug Fixes',
	Regression: 'Bug Fixes',
	Feature: 'Features',
	Enhancement: 'Enhancements',
	'New API': 'New APIs',
	Experimental: 'Experiments',
};

/**
 * Order in which to print group titles. A value of `undefined` is used as slot
 * in which unrecognized headings are to be inserted.
 *
 * @type {Array<string|undefined>}
 */
const GROUP_TITLE_ORDER = [
	'Features',
	'Enhancements',
	'New APIs',
	'Bug Fixes',
	'Experiments',
	'Code Quality',
	'Documentation',
	'Project Management',
	undefined,
	'Various',
];

/**
 * Map of common technical terms to a corresponding replacement term more
 * appropriate for release notes.
 *
 * @type {Record<string,string>}
 */
const REWORD_TERMS = {
	e2e: 'end-to-end',
	url: 'URL',
};

/**
 * Given a SemVer-formatted version string, returns an assumed milestone title
 * associated with that version.
 *
 * @see https://semver.org/
 *
 * @param {string} version Version string.
 *
 * @return {string} Milestone title.
 */
function getMilestone( version ) {
	const [ major, minor ] = version.split( '.' );

	return `Gutenberg ${ major }.${ minor }`;
}

/**
 * Returns a type label for a given issue object, or a default if type cannot
 * be determined.
 *
 * @param {IssuesListForRepoResponseItem} issue Issue object.
 *
 * @return {string} Type label.
 */
function getIssueType( issue ) {
	const typeLabel = issue.labels.find( ( label ) =>
		label.name.startsWith( '[Type] ' )
	);

	if ( ! typeLabel ) {
		return 'Various';
	}

	const labelName = typeLabel.name.replace( /^\[Type\]\s*/, '' );

	return LABEL_GROUP_TITLES.hasOwnProperty( labelName )
		? LABEL_GROUP_TITLES[ labelName ]
		: labelName;
}

/**
 * Sort comparator, comparing two group titles.
 *
 * @param {string} a First group title.
 * @param {string} b Second group title.
 *
 * @return {number} Sort result.
 */
function sortGroup( a, b ) {
	const [ aIndex, bIndex ] = [ a, b ].map( ( title ) => {
		const index = GROUP_TITLE_ORDER.indexOf( title );
		return index === -1 ? GROUP_TITLE_ORDER.indexOf( undefined ) : index;
	} );

	return aIndex - bIndex;
}

/**
 * Given a text string, appends a period if not already ending with one.
 *
 * @param {string} text Original text.
 *
 * @return {string} Text with trailing period.
 */
function addTrailingPeriod( text ) {
	if ( ! text.endsWith( '.' ) ) {
		text += '.';
	}

	return text;
}

/**
 * Given a text string, replaces reworded terms.
 *
 * @param {string} text Original text.
 *
 * @return {string} Text with reworded terms.
 */
function reword( text ) {
	for ( const [ term, replacement ] of Object.entries( REWORD_TERMS ) ) {
		const pattern = new RegExp(
			'(^| )' + escapeRegExp( term ) + '( |$)',
			'ig'
		);
		text = text.replace( pattern, '$1' + replacement + '$2' );
	}

	return text;
}

/**
 * Given a text string, capitalizes the first letter of the last segment
 * following a colon.
 *
 * @param {string} text Original text.
 *
 * @return {string} Text with capitalizes last segment.
 */
function capitalizeAfterColonSeparatedPrefix( text ) {
	const parts = text.split( ':' );
	parts[ parts.length - 1 ] = parts[ parts.length - 1 ].replace(
		/^(\s*)([a-z])/,
		( _match, whitespace, letter ) => whitespace + letter.toUpperCase()
	);

	return parts.join( ':' );
}

/**
 * Higher-order function which returns a normalization function to omit by title
 * prefix matching any of the given prefixes.
 *
 * @param {string[]} prefixes Prefixes from which to determine if given entry
 *                            should be omitted.
 *
 * @return {WPChangelogNormalization} Normalization function.
 */
const createOmitByTitlePrefix = ( prefixes ) => ( title ) =>
	prefixes.some( ( prefix ) =>
		new RegExp( '^' + escapeRegExp( prefix ), 'i' ).test( title )
	)
		? undefined
		: title;

/**
 * Higher-order function which returns a normalization function to omit by issue
 * label matching any of the given label names.
 *
 * @param {string[]} labels Label names from which to determine if given entry
 *                          should be omitted.
 *
 * @return {WPChangelogNormalization} Normalization function.
 */
const createOmitByLabel = ( labels ) => ( text, issue ) =>
	issue.labels.some( ( label ) => labels.includes( label.name ) )
		? undefined
		: text;

/**
 * Array of normalizations applying to title, each returning a new string, or
 * undefined to indicate an entry which should be omitted.
 *
 * @type {Array<WPChangelogNormalization>}
 */
const TITLE_NORMALIZATIONS = [
	createOmitByTitlePrefix( [ '[rnmobile]' ] ),
	createOmitByLabel( [ 'Mobile App Compatibility', 'Project Management' ] ),
	reword,
	capitalizeAfterColonSeparatedPrefix,
	addTrailingPeriod,
];

/**
 * Given an issue title, returns the title with normalization transforms
 * applied, or undefined to indicate that the entry should be omitted.
 *
 * @param {string}                        title Original title.
 * @param {IssuesListForRepoResponseItem} issue Issue object.
 *
 * @return {string|undefined} Normalized title.
 */
function getNormalizedTitle( title, issue ) {
	/** @type {string|undefined} */
	let normalizedTitle = title;
	for ( const normalize of TITLE_NORMALIZATIONS ) {
		normalizedTitle = normalize( normalizedTitle, issue );
		if ( normalizedTitle === undefined ) {
			break;
		}
	}

	return normalizedTitle;
}

/**
 * Returns a formatted changelog entry for a given issue object, or undefined
 * if entry should be omitted.
 *
 * @param {IssuesListForRepoResponseItem} issue Issue object.
 *
 * @return {string=} Formatted changelog entry, or undefined to omit.
 */
function getEntry( issue ) {
	const title = getNormalizedTitle( issue.title, issue );

	return title === undefined
		? title
		: `- ${ title } ([${ issue.number }](${ issue.html_url }))`;
}

/**
 * Returns a promise resolving to a milestone by a given title, if exists.
 *
 * @param {GitHub} octokit Initialized Octokit REST client.
 * @param {string} owner   Repository owner.
 * @param {string} repo    Repository name.
 * @param {string} title   Milestone title.
 *
 * @return {Promise<OktokitIssuesListMilestonesForRepoResponseItem|void>} Promise resolving to milestone, if exists.
 */
async function getMilestoneByTitle( octokit, owner, repo, title ) {
	const options = octokit.issues.listMilestonesForRepo.endpoint.merge( {
		owner,
		repo,
	} );

	/**
	 * @type {AsyncIterableIterator<import('@octokit/rest').Response<import('@octokit/rest').IssuesListMilestonesForRepoResponse>>}
	 */
	const responses = octokit.paginate.iterator( options );

	for await ( const response of responses ) {
		const milestones = response.data;
		for ( const milestone of milestones ) {
			if ( milestone.title === title ) {
				return milestone;
			}
		}
	}
}

/**
 * Returns a promise resolving to pull requests by a given milestone ID.
 *
 * @param {GitHub} octokit   Initialized Octokit REST client.
 * @param {string} owner     Repository owner.
 * @param {string} repo      Repository name.
 * @param {number} milestone Milestone ID.
 *
 * @return {Promise<IssuesListForRepoResponseItem[]>} Promise resolving to pull
 *                                                    requests for the given
 *                                                    milestone.
 */
async function getPullRequestsByMilestone( octokit, owner, repo, milestone ) {
	const options = octokit.issues.listForRepo.endpoint.merge( {
		owner,
		repo,
		milestone,
		state: 'closed',
	} );

	/**
	 * @type {AsyncIterableIterator<import('@octokit/rest').Response<import('@octokit/rest').IssuesListForRepoResponse>>}
	 */
	const responses = octokit.paginate.iterator( options );

	const pulls = [];

	for await ( const response of responses ) {
		const issues = response.data;
		pulls.push( ...issues.filter( ( issue ) => issue.pull_request ) );
	}

	return pulls;
}

/**
 * Returns a promise resolving to an array of pull requests associated with the
 * changelog settings object.
 *
 * @param {GitHub}              octokit  GitHub REST client.
 * @param {WPChangelogSettings} settings Changelog settings.
 *
 * @return {Promise<IssuesListForRepoResponseItem[]>} Promise resolving to array of
 *                                            pull requests.
 */
async function fetchAllPullRequests( octokit, settings ) {
	const { owner, repo, milestone: milestoneTitle } = settings;
	const milestone = await getMilestoneByTitle(
		octokit,
		owner,
		repo,
		milestoneTitle
	);

	if ( ! milestone ) {
		throw new Error(
			`Cannot find milestone by title: ${ settings.milestone }`
		);
	}

	const { number } = milestone;
	return getPullRequestsByMilestone( octokit, owner, repo, number );
}

/**
 * Returns a promise resolving to the changelog string for given settings.
 *
 * @param {WPChangelogSettings} settings Changelog settings.
 *
 * @return {Promise<string>} Promise resolving to changelog.
 */
async function getChangelog( settings ) {
	const octokit = new Octokit( {
		auth: settings.token,
	} );

	const pullRequests = await fetchAllPullRequests( octokit, settings );
	if ( ! pullRequests.length ) {
		throw new Error(
			'There are no pull requests associated with the milestone.'
		);
	}

	let changelog = '';

	const groupedPullRequests = groupBy( pullRequests, getIssueType );
	const sortedGroups = Object.keys( groupedPullRequests ).sort( sortGroup );
	for ( const group of sortedGroups ) {
		changelog += '### ' + group + '\n\n';

		const groupPullRequests = groupedPullRequests[ group ];
		for ( const pullRequest of groupPullRequests ) {
			const entry = getEntry( pullRequest );
			if ( entry ) {
				changelog += entry + '\n';
			}
		}

		changelog += '\n';
	}

	return changelog;
}

/**
 * Generates and logs changelog for a milestone.
 *
 * @param {WPChangelogSettings} settings Changelog settings.
 */
async function createChangelog( settings ) {
	log(
		formats.title(
			`\n💃Preparing changelog for milestone: "${ settings.milestone }"\n\n`
		)
	);

	let changelog;
	try {
		changelog = await getChangelog( settings );
	} catch ( error ) {
		changelog = formats.error( error.stack );
	}

	log( changelog );
}

/**
 * Command that generates the release changelog.
 *
 * @param {WPChangelogCommandOptions} options
 */
async function getReleaseChangelog( options ) {
	await createChangelog( {
		owner: config.githubRepositoryOwner,
		repo: config.githubRepositoryName,
		token: options.token,
		milestone:
			options.milestone === undefined
				? getMilestone( getNextMajorVersion( manifest.version ) )
				: options.milestone,
	} );
}

/** @type {NodeJS.Module} */ ( module ).exports = {
	reword,
	capitalizeAfterColonSeparatedPrefix,
	createOmitByTitlePrefix,
	createOmitByLabel,
	addTrailingPeriod,
	getNormalizedTitle,
	getReleaseChangelog,
	getIssueType,
	sortGroup,
};
