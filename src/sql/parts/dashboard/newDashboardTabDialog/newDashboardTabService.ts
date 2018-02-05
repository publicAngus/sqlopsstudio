/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import { INewDashboardTabService } from 'sql/parts/dashboard/newDashboardTabDialog/interface';
import { NewDashboardTabDialog } from 'sql/parts/dashboard/newDashboardTabDialog/newDashboardTabDialog';
import { IDashboardTab } from 'sql/platform/dashboard/common/dashboardRegistry';
import { IAngularEventingService, AngularEventType } from 'sql/services/angularEventing/angularEventingService';

import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';

export class NewDashboardTabService implements INewDashboardTabService {
	_serviceBrand: any;

	// MEMBER VARIABLES ////////////////////////////////////////////////////
	private _addNewTabDialog: NewDashboardTabDialog;
	private _uri: string;

	constructor(
		@IAngularEventingService private angularEventService: IAngularEventingService,
		@IInstantiationService private _instantiationService: IInstantiationService
	) { }

	/**
	 * Open account dialog
	 */
	public showDialog(dashboardTabs: Array<IDashboardTab>, uri: string): void {
		this._uri = uri;
		let self = this;

		// Create a new dialog if one doesn't exist
		if (!this._addNewTabDialog) {
			this._addNewTabDialog = this._instantiationService.createInstance(NewDashboardTabDialog);
			this._addNewTabDialog.onCancel(() => { self.handleOnCancel(); });
			this._addNewTabDialog.onAddTabs((selectedTabs) => { self.handleOnAddTabs(selectedTabs); });
			this._addNewTabDialog.render();
		}

		// Open the dialog
		this._addNewTabDialog.open(dashboardTabs);
	}

	// PRIVATE HELPERS /////////////////////////////////////////////////////
	private handleOnAddTabs(selectedTabs: Array<IDashboardTab>): void {
		this.angularEventService.sendAngularEvent(this._uri, AngularEventType.NEW_TABS, { dashboardTabs: selectedTabs });
		this._addNewTabDialog.close();
	}

	private handleOnCancel(): void { }
}