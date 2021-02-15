/**
 * Internal dependencies
 */
import GalleryEdit from './edit';
import GalleryEditV1 from './v1/edit';

/*
 * Using a wrapper around the logic to load the edit for v1 of Gallery block
 * or the refactored version with InnerBlocks. This is to prevent conditional
 * use of hooks lint errors if adding this logic to the top of the edit component.
 */
export default function GalleryEditWrapper( props ) {
	const { attributes } = props;

	if ( attributes?.ids?.length > 0 || attributes?.images?.length > 0 ) {
		return <GalleryEditV1 { ...props } />;
	}

	return <GalleryEdit { ...props } />;
}
