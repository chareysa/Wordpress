/**
 * WordPress dependencies
 */
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { useIsSiteEditorLoading } from './hooks';
import Editor from '../editor';
import PagePages from '../page-pages';
import PagePatterns from '../page-patterns';
import PageTemplatesTemplateParts from '../page-templates-template-parts';
import Sidebar from '../sidebar';
import { useRouter } from '../sync-state-with-url/use-sync-path-with-url';
import {
	TEMPLATE_POST_TYPE,
	TEMPLATE_PART_POST_TYPE,
} from '../../utils/constants';

const { useLocation, useHistory } = unlock( routerPrivateApis );

export default function useLayoutAreas() {
	const isSiteEditorLoading = useIsSiteEditorLoading();
	const history = useHistory();
	const { params } = useLocation();
	const { postType, postId, path, layout, isCustom, canvas } = params ?? {};
	const router = useRouter();

	// Note: Since "sidebar" is not yet supported here,
	// returning undefined from "mobile" means show the sidebar.

	// Regular page
	if ( path === '/page' ) {
		const isListLayout = layout === 'list' || ! layout;
		return {
			key: 'pages-list',
			areas: {
				sidebar: <Sidebar router={ router } />,
				content: <PagePages />,
				preview: isListLayout && (
					<Editor
						isLoading={ isSiteEditorLoading }
						onClick={ () =>
							history.push( {
								path,
								postType: 'page',
								postId,
								canvas: 'edit',
							} )
						}
					/>
				),
				mobile:
					canvas === 'edit' ? (
						<Editor isLoading={ isSiteEditorLoading } />
					) : (
						<PagePages />
					),
			},
			widths: {
				content: isListLayout ? 380 : undefined,
			},
		};
	}

	// Regular other post types
	if ( postType && postId ) {
		return {
			key: 'page',
			areas: {
				sidebar: <Sidebar router={ router } />,
				preview: <Editor isLoading={ isSiteEditorLoading } />,
				mobile: canvas === 'edit' && (
					<Editor isLoading={ isSiteEditorLoading } />
				),
			},
		};
	}

	// Templates
	if ( path === '/wp_template' ) {
		const isListLayout = isCustom !== 'true' && layout === 'list';
		return {
			key: 'templates-list',
			areas: {
				sidebar: <Sidebar router={ router } />,
				content: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_POST_TYPE }
					/>
				),
				preview: isListLayout && (
					<Editor isLoading={ isSiteEditorLoading } />
				),
				mobile: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_POST_TYPE }
					/>
				),
			},
			widths: {
				content: isListLayout ? 380 : undefined,
			},
		};
	}

	// Template parts
	if ( path === '/wp_template_part/all' ) {
		const isListLayout = isCustom !== 'true' && layout === 'list';
		return {
			key: 'template-parts',
			areas: {
				sidebar: <Sidebar router={ router } />,
				content: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_PART_POST_TYPE }
					/>
				),
				preview: isListLayout && (
					<Editor isLoading={ isSiteEditorLoading } />
				),
				mobile: (
					<PageTemplatesTemplateParts
						postType={ TEMPLATE_PART_POST_TYPE }
					/>
				),
			},
			widths: {
				content: isListLayout ? 380 : undefined,
			},
		};
	}

	// Patterns
	if ( path === '/patterns' ) {
		return {
			key: 'patterns',
			areas: {
				sidebar: <Sidebar router={ router } />,
				content: <PagePatterns />,
				mobile: <PagePatterns />,
			},
		};
	}

	// Fallback shows the home page preview
	return {
		key: 'default',
		areas: {
			sidebar: <Sidebar router={ router } />,
			preview: <Editor isLoading={ isSiteEditorLoading } />,
			mobile: canvas === 'edit' && (
				<Editor isLoading={ isSiteEditorLoading } />
			),
		},
	};
}
