/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { BlockPreview } from '@wordpress/block-editor';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	VisuallyHidden,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__unstableCompositeItem as CompositeItem,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { Icon, moreHorizontal } from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';
import { store as reusableBlocksStore } from '@wordpress/reusable-blocks';
import { DELETE, BACKSPACE } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import { PATTERNS, USER_PATTERNS } from './utils';
import { useLink } from '../routes/link';

export default function GridItem( { categoryId, composite, icon, item } ) {
	const instanceId = useInstanceId( GridItem );
	const descriptionId = `edit-site-library__pattern-description-${ instanceId }`;

	const { __experimentalDeleteReusableBlock } =
		useDispatch( reusableBlocksStore );
	const { createErrorNotice, createSuccessNotice } =
		useDispatch( noticesStore );

	const { onClick } = useLink( {
		postType: item.type,
		postId: item.type === USER_PATTERNS ? item.id : item.name,
		categoryId,
		categoryType: item.type,
		canvas: 'edit',
	} );

	const isEmpty = ! item.blocks?.length;
	const patternClassNames = classnames( 'edit-site-library__pattern', {
		'is-placeholder': isEmpty,
	} );
	const previewClassNames = classnames( 'edit-site-library__preview', {
		'is-inactive': item.type === PATTERNS,
	} );

	const deletePattern = async () => {
		try {
			await __experimentalDeleteReusableBlock( item.id );
			createSuccessNotice( __( 'Pattern successfully deleted.' ), {
				type: 'snackbar',
			} );
		} catch ( error ) {
			const errorMessage =
				error.message && error.code !== 'unknown_error'
					? error.message
					: __( 'An error occurred while deleting the pattern.' );
			createErrorNotice( errorMessage, { type: 'snackbar' } );
		}
	};

	return (
		<div
			className={ patternClassNames }
			aria-label={ item.title }
			aria-describedby={ item.description ? descriptionId : undefined }
		>
			<CompositeItem
				className={ previewClassNames }
				role="option"
				as="div"
				{ ...composite }
				onClick={ item.type !== PATTERNS ? onClick : undefined }
				onKeyDown={ ( event ) => {
					if (
						DELETE === event.keyCode ||
						BACKSPACE === event.keyCode
					) {
						deletePattern( item );
					}
				} }
			>
				{ isEmpty && __( 'Empty pattern' ) }
				{ ! isEmpty && <BlockPreview blocks={ item.blocks } /> }
				{ !! item.description && (
					<VisuallyHidden id={ descriptionId }>
						{ item.description }
					</VisuallyHidden>
				) }
			</CompositeItem>
			<HStack
				className="edit-site-library__footer"
				justify="space-between"
			>
				<HStack
					alignment="center"
					justify="left"
					spacing={ 3 }
					className="edit-site-library__pattern-title"
				>
					{ icon && <Icon icon={ icon } /> }
					<Heading level={ 5 }>{ item.title }</Heading>
				</HStack>
				{ item.type === USER_PATTERNS && (
					<DropdownMenu
						icon={ moreHorizontal }
						label={ __( 'Actions' ) }
						className="edit-site-library__dropdown"
						popoverProps={ { placement: 'bottom-end' } }
						toggleProps={ {
							className: 'edit-site-library__button',
							isSmall: true,
							describedBy: sprintf(
								/* translators: %s: pattern name */
								__( 'Action menu for %s pattern' ),
								item.title
							),
							// The dropdown menu is not focusable using the
							// keyboard as this would interfere with the grid's
							// roving tab index system. Instead, keyboard users
							// use keyboard shortcuts to trigger actions.
							tabIndex: -1,
						} }
					>
						{ ( { onClose } ) => (
							<MenuGroup>
								<MenuItem
									onClick={ () =>
										deletePattern.then( onClose )
									}
								>
									{ __( 'Delete' ) }
								</MenuItem>
							</MenuGroup>
						) }
					</DropdownMenu>
				) }
			</HStack>
		</div>
	);
}
