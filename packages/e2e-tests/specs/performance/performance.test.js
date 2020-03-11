/**
 * External dependencies
 */
import { join } from 'path';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

/**
 * WordPress dependencies
 */
import {
	createNewPost,
	saveDraft,
	insertBlock,
} from '@wordpress/e2e-test-utils';

function readFile( filePath ) {
	return existsSync( filePath )
		? readFileSync( filePath, 'utf8' ).trim()
		: '';
}

function deleteFile( filePath ) {
	if ( existsSync( filePath ) ) {
		unlinkSync( filePath );
	}
}

describe( 'Performance', () => {
	it( '1000 paragraphs', async () => {
		const html = readFile(
			join( __dirname, '../../assets/large-post.html' )
		);

		await createNewPost();
		await page.evaluate( ( _html ) => {
			const { parse } = window.wp.blocks;
			const { dispatch } = window.wp.data;
			const blocks = parse( _html );

			blocks.forEach( ( block ) => {
				if ( block.name === 'core/image' ) {
					delete block.attributes.id;
					delete block.attributes.url;
				}
			} );

			dispatch( 'core/block-editor' ).resetBlocks( blocks );
		}, html );
		await saveDraft();

		const results = {
			load: [],
			domcontentloaded: [],
			type: [],
		};

		let i = 1;

		while ( i-- ) {
			await page.reload( { waitUntil: [ 'domcontentloaded', 'load' ] } );
			const timings = JSON.parse(
				await page.evaluate( () =>
					JSON.stringify( window.performance.timing )
				)
			);
			const {
				navigationStart,
				domContentLoadedEventEnd,
				loadEventEnd,
			} = timings;
			results.load.push( loadEventEnd - navigationStart );
			results.domcontentloaded.push(
				domContentLoadedEventEnd - navigationStart
			);
		}

		await insertBlock( 'Paragraph' );

		i = 200;
		const traceFile = __dirname + '/trace.json';

		await page.tracing.start( {
			path: traceFile,
			screenshots: false,
			categories: [ 'devtools.timeline' ],
		} );

		while ( i-- ) {
			await page.keyboard.type( 'x' );
		}

		await page.tracing.stop();

		const traceResults = JSON.parse( readFile( traceFile ) );
		const isKeypressEvent = ( item ) =>
			item.cat === 'devtools.timeline' &&
			item.name === 'EventDispatch' &&
			item.dur &&
			item.args &&
			item.args.data &&
			item.args.data.type === 'keypress';

		results.type = traceResults.traceEvents
			.filter( isKeypressEvent )
			.map( ( item ) => item.dur / 1000 );

		writeFileSync(
			__dirname + '/results.json',
			JSON.stringify( results, null, 2 )
		);

		deleteFile( traceFile );

		expect( true ).toBe( true );
	} );
} );
