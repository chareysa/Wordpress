( function() {
	const { registerBlockType } = wp.blocks;
	const { createElement: el } = wp.element;
	const { InnerBlocks } = wp.editor;
	const __ = wp.i18n.__;
	const divProps = { className: 'product', style: { outline: '1px solid gray', padding: 5 } };
	const template = [
		[ 'core/image' ],
		[ 'core/paragraph', { placeholder: __( 'Add a description' ) } ],
		[ 'core/quote' ]
	];

	const save = function() {
		return el( 'div', divProps,
			el( InnerBlocks.Content )
		);
	};
	registerBlockType( 'test/allowed-blocks-unset', {
		title: 'Allowed Blocks Unset',
		icon: 'carrot',
		category: 'common',

		edit() {
			return el( 'div', divProps,
				el( InnerBlocks, { template } )
			);
		},

		save,
	} );

	registerBlockType( 'test/allowed-blocks-set', {
		title: 'Allowed Blocks Set',
		icon: 'carrot',
		category: 'common',

		edit() {
			return el( 'div', divProps,
				el(
					InnerBlocks,
					{
						template,
						allowedBlocks: [
							'core/button',
							'core/gallery',
							'core/list',
							'core/media-text',
							'core/quote',
						],
					}
				)
			);
		},

		save,
	} );

} )();
