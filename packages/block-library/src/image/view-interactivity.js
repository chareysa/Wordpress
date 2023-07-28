/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

const focusableSelectors = [
	'a[href]',
	'area[href]',
	'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
	'select:not([disabled]):not([aria-hidden])',
	'textarea:not([disabled]):not([aria-hidden])',
	'button:not([disabled]):not([aria-hidden])',
	'iframe',
	'object',
	'embed',
	'[contenteditable]',
	'[tabindex]:not([tabindex^="-"])',
];

store( {
	actions: {
		core: {
			image: {
				showLightbox: ( { context, event } ) => {
					// We can't initialize the lightbox until the reference
					// image is loaded, otherwise the UX is broken.
					if ( ! context.core.image.imageLoaded ) {
						return;
					}
					context.core.image.initialized = true;
					context.core.image.lastFocusedElement =
						window.document.activeElement;
					context.core.image.scrollDelta = 0;

					context.core.image.lightboxEnabled = true;
					if ( context.core.image.lightboxAnimation === 'zoom' ) {
						setZoomStyles( context, event );
					}
					// Hide overflow only when the animation is in progress,
					// otherwise the removal of the scrollbars will draw attention
					// to itself and look like an error
					document.documentElement.classList.add(
						'has-lightbox-open'
					);

					// Since the img is hidden and its src not loaded until
					// the lightbox is opened, let's create an img element on the fly
					// so we can get the dimensions we need to calculate the styles
					context.core.image.preloadInitialized = true;
					const imgDom = document.createElement( 'img' );
					imgDom.onload = function () {
						context.core.image.activateLargeImage = true;
					};
					imgDom.setAttribute(
						'src',
						context.core.image.imageUploadedSrc
					);
				},
				hideLightbox: async ( { context, event } ) => {
					context.core.image.hideAnimationEnabled = true;
					if ( context.core.image.lightboxEnabled ) {
						// If scrolling, wait a moment before closing the lightbox.
						if ( context.core.image.lightboxAnimation === 'fade' ) {
							context.core.image.scrollDelta += event.deltaY;
							if (
								event.type === 'mousewheel' &&
								Math.abs(
									window.scrollY -
										context.core.image.scrollDelta
								) < 10
							) {
								return;
							}
						} else if (
							context.core.image.lightboxAnimation === 'zoom'
						) {
							// Disable scroll until the zoom animation ends.
							// Get the current page scroll position
							const scrollTop =
								window.pageYOffset ||
								document.documentElement.scrollTop;
							const scrollLeft =
								window.pageXOffset ||
								document.documentElement.scrollLeft;
							// if any scroll is attempted, set this to the previous value.
							window.onscroll = function () {
								window.scrollTo( scrollLeft, scrollTop );
							};
							// Enable scrolling after the animation finishes
							setTimeout( function () {
								window.onscroll = function () {};
							}, 400 );
						}

						document.documentElement.classList.remove(
							'has-lightbox-open'
						);

						context.core.image.lightboxEnabled = false;
						context.core.image.lastFocusedElement.focus();
					}
				},
				handleKeydown: ( { context, actions, event } ) => {
					if ( context.core.image.lightboxEnabled ) {
						if ( event.key === 'Tab' || event.keyCode === 9 ) {
							// If shift + tab it change the direction
							if (
								event.shiftKey &&
								window.document.activeElement ===
									context.core.image.firstFocusableElement
							) {
								event.preventDefault();
								context.core.image.lastFocusableElement.focus();
							} else if (
								! event.shiftKey &&
								window.document.activeElement ===
									context.core.image.lastFocusableElement
							) {
								event.preventDefault();
								context.core.image.firstFocusableElement.focus();
							}
						}

						if ( event.key === 'Escape' || event.keyCode === 27 ) {
							actions.core.image.hideLightbox( {
								context,
								event,
							} );
						}
					}
				},
				preloadLightboxImage: ( { context } ) => {
					if ( ! context.core.image.preloadInitialized ) {
						context.core.image.preloadInitialized = true;
						const imgDom = document.createElement( 'img' );
						imgDom.setAttribute(
							'src',
							context.core.image.imageUploadedSrc
						);
					}
				},
			},
		},
	},
	selectors: {
		core: {
			image: {
				roleAttribute: ( { context } ) => {
					return context.core.image.lightboxEnabled ? 'dialog' : '';
				},
				responsiveImgSrc: ( { context } ) => {
					return context.core.image.activateLargeImage &&
						context.core.image.hideAnimationEnabled
						? ''
						: context.core.image.imageCurrentSrc;
				},
				enlargedImgSrc: ( { context } ) => {
					return context.core.image.initialized
						? context.core.image.imageUploadedSrc
						: '';
				},
				inheritSize: ( { context } ) => {
					return context.core.image.lightboxEnabled && 'inherit';
				},
			},
		},
	},
	effects: {
		core: {
			image: {
				setCurrentSrc: ( { context, ref } ) => {
					if ( ref.complete ) {
						context.core.image.imageLoaded = true;
						context.core.image.imageCurrentSrc = ref.currentSrc;
					} else {
						ref.addEventListener( 'load', function () {
							context.core.image.imageLoaded = true;
							context.core.image.imageCurrentSrc =
								this.currentSrc;
						} );
					}
				},
				initLightbox: async ( { context, ref } ) => {
					context.core.image.figureRef =
						ref.querySelector( 'figure' );
					context.core.image.imageRef = ref.querySelector( 'img' );
					if ( context.core.image.lightboxEnabled ) {
						const focusableElements =
							ref.querySelectorAll( focusableSelectors );
						context.core.image.firstFocusableElement =
							focusableElements[ 0 ];
						context.core.image.lastFocusableElement =
							focusableElements[ focusableElements.length - 1 ];

						ref.querySelector( '.close-button' ).focus();
					}
				},
			},
		},
	},
} );

function setZoomStyles( context, event ) {
	// The reference img element lies adjacent
	// to the event target button in the DOM.
	const {
		naturalWidth,
		naturalHeight,
		offsetWidth: originalWidth,
		offsetHeight: originalHeight,
	} = event.target.nextElementSibling;
	const { x: screenPosX, y: screenPosY } =
		event.target.nextElementSibling.getBoundingClientRect();

	// Typically, we use the image's full-sized dimensions. If those
	// dimensions have not been set (i.e. an external image with only one size),
	// the image's dimensions in the lightbox are the same
	// as those of the image in the content.
	let imgMaxWidth = parseFloat(
		context.core.image.targetWidth !== 'none'
			? context.core.image.targetWidth
			: naturalWidth
	);
	let imgMaxHeight = parseFloat(
		context.core.image.targetHeight !== 'none'
			? context.core.image.targetHeight
			: naturalHeight
	);

	// Natural ratio of the image clicked to open the lightbox.
	const naturalRatio = naturalWidth / naturalHeight;
	// Original ratio of the image clicked to open the lightbox.
	const originalRatio = originalWidth / originalHeight;
	// Ratio of the biggest image stored in the database.
	let imgRatio = imgMaxWidth / imgMaxHeight;
	let containerMaxWidth = imgMaxWidth;
	let containerMaxHeight = imgMaxHeight;
	let containerWidth = imgMaxWidth;
	let containerHeight = imgMaxHeight;
	// Check if the target image has a different ratio than the original one (thumbnail).
	// Recalculate the width and height.
	if ( naturalRatio.toFixed( 2 ) !== imgRatio.toFixed( 2 ) ) {
		if ( naturalRatio > imgRatio ) {
			// If the width is reached before the height, we keep the maxWidth
			// and recalculate the height.
			// Unless the difference between the maxHeight and the reducedHeight
			// is higher than the maxWidth, where we keep the reducedHeight and
			// recalculate the width.
			const reducedHeight = imgMaxWidth / naturalRatio;
			if ( imgMaxHeight - reducedHeight > imgMaxWidth ) {
				imgMaxHeight = reducedHeight;
				imgMaxWidth = reducedHeight * naturalRatio;
			} else {
				imgMaxHeight = imgMaxWidth / naturalRatio;
			}
		} else {
			// If the height is reached before the width, we keep the maxHeight
			// and recalculate the width.
			// Unless the difference between the maxWidth and the reducedWidth
			// is higher than the maxHeight, where we keep the reducedWidth and
			// recalculate the height.
			const reducedWidth = imgMaxHeight * naturalRatio;
			if ( imgMaxWidth - reducedWidth > imgMaxHeight ) {
				imgMaxWidth = reducedWidth;
				imgMaxHeight = reducedWidth / naturalRatio;
			} else {
				imgMaxWidth = imgMaxHeight * naturalRatio;
			}
		}
		containerWidth = imgMaxWidth;
		containerHeight = imgMaxHeight;
		imgRatio = imgMaxWidth / imgMaxHeight;

		// Calculate the max size of the container.
		if ( originalRatio > imgRatio ) {
			containerMaxWidth = imgMaxWidth;
			containerMaxHeight = containerMaxWidth / originalRatio;
		} else {
			containerMaxHeight = imgMaxHeight;
			containerMaxWidth = containerMaxHeight * originalRatio;
		}
	}

	// If the image has been pixelated on purpose, keep that size.
	if ( originalWidth > containerWidth || originalHeight > containerHeight ) {
		containerWidth = originalWidth;
		containerHeight = originalHeight;
	}

	// Calculate the final lightbox image size and the scale factor.
	// MaxWidth is either the window container or the image resolution.
	// TO DO: Add padding to the window container value.
	const targetMaxWidth = Math.min( window.innerWidth, containerWidth );
	const targetMaxHeight = Math.min( window.innerHeight, containerHeight );
	const targetContainerRatio = targetMaxWidth / targetMaxHeight;

	if ( originalRatio > targetContainerRatio ) {
		// If targetMaxWidth is reached before targetMaxHeight
		containerWidth = targetMaxWidth;
		containerHeight = containerWidth / originalRatio;
	} else {
		// If targetMaxHeight is reached before targetMaxWidth
		containerHeight = targetMaxHeight;
		containerWidth = containerHeight * originalRatio;
	}

	const containerScale = originalWidth / containerWidth;
	const lightboxImgWidth =
		imgMaxWidth * ( containerWidth / containerMaxWidth );
	const lightboxImgHeight =
		imgMaxHeight * ( containerHeight / containerMaxHeight );

	// Add the CSS variables needed.
	const root = document.documentElement;
	root.style.setProperty(
		'--lightbox-image-target-aspect-ratio',
		originalRatio
	);
	root.style.setProperty(
		'--lightbox-initial-top-position',
		screenPosY + 'px'
	);
	root.style.setProperty(
		'--lightbox-initial-left-position',
		screenPosX + 'px'
	);
	root.style.setProperty(
		'--lightbox-container-width',
		containerWidth + 'px'
	);
	root.style.setProperty(
		'--lightbox-container-height',
		containerHeight + 'px'
	);
	root.style.setProperty( '--lightbox-image-width', lightboxImgWidth + 'px' );
	root.style.setProperty(
		'--lightbox-image-height',
		lightboxImgHeight + 'px'
	);
	root.style.setProperty( '--lightbox-scale', containerScale );
}
