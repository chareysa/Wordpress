<?php
/**
 * Media & text in a full height container.
 *
 * @package WordPress
 */

return array(
	'title'       => __( 'Media & text in a full height container' ),
	'categories'  => array( 'header' ),
	'content'     => '<!-- wp:cover {"customOverlayColor":"#ffffff","minHeight":100,"minHeightUnit":"vh","contentPosition":"center center","align":"full"} -->
	<div class="wp-block-cover alignfull has-background-dim" style="background-color:#ffffff;min-height:100vh"><div class="wp-block-cover__inner-container"><!-- wp:media-text {"mediaId":2501,"mediaLink":"https://mywptesting.site/2021/02/button-bug/sand-rock-texture-dry-brown-soil-726223-pxhere-com_/","mediaType":"image","mediaWidth":56,"verticalAlignment":"center","imageFill":true} -->
	<div class="wp-block-media-text alignwide is-stacked-on-mobile is-vertically-aligned-center is-image-fill" style="grid-template-columns:56% auto"><figure class="wp-block-media-text__media" style="background-image:url(https://mywptesting.site/wp-content/uploads/2021/02/sand-rock-texture-dry-brown-soil-726223-pxhere.com_-1024x681.jpg);background-position:50% 50%"><img src="https://mywptesting.site/wp-content/uploads/2021/02/sand-rock-texture-dry-brown-soil-726223-pxhere.com_-1024x681.jpg" alt="' . __( 'Close-up of dried, cracked earth.' ) . '" class="wp-image-2501 size-full"/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"style":{"typography":{"fontSize":"32px"},"color":{"text":"#000000"}}} -->
	<h2 class="has-text-color" style="color:#000000;font-size:32px"><strong>' . __( "What's the problem?" ) . '</strong></h2>
	<!-- /wp:heading -->
	
	<!-- wp:paragraph {"style":{"typography":{"fontSize":"17px"},"color":{"text":"#000000"}}} -->
	<p class="has-text-color" style="color:#000000;font-size:17px">' . __( 'Trees are more important today than ever before. More than 10,000 products are reportedly made from trees. Through chemistry, the humble woodpile is yielding chemicals, plastics and fabrics that were beyond comprehension when an axe first felled a Texas tree.' ) . '</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons -->
	<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-fill"} -->
	<div class="wp-block-button is-style-fill"><a class="wp-block-button__link">' . __( 'Learn more' ) . '</a></div>
	<!-- /wp:button --></div>
	<!-- /wp:buttons --></div></div>
	<!-- /wp:media-text --></div></div>
	<!-- /wp:cover -->',
	'description' => _x( 'Media and text block with image to the left and text and button to the right', 'Block pattern description' ),
);
