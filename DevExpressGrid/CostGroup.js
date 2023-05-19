

<script>
                /*
                  In all widgets DO NOT use in the scripts at the scope of main function variables declarations like 'let dgSettingsVar = ...'
                  becase this variable is kept at the global and next (after widget reload) same definition will generate exception

                  Use 'var' decalrations or escape the variables by the function context as follow:
                */
                {
                    let dataSource = DevExpress.data.AspNet.createStore({
                        key: "Item.UID",
                        loadUrl: '@getAllUrl',
                        insertUrl: '',
                        updateUrl: '',
                        deleteUrl: '@deleteUrl'
                    });
                    let columns = [
                        {
                            dataField: "Item.Code",
                            caption: '@localizer["T-M-CostGroup-Code-sm"]',
                            isOnXS: true,
                        },
                        {
                            dataField: "Item.DisplayName",
                            caption: '@localizer["T-M-CostGroup-DisplayName-sm"]',
                            isOnXS: true,
                        },
                        {
                            dataField: "Item.RecordModified",
                            caption: '@localizer["T-M-CostGroup-RecordModified-sm"]',
                            dataType: "date",
                            format: { type: "dd/MM/yyyy" },
                        },
                    ];

                    let @dgSettingsVar = platform.devexterme.DG.Init.getCommonBehaviourSettings(null, {
                        arPageSizes: [50, 100, 250, 500],
                        exportFileName: "CostGroups.xlsx",
                        addRowCustomClickHandler: (e) => {
                         document.getElementById('@dgDivID').Operator('@ShowModeDC.AddModeCode', null);
                        },
                    });

                    @(dgSettingsVar).dataSource = dataSource;
                    //Make call to filter columns by screen resolution
                    platform.devexterme.DG.Init.FilterColumnsByResolution(@dgSettingsVar, columns);
                    @(dgSettingsVar).onSelectionChanged = function (e) {
                        e.component.byKey(e.currentSelectedRowKeys[0]).done(obj => {
                            if (obj) {
                                // console.log(obj);
                            }
                        });
                    };

                    platform.devexterme.DG.Init.addRowCommandMenuButton(@dgSettingsVar);

                    platform.devexterme.DG.Init.addDataItemChanged('@dgDivID', '@Html.Raw(HttpUtility.JavaScriptStringEncode(getCostGroupUrl))');

                    platform.devexterme.DG.Init.create('@dgDivID', @dgSettingsVar);

                    const getSelectedUID = (rowDataUID) => {
                        let uid = rowDataUID
                            ? rowDataUID :
                            platform.devexterme.DG.getInstance('@dgDivID').getSelectedRowsData()[0].Item.UID;
                        return uid;
                    }

                    let arCommands = [];

                    dataSource.load()
                        .done(function(data, extra)
                        {
                            if (@Json.Serialize(hasCreatePermisson)) {
                                arCommands.push(new platform.devexterme.DG.Init.Command( {
                                Caption: '@localizer["T-DG-ContextMenu-Add"]',
                                Title: '@localizer["T-DG-ContextMenu-Add-tt"]',
                                CommandFunction: e => {
                                    document.getElementById('@dgDivID').Operator('@ShowModeDC.AddModeCode', null);
                                },
                                IsGroupApplicable : true,
                                IsRowApplicable : false,
                                Specifics : null,
                                IsActivatedByDoubleClick : null,
                                IconClass: 'far fa-plus',
                                AlwaysActive: true
                                }));
                            }
                            else {
                                const $dgInstance =  $("#@dgDivID").dxDataGrid("instance")
                                      $dgInstance.option("editing.allowAdding", false);
                            }


                        arCommands.push(new platform.devexterme.DG.Init.Command( {
                            Caption: `@localizer["T-DG-ContextMenu-View"]`,
                            Title: `@localizer["T-DG-ContextMenu-View-tt"]`,
                            CommandFunction: e => {
                                const uid = getSelectedUID( e?.row?.data?.Item.UID ?? e?.data?.Item.UID);
                                document.getElementById('@dgDivID').Operator('@ShowModeDC.ViewModeCode', uid);
                            },
                            IsGroupApplicable : false,
                            IsRowApplicable : true,
                            Specifics : null,
                            IsActivatedByDoubleClick : true,
                            IconClass: 'far fa-eye',
                            AlwaysActive: false
                         }));

                        if (@Json.Serialize(hasEditPermisson)) {
                            arCommands.push(new platform.devexterme.DG.Init.Command( {
                                Caption: `@localizer["T-DG-ContextMenu-Edit"]`,
                                Title: `@localizer["T-DG-ContextMenu-Edit-tt"]`,
                                CommandFunction: e => {
                                    const uid = getSelectedUID( e?.row?.data?.Item.UID ?? e?.data?.Item.UID);
                                    document.getElementById('@dgDivID').Operator('@ShowModeDC.EditModeCode', uid);
                                },
                                IsGroupApplicable : false,
                                IsRowApplicable : true,
                                Specifics : null,
                                IsActivatedByDoubleClick : false,
                                IconClass: 'far fa-edit',
                                AlwaysActive: false
                            }));
                            arCommands.push(new platform.devexterme.DG.Init.Command( {
                                Caption: `@localizer["T-DG-ContextMenu-Copy"]`,
                                Title: `@localizer["T-DG-ContextMenu-Copy-tt"]`,
                                CommandFunction: e => {
                                    const uid = getSelectedUID( e?.row?.data?.Item.UID ?? e?.data?.Item.UID);
                                    console.log('@localizer["T-DG-ContextMenu-Copy"]' + ' command is under construction');
                                },
                                IsGroupApplicable : false,
                                IsRowApplicable : true,
                                Specifics : null,
                                IsActivatedByDoubleClick : false,
                                IconClass: 'far fa-clone',
                                AlwaysActive: false
                            }));
                            arCommands.push(new platform.devexterme.DG.Init.Command( {
                                Caption: `@localizer["T-DG-ContextMenu-Copy-UID"]`,
                                Title: `@localizer["T-DG-ContextMenu-Copy-UID-tt"]`,
                                CommandFunction: e => {
                                    return getSelectedUID( e?.row?.data?.Item.UID ?? e?.data?.Item.UID);
                                },
                                IsGroupApplicable : false,
                                IsRowApplicable : true,
                                Specifics : platform.devexterme.DG.Init.Command.SpecificsEnum.copyToClipboard,
                                IsActivatedByDoubleClick : false,
                                IconClass: 'far fa-copy',
                                AlwaysActive: false
                            }));
                            arCommands.push(new platform.devexterme.DG.Init.Command( {
                                Caption: `@localizer["T-DG-ContextMenu-Attach"]`,
                                Title: `@localizer["T-DG-ContextMenu-Attach-tt"]`,
                                CommandFunction: e => {
                                    let arRowData = e?.row?.data ? [e.row.data] : null;
                                    document.getElementById('@dgDivID').AttachFiles(arRowData);
                                },
                                IsGroupApplicable : true,
                                IsRowApplicable : false,
                                Specifics : null,
                                IsActivatedByDoubleClick : false,
                                IconClass: 'far fa-paperclip',
                                AlwaysActive: false
                            }));
                        }

                        if(@Json.Serialize(hasDeletePermisson)) {
                            arCommands.push(new platform.devexterme.DG.Init.Command( {
                                Caption: `@localizer["T-DG-ContextMenu-Delete"]`,
                                Title: `@localizer["T-DG-ContextMenu-Delete-tt"]`,
                                 CommandFunction: e => {
                                    let arRowData = e?.row?.data ? [e.row.data] : platform.devexterme.DG.getInstance('@dgDivID').getSelectedRowsData();
                                    document.getElementById('@dgDivID').Delete(arRowData);
                                },
                                IsGroupApplicable : true,
                                IsRowApplicable : true,
                                Specifics : null,
                                IsActivatedByDoubleClick : false,
                                IconClass: 'far fa-trash-alt',
                                AlwaysActive: false
                            }));
                        }

                        platform.devexterme.DG.Init.addCommands(`@dgDivID`, arCommands, '@cmdDivID', @Html.Raw(Model.Overlay.JS_GetFunctionAddCurrentOverlayTransitionEndEventHandler()));
                    });

                    platform.devexterme.DG.Init.applySelectionLogic(@dgSettingsVar, `@dgDivID`,
                            `@localizer["T-DG-Select-Page"]`, `@localizer["T-DG-Select-All"]`, `@localizer["T-DG-Select-Clear"]`
                    );

                };

                //Item Operator
                {
                    let actionDelegate = @Html.Raw(Model.JS_GetActionResponseInSRWidgetPutInOverlayDelegate(Model.OperatorAction.Area, Model.OperatorAction.Controller, Model.OperatorAction.Action, nextOverlayIndex));

                    let tabinx = 0;

                    document.getElementById('@dgDivID').Operator = (modecode, uid) => {
                        let obj = {
                            modecode,
                            @(OverlayModel.OverlayIndexParamName) : @(nextOverlayIndex),
                            uid,
                            tabinx,
                            dgid: '@dgDivID',
                        }
                        actionDelegate(obj);
                    };
                }

                //Grid Delete command
                {
                        document.getElementById('@dgDivID').Delete = arRowData => {
                        let command = uids => {
                            $.post('@deleteItUrl', { uids })
                                .done(response => {
                                    let dg = platform.devexterme.DG.getInstance("@dgDivID");
                                    dg.clearSelection();
                                    dg.refresh(true);
                                })
                                .fail(err => {
                                    console.log(err);
                                })
                        };

                        let fGetRowDataUID = x => x?.Item?.UID;
                        let fGetRowDataDescriptor = x => x?.Item?.DisplayName ?? x?.Item?.Code ?? x?.Item?.UID;
                        @cntDeleteModalExecuteFunc (arRowData, command,'@dgDivID', fGetRowDataUID, fGetRowDataDescriptor);
                    };
                }

                //Grid attach files command
                {
                    platform.devexterme.DG.DMS.ExtendEntityGridByAttachFilesFunction( {
                        DgDivID : '@dgDivID',
                        JSUploadFunction:  @Html.Raw(Model.JS_GetDocumentUploadForm(Url, nextOverlayIndex)),
                        EntityType: '@Html.GetJSStringLiteral(DevProjectIntegration.CostGroupEntityType)',
                        Module: '@Html.GetJSStringLiteral(DevProjectIntegration.Module)'
                    });
                }
            </script>