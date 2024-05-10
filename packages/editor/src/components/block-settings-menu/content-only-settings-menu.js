/**
 * WordPress dependencies
 */
import {
	BlockSettingsMenuControls,
	__unstableBlockSettingsMenuFirstItem as BlockSettingsMenuFirstItem,
	store as blockEditorStore,
	useBlockDisplayInformation,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { __experimentalText as Text, MenuItem } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';

function ContentOnlySettingsMenuItems( { clientId, onClose } ) {
	const { entity, onNavigateToEntityRecord } = useSelect(
		( select ) => {
			const {
				getBlockEditingMode,
				getBlockParentsByBlockName,
				getSettings,
				getBlockAttributes,
			} = select( blockEditorStore );
			const contentOnly =
				getBlockEditingMode( clientId ) === 'contentOnly';
			if ( ! contentOnly ) {
				return {};
			}
			const patternParent = getBlockParentsByBlockName(
				clientId,
				'core/block',
				true
			)[ 0 ];

			let record;
			if ( patternParent ) {
				record = select( coreStore ).getEntityRecord(
					'postType',
					'wp_block',
					getBlockAttributes( patternParent ).ref
				);
			} else {
				const { getCurrentPostType, getCurrentTemplateId } =
					select( editorStore );
				const currentPostType = getCurrentPostType();
				const templateId = getCurrentTemplateId();
				if ( currentPostType === 'page' && templateId ) {
					record = select( coreStore ).getEntityRecord(
						'postType',
						'wp_template',
						templateId
					);
				}
			}
			return {
				entity: record,
				onNavigateToEntityRecord:
					getSettings().onNavigateToEntityRecord,
			};
		},
		[ clientId ]
	);

	if ( ! entity ) {
		return (
			<TemplateLockContentOnlyMenuItems
				clientId={ clientId }
				onClose={ onClose }
			/>
		);
	}

	const isPattern = entity.type === 'wp_block';

	return (
		<>
			<BlockSettingsMenuFirstItem>
				<Text
					variant="muted"
					as="p"
					className="editor-content-only-settings-menu__description"
				>
					{ isPattern
						? sprintf(
								// translators: %s: pattern's title.
								__(
									'This block is part of the pattern: "%s". Edit the pattern to move or delete it.'
								),
								entity.title.raw
						  )
						: sprintf(
								// translators: %s: template's title.
								__(
									'This block is part of the template: "%s". Edit the template to move or delete it.'
								),
								entity.title.rendered
						  ) }
				</Text>
			</BlockSettingsMenuFirstItem>
			<MenuItem
				onClick={ () => {
					onNavigateToEntityRecord( {
						postId: entity.id,
						postType: entity.type,
					} );
				} }
			>
				{ isPattern ? __( 'Edit pattern' ) : __( 'Edit template' ) }
			</MenuItem>
		</>
	);
}

function TemplateLockContentOnlyMenuItems( { clientId, onClose } ) {
	const { contentLockingParent } = useSelect(
		( select ) => {
			const { getContentLockingParent } = unlock(
				select( blockEditorStore )
			);
			return {
				contentLockingParent: getContentLockingParent( clientId ),
			};
		},
		[ clientId ]
	);
	const blockDisplayInformation =
		useBlockDisplayInformation( contentLockingParent );
	// Disable reason: We're using a hook here so it has to be on top-level.
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const { modifyContentLockBlock, selectBlock } = unlock(
		useDispatch( blockEditorStore )
	);

	if ( ! blockDisplayInformation?.title ) {
		return null;
	}

	return (
		<>
			<BlockSettingsMenuFirstItem>
				<Text
					variant="muted"
					as="p"
					className="editor-content-only-settings-menu__description"
				>
					{ sprintf(
						// translators: %s: block's title.
						__(
							'The parent "%s" block is partially locked, preventing the movement or deletion of child blocks, as well as the addition of any inner blocks.'
						),
						blockDisplayInformation.title
					) }
				</Text>
			</BlockSettingsMenuFirstItem>
			<MenuItem
				onClick={ () => {
					selectBlock( contentLockingParent );
					modifyContentLockBlock( contentLockingParent );
					onClose();
				} }
			>
				{ sprintf(
					// translators: %s: block's title.
					__( 'Modify "%s"' ),
					blockDisplayInformation.title
				) }
			</MenuItem>
		</>
	);
}

export default function ContentOnlySettingsMenu() {
	return (
		<BlockSettingsMenuControls>
			{ ( { selectedClientIds, onClose } ) =>
				selectedClientIds.length === 1 && (
					<ContentOnlySettingsMenuItems
						clientId={ selectedClientIds[ 0 ] }
						onClose={ onClose }
					/>
				)
			}
		</BlockSettingsMenuControls>
	);
}
