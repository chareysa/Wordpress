<?php
/**
 * Three columns with images and text.
 *
 * @package WordPress
 */

return array(
	'title'       => __( 'Three columns with images and text' ),
	'categories'  => array( 'columns' ),
	'content'     => '<!-- wp:group {"align":"full","style":{"color":{"background":"#f8f4e4"}}} -->
	<div class="wp-block-group alignfull has-background" style="background-color:#f8f4e4"><div class="wp-block-group__inner-container"><!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide"><!-- wp:column -->
	<div class="wp-block-column"><!-- wp:spacer -->
	<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:heading {"level":6,"textColor":"black"} -->
	<h6 class="has-black-color has-text-color">ECOSYSTEM</h6>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.1","fontSize":"5vw"}},"textColor":"black"} -->
	<p class="has-black-color has-text-color" style="font-size:5vw;line-height:1.1"><strong>Positive growth.</strong></p>
	<!-- /wp:paragraph --><!-- wp:spacer {"height":5} -->
	<div style="height:5px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer --></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns -->
	
	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide"><!-- wp:column {"width":"33.38%"} -->
	<div class="wp-block-column" style="flex-basis:33.38%"><!-- wp:paragraph {"textColor":"black","fontSize":"extra-small"} -->
	<p class="has-black-color has-text-color has-extra-small-font-size">' . __( '<em>Nature</em>, in the common sense, refers to essences unchanged by man; space, the air, the river, the leaf.&nbsp;<em>Art</em>&nbsp;is applied to the mixture of his will with the same things, as in a house, a canal, a statue, a picture. But his operations taken together are so insignificant, a little chipping, baking, patching, and washing, that in an impression so grand as that of the world on the human mind, they do not vary the result.' ) . '</p>
	<!-- /wp:paragraph --></div>
	<!-- /wp:column -->
	
	<!-- wp:column {"width":"33%"} -->
	<div class="wp-block-column" style="flex-basis:33%"><!-- wp:spacer -->
	<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
	
	<!-- wp:image {"id":345,"sizeSlug":"large","linkDestination":"none"} -->
	<figure class="wp-block-image size-large"><img src="https://cldup.com/1PbDC8HHhu.jpg" alt="' . __( 'The sun setting through a dense forest of trees.' ) . '" class="wp-image-345"/></figure>
	<!-- /wp:image --></div>
	<!-- /wp:column -->
	
	<!-- wp:column {"width":"33.62%"} -->
	<div class="wp-block-column" style="flex-basis:33.62%"><!-- wp:image {"id":347,"sizeSlug":"large","linkDestination":"none"} -->
	<figure class="wp-block-image size-large"><img src="https://cldup.com/IPeC2jeViL.jpg" alt="' . __( 'Wind turbines standing on a grassy plain, against a blue sky.' ) . '" class="wp-image-347"/></figure>
	<!-- /wp:image --></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns -->
	
	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide"><!-- wp:column {"width":"67%"} -->
	<div class="wp-block-column" style="flex-basis:67%"><!-- wp:image {"align":"right","id":348,"sizeSlug":"large","linkDestination":"none"} -->
	<div class="wp-block-image"><figure class="alignright size-large"><img src="https://cldup.com/C6Ju0QAlrk.jpg" alt="' . __( 'The sun shining over a ridge leading down into the shore. In the distance, a car drives down a road.' ) . '" class="wp-image-348"/></figure></div>
	<!-- /wp:image --></div>
	<!-- /wp:column -->
	
	<!-- wp:column {"verticalAlignment":"center","width":"33%"} -->
	<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:33%"><!-- wp:paragraph {"textColor":"black","fontSize":"extra-small"} -->
	<p class="has-black-color has-text-color has-extra-small-font-size">' . __( "Undoubtedly we have no questions to ask which are unanswerable. We must trust the perfection of the creation so far, as to believe that whatever curiosity the order of things has awakened in our minds, the order of things can satisfy. Every man's condition is a solution in hieroglyphic to those inquiries he would put." ) . '</p>
	<!-- /wp:paragraph --></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns --></div></div>
	<!-- /wp:group -->',
	'description' => _x( 'Three columns with images and text', 'Block pattern description' ),
);
