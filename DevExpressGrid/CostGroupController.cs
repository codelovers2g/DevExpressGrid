

using Comment.Model.Service;
using DevProject.Model.Data;
using DevProject.Model.Service;
using DMS.Model.Service;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Localization;
using mvc.Site.Areas.DevProject.ViewModel;
using MvcSite.Configuration.Model;
using Note.Model.Service;
using ResourceDefinition.Model.Data;
using siteComponent.Areas.RBACDefinition.PermissionGroups;
using siteComponent.Areas.Utils;
using siteComponent.SiteControllers;
using siteComponent.SiteModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UrlLink.Model.Service;


namespace mvc.Site.Areas.DevProject.Controllers;

[Area(DevProjectArea.Name)]
public class CostGroupController : EntityController
{
    #region Properties
    public ICostGroupService _CostGroupService { get; }
    public IMvcSiteContext MvcSiteContext { get; }
    #endregion

    #region Initialization
    public CostGroupController(ICostGroupService costGroupService,
        IDmsService dmsFileContract,
        INoteService noteService,
        IUrlLinkService urlLinkService,
        ICommentService commentService,
        IHtmlLocalizerFactory localizerFactory,
        IMvcSiteContext mvcSiteContext
        ) : base(dmsFileContract, noteService, urlLinkService, commentService, localizerFactory)
    {
        _CostGroupService = costGroupService;
        MvcSiteContext = mvcSiteContext;
    }
    #endregion

    #region Json/Data Modification Methods
    #region CostGroup
    public async Task<IEnumerable<GridRawItem<CostGroup>>> GetCostGroups(CancellationToken cancellationToken)
    {
        var lstCostGroup = await _CostGroupService.GetCostGroupAllAsync(cancellationToken);

        var res = lstCostGroup.Select(x =>
        {
            var newItem = x.GetGridRawItem();
            return newItem;
        }).ToList();
        return res;
    }
    public async Task<GridRawItem<CostGroup>> GetCostGroup(string uid, CancellationToken cancellationToken)
    {
        var costGroup = await _CostGroupService.GetCostGroupByUIDAsync(uid, cancellationToken);

        var newItem = costGroup.GetGridRawItem();
        return newItem;
    }
    public async Task<IActionResult> DeleteCostGroup(string key)
    {
        return await DeleteCostGroups(new List<string> { key });
    }
    public async Task<IActionResult> DeleteCostGroups(List<string> uids)
    {
        IActionResult res = null;
        if (uids?.Count > 0)
        {
            await _CostGroupService.DeleteCostGroupAsync(uids);
        }
        res = res ?? Ok();
        return res;
    }
    #endregion
    #endregion

    #region Views
    public async Task<IActionResult> vCostGroups()
    {
        return View(new vmCostGroups() { DicPermissions = UserPermissionContext.DicPermissions });
    }
    #endregion

    #region Partial Views

    #region CostGroup
    public async Task<IActionResult> pwCostGroupGrid()
    {
        OverlayModel overlayModel = Request.GetProvidedOverlay();
        WidgetModel widgetModel = Request.GetProvidedWidget();

        var model = new pwmCostGroupGrid(widgetModel, overlayModel) { RuntimeModel = new PlatformRuntimeModel() { DicPermissions = UserPermissionContext.DicPermissions } };
        model.OperatorAction = new RouteDescriptor() { Area = DevProjectArea.Name, Controller = this.GetSemanticName(), Action = nameof(CostGroupController.pwCostGroupEntity) };
        return PartialView(model);
    }
    #endregion
    #endregion
}

public static class CostGroupControllerExtensions
{
    public static GridRawItem<CostGroup> GetGridRawItem(this CostGroup x)
    {
        var newItem = new GridRawItem<CostGroup>() { Item = x };

        return newItem;
    }
}
