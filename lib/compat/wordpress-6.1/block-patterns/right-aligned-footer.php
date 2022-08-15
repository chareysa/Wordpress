<?php
/**
 * Footer: Right-aligned footer.
 *
 * @package WordPress
 */

return array(
	'title'      => _x( 'Right-aligned footer', 'Block pattern title', 'gutenberg' ),
	'blockTypes' => array( 'core/template-part/footer' ),
	'categories' => array( 'footer' ),
	'content'    => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"4em","bottom":"2em"}}},"layout":{"inherit":false}} -->
					<div class="wp-block-group alignfull" style="padding-top:4em;padding-bottom:2em"><!-- wp:paragraph {"align":"right"} -->
					<p class="has-text-align-right">Proudly Powered by <a href="https://wordpress.org" data-type="URL" data-id="https://wordpress.org">WordPress</a></p>
					<!-- /wp:paragraph --></div>
					<!-- /wp:group -->',
);
