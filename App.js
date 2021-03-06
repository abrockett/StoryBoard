			Ext.define('CustomApp', {
                            extend: 'Rally.app.App',
                            componentCls: 'app',
                            
                            items: [
                            	{
                            		xtype: 'container',
                            		itemId: 'addNewButton'
                            	},
                            	{
                            		xtype: 'container',
                            		itemId: 'checkboxes',
                            		style: 'margin:0px 20px;'
                            	},
                            	{
                            		xtype: 'container',
                                    itemId: 'comboBox',
                                    style: 'margin:20px 0px;'
                            	},
                            	{
                            		xtype: 'container',
                            		itemId: 'cardBoard'
                            	}
                            ],
                        
                        	launch: function() {
                        	                    		                         		
                        		this.down('#checkboxes').add({
                                    xtype: 'checkbox',
                                    cls: 'checkBox',
                                    boxLabel: 'User Stories',
                                    id: 'storiesCheckbox',
                                    style: 'float:right; margin:0px 5px;',
                                    scope: this,
                                    handler: this._onSettingsChange,
                                    checked: true
                                    });
                                                
                                this.down('#checkboxes').add({
                                    xtype: 'checkbox',
                                    cls: 'checkBox',
                                    boxLabel: 'Defects',
                                    id: 'defectCheckbox',
                                    style: 'float:right; margin:0px 5px;',
                                    scope: this,
                                    handler: this._onSettingsChange,
                                    checked: true
                                    });
                                                
                                this.down('#checkboxes').add({
                                    xtype: 'checkbox',
                                    cls: 'checkBox',
                                    boxLabel: 'Defects Suites',
                                    id: 'defectSuiteCheckbox',
                                    style: 'float:right; margin:0px 5px;',
                                    scope: this,
                                    handler: this._onSettingsChange,
                                    checked: true
                                    });
                                    
                            	this.iterationCombobox = this.down('#comboBox').add({
                                	xtype: 'rallyiterationcombobox',
                                	style: 'float:right',
                                	listeners: {
                                		ready: this._onIterationComboboxLoad,
                                		change: this._onIterationComboboxChanged,
                                		scope: this
                                	}	
                            	});
                        	},
                        
                        _onIterationComboboxLoad: function() {
                            var addNewConfig = {
                            xtype: 'rallyaddnew',
                            recordTypes: ['User Story', 'Defect'],
                            ignoredRequiredFields: ['Name', 'Schedule State'],
                            style: 'margin:10px 10px -10px;',
                            showAddWithDetails: false,
                            listeners: {
                                beforerecordadd: this._onBeforeRecordAdd,
                                recordadd: this._onRecordAdd,
                                scope: this
                            }
                        };
                        
                        this.addNew = this.down('#addNewButton').add(addNewConfig);
                        
                            var cardBoardConfig = {
                                xtype: 'rallycardboard',
                                types: ['Defect', 'User Story'],
                                attribute: 'ScheduleState',
                                storeConfig: {
                                    filters: [this.iterationCombobox.getQueryFromSelected()]
                                }
                            };
                            this.cardBoard = this.down('#cardBoard').add(cardBoardConfig);
                        },
                        
                        _onIterationComboboxChanged: function() {
                            var config = {
                                storeConfig: {
                                    filters: [this.iterationCombobox.getQueryFromSelected()]
                                }
                            };
                        
                            this.cardBoard.refresh(config);
                        },
                        
                        _onBeforeRecordAdd: function(addNewComponent, eventArgs) {
                            // eventArgs.record is the new item that is about to get created
                            eventArgs.record.set('Iteration', this.iterationCombobox.getValue());
                        },
                        
                        _onRecordAdd: function() {
                            this.cardBoard.refresh();
                        },
                        
                        _getFilter: function() {
                                var filter = [];
                        
                                if (Ext.getCmp('storiesCheckbox').getValue()) filter.push('User Story');
                                
                                if (Ext.getCmp('defectCheckbox').getValue()) filter.push('Defect');
                                
                                if (Ext.getCmp('defectSuiteCheckbox').getValue()) filter.push('Defect Suite');
            
                        
                                return filter;
                            },
                        
                        _onSettingsChange: function() {
                                var newTypes = this._getFilter();
                                var config = {
                                types: newTypes
                            	};
                        
                            this.cardBoard.refresh(config);
                        	}
                    });
            Rally.launchApp('CustomApp', {
                name: 'Story Board'
            });