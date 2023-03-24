/**
 * External dependencies
 */
import { Command } from 'cmdk';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as commandsStore } from '../store';

function CommandsPerPage( { search, navigateToPage, loader, commands } ) {
	const { isLoading, commands: loaderCommands = [] } =
		loader( { search } ) ?? {};
	const allCommands = [ ...commands, ...loaderCommands ];

	return (
		<Command.List>
			{ ! isLoading && ! allCommands?.length && (
				<Command.Empty>{ __( 'No results found.' ) }</Command.Empty>
			) }

			{ isLoading && (
				<Command.Loading>{ __( 'Hang on…' ) }</Command.Loading>
			) }

			{ allCommands.map( ( command ) => (
				<Command.Item
					key={ command.name }
					value={ command.name }
					onSelect={ () => command.callback( { navigateToPage } ) }
				>
					{ command.label }
				</Command.Item>
			) ) }
		</Command.List>
	);
}

export function CommandMenu() {
	const [ search, setSearch ] = useState( '' );
	const [ open, setOpen ] = useState( false );
	const [ pages, setPages ] = useState( [] );
	const navigateToPage = ( newPage ) => setPages( [ ...pages, newPage ] );
	const currentPage = pages.length ? pages[ pages.length - 1 ] : null;
	const { commands, loader } = useSelect(
		( select ) => {
			const { getCommands, getCommandLoader } = select( commandsStore );
			return {
				commands: getCommands( currentPage ),
				loader: getCommandLoader( currentPage ),
			};
		},
		[ currentPage ]
	);

	// loader is actually a custom hook
	// so to avoid breaking the rules of hooks
	// the CommandsPerPage component need to be
	// remounted on each loader change
	// We use the key state to make sure we do that properly.
	const currentLoader = useRef( loader );
	const [ key, setKey ] = useState( 0 );
	useEffect( () => {
		if ( currentLoader.current !== loader ) {
			currentLoader.current = loader;
			setKey( ( prevKey ) => prevKey + 1 );
		}
	}, [ loader ] );

	// Toggle the menu when ⌘K is pressed
	useEffect( () => {
		const down = ( e ) => {
			if ( e.key === 'k' && e.metaKey ) {
				setOpen( ( prevOpen ) => ! prevOpen );
			}
		};

		document.addEventListener( 'keydown', down );
		return () => document.removeEventListener( 'keydown', down );
	}, [] );

	return (
		<Command.Dialog
			open={ open }
			onOpenChange={ setOpen }
			label={ __( 'Global Command Menu' ) }
		>
			<Command.Input value={ search } onValueChange={ setSearch } />
			<CommandsPerPage
				key={ key }
				navigateToPage={ navigateToPage }
				loader={ currentLoader.current }
				commands={ commands }
				search={ search }
			/>
		</Command.Dialog>
	);
}
