/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	useBlockProps,
	__experimentalUseNoRecursiveRenders as useNoRecursiveRenders,
	Warning,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	Spinner,
	Modal,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TemplatePartPlaceholder from './placeholder';
import TemplatePartSelectionModal from './selection-modal';
import { TemplatePartAdvancedControls } from './advanced-controls';
import TemplatePartInnerBlocks from './inner-blocks';
import { createTemplatePartId } from './utils/create-template-part-id';

export default function TemplatePartEdit( {
	attributes,
	setAttributes,
	clientId,
} ) {
	const { slug, theme, tagName, layout = {} } = attributes;
	const templatePartId = createTemplatePartId( theme, slug );
	const [ hasAlreadyRendered, RecursionProvider ] = useNoRecursiveRenders(
		templatePartId
	);
	const [
		isTemplatePartSelectionOpen,
		setIsTemplatePartSelectionOpen,
	] = useState( false );

	// Set the postId block attribute if it did not exist,
	// but wait until the inner blocks have loaded to allow
	// new edits to trigger this.
	const {
		isResolved,
		innerBlocks,
		isMissing,
		defaultWrapper,
		area,
		areaLabel,
	} = useSelect(
		( select ) => {
			const { getEditedEntityRecord, hasFinishedResolution } = select(
				coreStore
			);
			const { getBlocks } = select( blockEditorStore );

			const getEntityArgs = [
				'postType',
				'wp_template_part',
				templatePartId,
			];
			const entityRecord = templatePartId
				? getEditedEntityRecord( ...getEntityArgs )
				: null;
			const _area = entityRecord?.area || attributes.area;
			const hasResolvedEntity = templatePartId
				? hasFinishedResolution(
						'getEditedEntityRecord',
						getEntityArgs
				  )
				: false;

			// FIXME: @wordpress/block-library should not depend on @wordpress/editor.
			// Blocks can be loaded into a *non-post* block editor.
			// eslint-disable-next-line @wordpress/data-no-store-string-literals
			const areaObject = select( 'core/editor' )
				.__experimentalGetDefaultTemplatePartAreas()
				.find( ( { area: value } ) => value === _area )?.area_tag;

			return {
				innerBlocks: getBlocks( clientId ),
				isResolved: hasResolvedEntity,
				isMissing: hasResolvedEntity && isEmpty( entityRecord ),
				defaultWrapper: areaObject?.area_tag ?? 'div',
				areaLabel: areaObject?.label || __( 'Template Part' ),
				area: _area,
			};
		},
		[ templatePartId, clientId ]
	);

	const blockProps = useBlockProps();
	const isPlaceholder = ! slug;
	const isEntityAvailable = ! isPlaceholder && ! isMissing && isResolved;
	const TagName = tagName || defaultWrapper;

	// We don't want to render a missing state if we have any inner blocks.
	// A new template part is automatically created if we have any inner blocks but no entity.
	if (
		innerBlocks.length === 0 &&
		( ( slug && ! theme ) || ( slug && isMissing ) )
	) {
		return (
			<TagName { ...blockProps }>
				<Warning>
					{ sprintf(
						/* translators: %s: Template part slug */
						__(
							'Template part has been deleted or is unavailable: %s'
						),
						slug
					) }
				</Warning>
			</TagName>
		);
	}

	if ( isEntityAvailable && hasAlreadyRendered ) {
		return (
			<TagName { ...blockProps }>
				<Warning>
					{ __( 'Block cannot be rendered inside itself.' ) }
				</Warning>
			</TagName>
		);
	}

	return (
		<RecursionProvider>
			<TemplatePartAdvancedControls
				tagName={ tagName }
				setAttributes={ setAttributes }
				isEntityAvailable={ isEntityAvailable }
				templatePartId={ templatePartId }
				defaultWrapper={ defaultWrapper }
			/>
			{ isPlaceholder && (
				<TagName { ...blockProps }>
					<TemplatePartPlaceholder
						area={ attributes.area }
						onOpenSelectionModal={ () =>
							setIsTemplatePartSelectionOpen( true )
						}
					/>
				</TagName>
			) }
			{ isEntityAvailable && (
				<BlockControls>
					<ToolbarGroup className="wp-block-template-part__block-control-group">
						<ToolbarButton
							onClick={ () =>
								setIsTemplatePartSelectionOpen( true )
							}
						>
							{ __( 'Replace' ) }
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
			) }
			{ isEntityAvailable && (
				<TemplatePartInnerBlocks
					clientId={ clientId }
					tagName={ TagName }
					blockProps={ blockProps }
					postId={ templatePartId }
					hasInnerBlocks={ innerBlocks.length > 0 }
					layout={ layout }
				/>
			) }
			{ ! isPlaceholder && ! isResolved && (
				<TagName { ...blockProps }>
					<Spinner />
				</TagName>
			) }
			{ isTemplatePartSelectionOpen && (
				<Modal
					className="block-editor-template-part__selection-modal"
					title={ sprintf(
						// Translators: %s as template part area title ("Header", "Footer", etc.).
						__( 'Choose a %s' ),
						areaLabel.toLowerCase()
					) }
					closeLabel={ __( 'Cancel' ) }
					onRequestClose={ () =>
						setIsTemplatePartSelectionOpen( false )
					}
				>
					<TemplatePartSelectionModal
						clientId={ clientId }
						area={ area }
						areaLabel={ areaLabel }
						setAttributes={ setAttributes }
						onClose={ () =>
							setIsTemplatePartSelectionOpen( false )
						}
					/>
				</Modal>
			) }
		</RecursionProvider>
	);
}
