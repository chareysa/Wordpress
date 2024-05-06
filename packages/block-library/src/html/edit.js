/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	PlainText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ToolbarButton,
	ToolbarGroup,
	VisuallyHidden,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Preview from './preview';

export default function HTMLEdit( { attributes, setAttributes, isSelected } ) {
	const instanceId = useInstanceId( HTMLEdit, 'html-edit-desc' );
	const blockProps = useBlockProps( {
		className: 'block-library-html__edit',
		'aria-describedby': attributes.isPreview ? instanceId : undefined,
	} );

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						isPressed={ ! attributes.isPreview }
						onClick={ () => setAttributes( { isPreview: false } ) }
					>
						{ __( 'Edit' ) }
					</ToolbarButton>
					<ToolbarButton
						isPressed={ attributes.isPreview }
						onClick={ () => setAttributes( { isPreview: true } ) }
					>
						{ __( 'Preview' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			{ attributes.isPreview ? (
				<>
					<Preview
						content={ attributes.content }
						isSelected={ isSelected }
					/>
					<VisuallyHidden id={ instanceId }>
						{ __(
							'HTML preview is not yet fully accessible. Please switch screen reader to virtualized mode to navigate the below iFrame.'
						) }
					</VisuallyHidden>
				</>
			) : (
				<PlainText
					value={ attributes.content }
					onChange={ ( content ) => setAttributes( { content } ) }
					placeholder={ __( 'Write HTML…' ) }
					aria-label={ __( 'HTML' ) }
				/>
			) }
		</div>
	);
}
