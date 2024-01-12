/**
 * External dependencies
 */
import { useEffect } from 'preact/hooks';
import { effect } from '@preact/signals';

/**
 * Internal dependencies
 */
import { getScope, setScope, resetScope } from './hooks';

const afterNextFrame = ( callback ) => {
	return new Promise( ( resolve ) => {
		const done = () => {
			clearTimeout( timeout );
			window.cancelAnimationFrame( raf );
			setTimeout( () => {
				callback();
				resolve();
			} );
		};
		const timeout = setTimeout( done, 100 );
		const raf = window.requestAnimationFrame( done );
	} );
};

// Using the mangled properties:
// this.c: this._callback
// this.x: this._compute
// https://github.com/preactjs/signals/blob/main/mangle.json
function createFlusher( compute, notify ) {
	let flush;
	const dispose = effect( function () {
		flush = this.c.bind( this );
		this.x = compute;
		this.c = notify;
		return compute();
	} );
	return { flush, dispose };
}

// Version of `useSignalEffect` with a `useEffect`-like execution. This hook
// implementation comes from this PR, but we added short-cirtuiting to avoid
// infinite loops: https://github.com/preactjs/signals/pull/290
export function useSignalEffect( callback ) {
	useEffect( () => {
		let eff = null;
		let isExecuting = false;
		const notify = async () => {
			if ( eff && ! isExecuting ) {
				isExecuting = true;
				await afterNextFrame( eff.flush );
				isExecuting = false;
			}
		};
		eff = createFlusher( callback, notify );
		return eff.dispose;
	}, [] );
}

/**
 * Return the passed function wrapped with the current scope so it is accessible
 * whenever the function runs. This is primarily to make the scope accessible in
 * hook callbacks.
 *
 * @param {Function} func The passed function.
 * @return {Function} The wrapped function.
 */
const withScope = ( func ) => {
	const scope = getScope();
	return ( ...args ) => {
		setScope( scope );
		const output = func( ...args );
		resetScope();
		return output;
	};
};

// TODO: document this.
export function useWatch( callback ) {
	useSignalEffect( withScope( callback ) );
}

// TODO: document this.
export function useInit( callback ) {
	useEffect( withScope( callback ), [] );
}

// For wrapperless hydration.
// See https://gist.github.com/developit/f4c67a2ede71dc2fab7f357f39cff28c
export const createRootFragment = ( parent, replaceNode ) => {
	replaceNode = [].concat( replaceNode );
	const s = replaceNode[ replaceNode.length - 1 ].nextSibling;
	function insert( c, r ) {
		parent.insertBefore( c, r || s );
	}
	return ( parent.__k = {
		nodeType: 1,
		parentNode: parent,
		firstChild: replaceNode[ 0 ],
		childNodes: replaceNode,
		insertBefore: insert,
		appendChild: insert,
		removeChild( c ) {
			parent.removeChild( c );
		},
	} );
};
