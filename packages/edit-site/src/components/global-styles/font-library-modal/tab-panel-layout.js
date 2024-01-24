/**
 * WordPress dependencies
 */
import {
	__experimentalText as Text,
	__experimentalHeading as Heading,
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
	__experimentalHStack as HStack,
	Button,
	Notice,
	FlexBlock,
} from '@wordpress/components';
import { chevronLeft } from '@wordpress/icons';

function TabPanelLayout( {
	title,
	description,
	notice,
	handleBack,
	children,
	footer,
} ) {
	return (
		<div className="font-library-modal__tabpanel-layout">
			<Spacer margin={ 4 } />
			<VStack spacing={ 4 } justify="space-between">
				<header>
					<VStack spacing={ 2 }>
						{ notice && (
							<FlexBlock>
								<Spacer margin={ 4 } />
								<Notice status={ notice.type }>
									{ notice.message }
								</Notice>
							</FlexBlock>
						) }
						<Spacer margin={ 4 } />
						<HStack justify="flex-start">
							{ !! handleBack && (
								<Button
									variant="tertiary"
									onClick={ handleBack }
									icon={ chevronLeft }
									size="small"
								/>
							) }
							{ title && (
								<Heading
									level={ 2 }
									size={ 13 }
									className="edit-site-global-styles-header"
								>
									{ title }
								</Heading>
							) }
						</HStack>
						{ description && <Text>{ description }</Text> }
					</VStack>
				</header>
				<main>{ children }</main>
				{ footer && <footer>{ footer }</footer> }
			</VStack>
		</div>
	);
}

export default TabPanelLayout;
