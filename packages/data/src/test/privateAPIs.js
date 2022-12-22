/**
 * Internal dependencies
 */
import { createRegistry } from '../registry';
import createReduxStore from '../redux-store';
import { experiments as dataExperiments, unlock } from '../experiments';

/**
 * WordPress dependencies
 */
const { registerPrivateActionsAndSelectors } = unlock( dataExperiments );

beforeEach( () => {
	jest.useFakeTimers( 'legacy' );
} );

afterEach( () => {
	jest.runOnlyPendingTimers();
	jest.useRealTimers();
} );

describe( 'Private data APIs', () => {
	let registry;

	beforeEach( () => {
		registry = createRegistry();
	} );

	function getPublicPrice( state ) {
		return state.price;
	}
	function getSecretDiscount( state ) {
		return state.secretDiscount;
	}
	function setSecretDiscount( price ) {
		return { type: 'SET_PRIVATE_PRICE', price };
	}

	function setPublicPrice( price ) {
		return { type: 'SET_PUBLIC_PRICE', price };
	}
	function createStore() {
		const groceryStore = createReduxStore( 'grocer', {
			selectors: {
				getPublicPrice,
				getState: ( state ) => state,
			},
			actions: { setPublicPrice },
			reducer: ( state, action ) => {
				if ( action?.type === 'SET_PRIVATE_PRICE' ) {
					return {
						...state,
						secretDiscount: action?.price,
					};
				}
				return {
					price: 1000,
					secretDiscount: 800,
					...( state || {} ),
				};
			},
		} );
		registry.register( groceryStore );
		return groceryStore;
	}

	describe( 'private selectors', () => {
		it( 'should expose public selectors by default', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors(
				groceryStore,
				{},
				{ getSecretDiscount }
			);

			const publicSelectors = registry.select( groceryStore );
			expect( publicSelectors.getPublicPrice ).toEqual(
				expect.any( Function )
			);
		} );

		it( 'should not expose private selectors by default', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors(
				groceryStore,
				{},
				{ getSecretDiscount }
			);

			const publicSelectors = registry.select( groceryStore );
			expect( publicSelectors.getSecretDiscount ).toEqual( undefined );
		} );

		it( 'should make private selectors available via unlock()', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors(
				groceryStore,
				{},
				{ getSecretDiscount }
			);

			const privateSelectors = unlock( registry.select( groceryStore ) );
			expect( privateSelectors.getSecretDiscount ).toEqual(
				expect.any( Function )
			);
		} );

		it( 'should give private selectors access to the state', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors(
				groceryStore,
				{},
				{ getSecretDiscount }
			);

			const privateSelectors = unlock( registry.select( groceryStore ) );
			expect( privateSelectors.getSecretDiscount() ).toEqual( 800 );
		} );

		it( 'should throw a clear error when no private selectors are found in the unlock() call', () => {
			const groceryStore = createStore();

			// Forgot to wrap the `getSecretDiscount` in a { selectors: {} } object.

			expect( () =>
				unlock( registry.select( groceryStore ) )
			).toThrowError( /no experimental selectors were defined/ );
		} );
	} );

	describe( 'private actions', () => {
		it( 'should expose public actions by default', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors( groceryStore, {
				setSecretDiscount,
			} );
			const publicActions = registry.dispatch( groceryStore );
			expect( publicActions.setPublicPrice ).toEqual(
				expect.any( Function )
			);
		} );

		it( 'should not expose private actions by default', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors( groceryStore, {
				setSecretDiscount,
			} );
			const publicActions = registry.dispatch( groceryStore );
			expect( publicActions.setSecretDiscount ).toEqual( undefined );
		} );

		it( 'should make private actions available via unlock)', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors( groceryStore, {
				setSecretDiscount,
			} );
			const privateActions = unlock( registry.dispatch( groceryStore ) );
			expect( privateActions.setSecretDiscount ).toEqual(
				expect.any( Function )
			);
		} );

		it( 'should work with both private actions and private selectors at the same time', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors(
				groceryStore,
				{ setSecretDiscount },
				{ getSecretDiscount }
			);
			const privateActions = unlock( registry.dispatch( groceryStore ) );
			const privateSelectors = unlock( registry.select( groceryStore ) );
			expect( privateActions.setSecretDiscount ).toEqual(
				expect.any( Function )
			);
			expect( privateSelectors.getSecretDiscount ).toEqual(
				expect.any( Function )
			);
		} );

		it( 'should dispatch private actions like regular actions', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors( groceryStore, {
				setSecretDiscount,
			} );
			const privateActions = unlock( registry.dispatch( groceryStore ) );
			privateActions.setSecretDiscount( 400 );
			expect(
				registry.select( groceryStore ).getState().secretDiscount
			).toEqual( 400 );
		} );

		it( 'should dispatch private action thunks like regular actions', () => {
			const groceryStore = createStore();
			registerPrivateActionsAndSelectors(
				groceryStore,
				{
					setSecretDiscountThunk:
						( price ) =>
						( { dispatch } ) => {
							dispatch( { type: 'SET_PRIVATE_PRICE', price } );
						},
				},
				{ getSecretDiscount }
			);
			const privateActions = unlock( registry.dispatch( groceryStore ) );
			privateActions.setSecretDiscountThunk( 100 );
			expect(
				unlock( registry.select( groceryStore ) ).getSecretDiscount()
			).toEqual( 100 );
		} );

		it( 'should throw a clear error when no private actions are found in the unlock() call', () => {
			const groceryStore = createStore();
			// Forgot to wrap the `setSecretDiscount` in an { actions: {} } object.

			expect( () =>
				unlock( registry.dispatch( groceryStore ) )
			).toThrowError( /no experimental actions were defined/ );
		} );
	} );
} );
