/**
 * WordPress dependencies
 */
import { __experimentalGetSettings, setSettings } from '@wordpress/date';

/**
 * Internal dependencies
 */
import { getFullPostScheduleLabel, getPostScheduleLabel } from '../label';

describe( 'getFullPostScheduleLabel', () => {
	it( 'should show a date', () => {
		const label = getFullPostScheduleLabel( '2022-04-28T15:30:00' );
		expect( label ).toBe( 'April 28, 2022 3:30\xa0pm UTC+0' ); // Unused, for backwards compatibility.
	} );

	it( "should show site's timezone abbr", () => {
		const settings = __experimentalGetSettings();

		setSettings( {
			...settings,
			timezone: { offset: 10, string: 'Australia/Sydney', abbr: 'AEST' },
		} );

		const label = getFullPostScheduleLabel( '2022-04-28T15:30:00' );
		expect( label ).toBe( 'April 28, 2022 3:30\xa0pm AEST' );

		setSettings( settings );
	} );

	it( "should show site's timezone offset", () => {
		const settings = __experimentalGetSettings();

		setSettings( {
			...settings,
			timezone: { offset: 10 },
		} );

		const label = getFullPostScheduleLabel( '2022-04-28T15:30:00' );
		expect( label ).toBe( 'April 28, 2022 3:30\xa0pm UTC+10' );

		setSettings( settings );
	} );
} );

describe( 'getPostScheduleLabel', () => {
	it( 'should show the post will be published immediately if no publish date is set', () => {
		const label = getPostScheduleLabel( undefined );
		expect( label ).toBe( 'Immediately' );
	} );

	it( 'should show the post will be published immediately if it has a floating date', () => {
		const label = getPostScheduleLabel( '2022-04-28T15:30:00', {
			isFloating: true,
		} );
		expect( label ).toBe( 'Immediately' );
	} );

	it( "should show full date if user timezone does not equal site's timezone", () => {
		const now = new Date( '2022-04-28T13:00:00.000Z' );
		jest.spyOn( now, 'getTimezoneOffset' ).mockImplementationOnce(
			() => 10 * -60 // UTC+10
		);

		const label = getPostScheduleLabel( '2022-04-28T15:30:00', { now } );
		expect( label ).toBe( 'April 28, 2022 3:30\xa0pm UTC+0' );
	} );

	it( "should show today if date is same day as now and user timezone equals site's timezone", () => {
		const settings = __experimentalGetSettings();

		setSettings( {
			...settings,
			timezone: { offset: 10 },
		} );

		const now = new Date( '2022-04-28T03:00:00.000Z' );
		jest.spyOn( now, 'getTimezoneOffset' ).mockImplementationOnce(
			() => 10 * -60 // UTC+10
		);

		const label = getPostScheduleLabel( '2022-04-28T15:30:00', { now } );
		expect( label ).toBe( 'Today at 3:30\xa0pm' );

		setSettings( settings );
	} );

	it( "should show tomorrow if date is same day as now + 1 day and user timezone equals site's timezone", () => {
		const settings = __experimentalGetSettings();

		setSettings( {
			...settings,
			timezone: { offset: 10 },
		} );

		const now = new Date( '2022-04-28T03:00:00.000Z' );
		jest.spyOn( now, 'getTimezoneOffset' ).mockImplementationOnce(
			() => 10 * -60 // UTC+10
		);

		const label = getPostScheduleLabel( '2022-04-29T15:30:00', { now } );
		expect( label ).toBe( 'Tomorrow at 3:30\xa0pm' );

		setSettings( settings );
	} );

	it( "should hide year if date is same year as now and user timezone equals site's timezone", () => {
		const settings = __experimentalGetSettings();

		setSettings( {
			...settings,
			timezone: { offset: 10 },
		} );

		const now = new Date( '2022-04-28T03:00:00.000Z' );
		jest.spyOn( now, 'getTimezoneOffset' ).mockImplementationOnce(
			() => 10 * -60 // UTC+10
		);

		const label = getPostScheduleLabel( '2022-12-25T15:30:00', { now } );
		expect( label ).toBe( 'December 25 3:30\xa0pm' );

		setSettings( settings );
	} );

	it( "should show year if date is not same year as now and user timezone equals site's timezone", () => {
		const settings = __experimentalGetSettings();

		setSettings( {
			...settings,
			timezone: { offset: 10 },
		} );

		const now = new Date( '2022-04-28T03:00:00.000Z' );
		jest.spyOn( now, 'getTimezoneOffset' ).mockImplementationOnce(
			() => 10 * -60 // UTC+10
		);

		const label = getPostScheduleLabel( '2023-04-28T15:30:00', { now } );
		expect( label ).toBe( 'April 28, 2023 3:30\xa0pm' );

		setSettings( settings );
	} );
} );
