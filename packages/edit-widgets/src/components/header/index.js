/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';
import {
	serialize,
} from '@wordpress/blocks';

function Header( { saveWidgetAreas } ) {
	return (
		<div
			className="edit-widgets-header"
			role="region"
			aria-label={ __( 'Widgets screen top bar' ) }
			tabIndex="-1"
		>
			<h1 className="edit-widgets-header__title">
				{ __( 'Block Areas' ) } { __( '(experimental)' ) }
			</h1>

			<div className="edit-widgets-header__actions">
				<Button isPrimary isLarge onClick={ saveWidgetAreas }>
					{ __( 'Update' ) }
				</Button>
			</div>
		</div>
	);
}

export default compose( [
	withDispatch( ( dispatch, props, { select } ) => {
		return {
			saveWidgetAreas() {
				const { getWidgetAreas, getWidgetAreaBlocks } = select( 'core/edit-widgets' );
				const widgetAreas = getWidgetAreas();
				const { saveWidgetArea } = dispatch( 'core' );
				widgetAreas.forEach( ( { id } ) => {
					saveWidgetArea( {
						id,
						content: serialize( getWidgetAreaBlocks( id ) ),
					} );
				} );
			},
		};
	} ),
] )( Header );

